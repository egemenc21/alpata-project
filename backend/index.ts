import {prisma} from "./lib/prisma.ts";
import express from "express";
import multer from "multer";
import path from "path";

const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
dotenv.config();
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

app.use(express.json({limit: "50mb"}));
app.use("/public/images/", express.static(__dirname + "/public/images/"));
app.use(
  express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000})
);
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.get("/list", async (req, res) => {
  const allUsers = await prisma.user.findMany();

  console.log(allUsers);
  res.json(allUsers);
});

app.get('/me', (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err:any, userData:any) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json('no token');
  }
});

app.post("/register", async (req, res) => {
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
    jwt.sign(
      { id: createdUser.id, name, surname, email },
      jwtSecret,
      {},
      (err:any, token:any) => {
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

app.post('/sign-in', async (req, res) => {
  const { username, password } = req.body;
  
} )

app.post("/register/profile", upload.single("file"), function (req, res, next) {
  console.log(req.file);
});
app.listen(4000);
