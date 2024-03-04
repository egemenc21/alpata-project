// import {prisma} from "./lib/prisma.ts";
import express from "express";
import multer from "multer";
import path from "path";
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(12);

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
      cb(null,'public/images')
    },
    filename: (req,file,cb) => {
      cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    },
})
const upload = multer({storage})

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {

  const { name, surname, phone, email, password } = req.body;

  console.log(name, surname, phone, email, password);

});

app.post("/register/profile", upload.single('file'), function (req, res, next) {
  console.log(req.file)
})
app.listen(4000);
