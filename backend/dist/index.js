"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookieParser = require('cookie-parser');
const app = (0, express_1.default)();
const dotenv = require("dotenv");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
dotenv.config();
const allRoutes = require('./api/index');
app.use(express_1.default.json({ limit: "50mb" }));
app.use("/public/", express_1.default.static(__dirname + "/public/"));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));
app.use('/', allRoutes);
app.listen(4000);
