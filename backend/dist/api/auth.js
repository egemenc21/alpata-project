"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../lib/prisma");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt = require("bcrypt");
const router = express_1.default.Router();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(12);
let mailTransporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
    },
});
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
router.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield prisma_1.prisma.user.findMany();
    console.log(allUsers);
    res.json(allUsers);
}));
router.get("/me", (req, res) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (token && jwtSecret) {
        jsonwebtoken_1.default.verify(token, jwtSecret, {}, (err, userData) => {
            if (err)
                throw err;
            res.json(userData);
        });
    }
    else {
        res.status(401).json("no token");
    }
});
router.post("/register", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { name, surname, phone, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) {
        try {
            const createdUser = yield prisma_1.prisma.user.create({
                data: {
                    email,
                    name,
                    surname,
                    phone,
                    password: hashedPassword,
                    profile_picture: (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename,
                },
            });
            if (jwtSecret)
                jsonwebtoken_1.default.sign({
                    id: createdUser.id,
                    name,
                    surname,
                    email,
                    profile_picture: (_c = req.file) === null || _c === void 0 ? void 0 : _c.filename,
                }, jwtSecret, {}, (err, token) => {
                    var _a;
                    if (err)
                        throw err;
                    res
                        .cookie("token", token, { sameSite: "none", secure: true })
                        .status(201)
                        .json({
                        id: createdUser.id,
                        name,
                        surname,
                        email,
                        profile_picture: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
                    });
                });
        }
        catch (error) {
            if (error)
                res.status(500).json(error);
        }
        const mailDetails = {
            from: 'egemenc2101@gmail.com',
            to: email,
            subject: 'Welcome to Your Alpata Meeting App!',
            html: `<p>Welcome, ${name}!</p><p>Your Alpata account has been created successfully.</p>`,
        };
        mailTransporter
            .sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            }
            else {
                console.log('Email sent: ' + data.response + 'successfully!');
            }
        });
    }
}));
router.post("/register/profile", upload.single("file"), function (req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedUser = yield prisma_1.prisma.user.update({
                where: { email: req.body.userEmail },
                data: {
                    profile_picture: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
                },
            });
            console.log(updatedUser.profile_picture);
            res.json(updatedUser.profile_picture);
        }
        catch (error) {
            res.json(error);
        }
    });
});
router.post("/sign-in", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const foundUser = yield prisma_1.prisma.user.findFirst({
        where: {
            email,
        },
    });
    console.log(foundUser);
    if (foundUser && jwtSecret) {
        const passwordEqual = bcrypt.compareSync(password, foundUser.password);
        if (passwordEqual) {
            jsonwebtoken_1.default.sign({
                id: foundUser.id,
                email,
                name: foundUser.name,
                surname: foundUser.surname,
                profile_picture: foundUser.profile_picture,
            }, //used on '/me' api route
            jwtSecret, {}, (err, token) => {
                res.cookie("token", token).json({
                    id: foundUser.id,
                    email,
                    name: foundUser.name,
                    surname: foundUser.surname,
                    profile_picture: foundUser.profile_picture,
                });
            });
        }
    }
}));
router.post("/sign-out", (req, res) => {
    res.cookie("token", "").json("Sign out has been successful");
});
module.exports = router;
//# sourceMappingURL=auth.js.map