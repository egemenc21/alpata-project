import express from "express";
import {prisma} from "../lib/prisma";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"

const bcrypt = require("bcrypt");
const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(12);

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({storage});

router.get("/list", async (req, res) => {
  const allUsers = await prisma.user.findMany();

  console.log(allUsers);
  res.json(allUsers);
});

router.get("/me", (req, res) => {
  const token = req.cookies?.token;
  if (token && jwtSecret) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

router.post("/register", upload.single("file"), async (req, res) => {
  const {name, surname, phone, email, password} = req.body;
  const hashedPassword = bcrypt.hashSync(password, bcryptSalt);

  if (req.file?.filename) {
    try {
      const createdUser = await prisma.user.create({
        data: {
          email,
          name,
          surname,
          phone,
          password: hashedPassword,
          profile_picture: req.file?.filename,
        },
      });
      if (jwtSecret)
        jwt.sign(
          {
            id: createdUser.id,
            name,
            surname,
            email,
            profile_picture: req.file?.filename,
          },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res
              .cookie("token", token, {sameSite: "none", secure: true})
              .status(201)
              .json({
                id: createdUser.id,
                name,
                surname,
                email,
                profile_picture: req.file?.filename,
              });
          }
        );
    } catch (error) {
      if (error) res.status(500).json(error);
    }

    const mailDetails = {
      from: 'egemenc2101@gmail.com',
      to: email,
      subject: 'Welcome to Your Alpata Meeting App!',
      html: `<p>Welcome, ${name}!</p><p>Your Alpata account has been created successfully.</p>`,
    };

    mailTransporter
    .sendMail(mailDetails,
        function (err, data) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
              console.log('Email sent: ' + data.response + 'successfully!');
            }
        });
  }
});

router.post(
  "/register/profile",
  upload.single("file"),
  async function (req, res, next) {
    try {
      const updatedUser = await prisma.user.update({
        where: {email: req.body.userEmail},
        data: {
          profile_picture: req.file?.filename,
        },
      });
      console.log(updatedUser.profile_picture);
      res.json(updatedUser.profile_picture);
    } catch (error) {
      res.json(error);
    }
  }
);

router.post("/sign-in", async (req, res) => {
  const {email, password} = req.body;
  const foundUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  console.log(foundUser);

  if (foundUser && jwtSecret) {
    const passwordEqual = bcrypt.compareSync(password, foundUser.password);
    if (passwordEqual) {
      jwt.sign(
        {
          id: foundUser.id,
          email,
          name: foundUser.name,
          surname: foundUser.surname,
          profile_picture: foundUser.profile_picture,
        }, //used on '/me' api route
        jwtSecret,
        {},
        (err, token) => {
          res.cookie("token", token).json({
            id: foundUser.id,
            email,
            name: foundUser.name,
            surname: foundUser.surname,
            profile_picture: foundUser.profile_picture,
          });
        }
      );
    }
  }
});

router.post("/sign-out", (req, res) => {
  res.cookie("token", "").json("Sign out has been successful");
});
module.exports = router;
