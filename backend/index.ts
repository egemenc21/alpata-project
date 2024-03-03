import { Request, Response } from "express";
import {prisma} from './lib/prisma.ts';

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
dotenv.config()
const jwtSecret = process.env.JWT_SECRET;
console.log(jwtSecret)

app.get("/test", (req: Request, res: Response) => {
  res.json("test ok");
});

app.listen(4000);
