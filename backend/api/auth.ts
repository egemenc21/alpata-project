import express from "express";
import { prisma } from "../lib/prisma";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken"
const bcrypt = require("bcrypt");
const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(12);

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


router.get('/me', (req, res) => {
  const token = req.cookies?.token;
  if (token && jwtSecret) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json('no token');
  }
});

router.post("/register", async (req, res) => {
  const {name, surname, phone, email, password, profilePictureName} = req.body;
  const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
  try {
    const createdUser = await prisma.user.create({
      data: {        
        email,
        name,
        surname,
        phone,
        password: hashedPassword,    
        profile_picture: profilePictureName,  
      }
    })
    if(jwtSecret)
    jwt.sign(
      { id: createdUser.id, name, surname, email },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie('token', token, { sameSite: 'none', secure: true })
          .status(201)
          .json({
            id: createdUser.id,
            name,
            surname,
            email,
          });
      }
    );
  } catch (error) {
    if (error) res.status(500).json(error);
  }
  console.log(name, surname, phone, email, password);
});

router.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await prisma.user.findFirst({
    where:{
      email
    }
  })
  console.log(foundUser)

  if(foundUser && jwtSecret){
    const passwordEqual = bcrypt.compareSync(password, foundUser.password);
    console.log(passwordEqual)
    if (passwordEqual) {
      console.log('sdfsd')
      jwt.sign(
        { id: foundUser.id, email, name: foundUser.name, surname: foundUser.surname }, //used on '/me' api route
        jwtSecret,
        {},
        (err, token) => {
          res.cookie('token', token).json({
            id: foundUser.id, email, name: foundUser.name, surname: foundUser.surname
          });
        }
      );
    }
  }
} )

router.post("/register/profile", upload.single("file"), function (req, res, next) {
  res.json('image uploaded')
});

router.post('/sign-out', (req, res) => {
  res.cookie('token', '').json('Sign out has been successful');
});
module.exports = router;