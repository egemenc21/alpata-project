import {prisma} from "./lib/prisma.ts";
import express from "express";

const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

// const jwt = require("jsonwebtoken");
dotenv.config();

const allRoutes = require('./api/index.ts');

app.use(express.json({limit: "50mb"}));
app.use("/public/", express.static(__dirname + "/public/"));
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

app.use('/', allRoutes);

app.listen(4000);
