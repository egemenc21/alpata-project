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
const path_1 = __importDefault(require("path"));
const date_fns_1 = require("date-fns");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/files");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
//mailer
let mailTransporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
    },
});
const sendEmail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    yield mailTransporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        text,
    });
});
//Get all meetings
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorId = parseInt(req.params.id);
    const meetings = yield prisma_1.prisma.meeting.findMany({
        where: {
            authorId,
        },
        include: {
            document: true,
        },
    });
    res.json(meetings);
}));
//Creating meetings
router.post("/", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { title, startDate, endDate, description, authorId, authorEmail } = req.body;
    const newAuthorId = parseInt(authorId);
    const newStartDate = (0, date_fns_1.parseISO)(startDate);
    const newEndDate = (0, date_fns_1.parseISO)(endDate);
    const meeting = yield prisma_1.prisma.meeting.create({
        data: {
            title,
            startDate: newStartDate,
            endDate: newEndDate,
            description,
            authorId: newAuthorId,
        },
    });
    let document;
    if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename)
        document = yield prisma_1.prisma.document.create({
            data: {
                filename: (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename,
                link: (_c = req.file) === null || _c === void 0 ? void 0 : _c.path,
                meetingId: meeting.id,
            },
        });
    //send email to the author about the meeting
    if (authorEmail) {
        yield sendEmail(authorEmail, "Meeting Created", `Hi, a new meeting "${title}" has been created.\n
        Start date: ${newStartDate.toDateString()}\n
        End date: ${newEndDate.toDateString()}`);
    }
    res.json(meeting);
}));
// Update a meeting
router.put("/:id", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    const { id } = req.params;
    if (!req.file)
        res.json("No file").status(404);
    console.log(id);
    const { title, startDate, endDate, description, documentId, documentName } = req.body;
    const integerMeetingId = parseInt(id);
    const newStartDate = (0, date_fns_1.parseISO)(startDate);
    const newEndDate = (0, date_fns_1.parseISO)(endDate);
    //update meeting
    const updatedMeeting = yield prisma_1.prisma.meeting.update({
        where: { id: integerMeetingId },
        data: {
            title,
            startDate: newStartDate,
            endDate: newEndDate,
            description,
        },
    });
    const filePath = path_1.default.join(__dirname, "..", "public", "files", documentName);
    //delete the previous document from files
    if (fs_1.default.existsSync(filePath)) {
        // delete the document
        fs_1.default.unlinkSync(filePath);
        console.log("File deleted successfully");
    }
    else {
        console.log("File not found");
    }
    // update document with new document
    const updatedDocument = yield prisma_1.prisma.document.update({
        where: { id: parseInt(documentId) },
        data: {
            filename: (_d = req.file) === null || _d === void 0 ? void 0 : _d.filename,
            link: (_e = req.file) === null || _e === void 0 ? void 0 : _e.path,
            meetingId: integerMeetingId,
        },
    });
    res.json({ updatedMeeting, updatedDocument }).status(200);
}));
//Delete a meeting
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.prisma.document.deleteMany({
        where: {
            meetingId: parseInt(id),
        },
    });
    yield prisma_1.prisma.meeting.delete({
        where: {
            id: parseInt(id),
        },
    });
    res.json({ message: "Meeting deleted" });
}));
module.exports = router;
