import express from "express";
import {prisma} from "../lib/prisma";
import {start} from "repl";
import path from "path";
import {parseISO} from "date-fns";
import multer from "multer";
import fs from "fs";
import nodemailer from "nodemailer";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({storage});

//mailer

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

const sendEmail = async (to: string, subject: string, text: string) => {
  await mailTransporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    text,
  });
};

//Get all meetings
router.get("/:id", async (req, res) => {
  const authorId = parseInt(req.params.id);
  const meetings = await prisma.meeting.findMany({
    where: {
      authorId,
    },
    include: {
      document: true,
    },
  });
  res.json(meetings);
});

//Creating meetings
router.post("/", upload.single("file"), async (req, res) => {
  const {title, startDate, endDate, description, authorId, authorEmail} = req.body;
  const newAuthorId = parseInt(authorId);
  const newStartDate = parseISO(startDate);
  const newEndDate = parseISO(endDate);
  const meeting = await prisma.meeting.create({
    data: {
      title,
      startDate: newStartDate,
      endDate: newEndDate,
      description,
      authorId: newAuthorId,
    },
  });

  let document;
  if (req.file?.filename)
    document = await prisma.document.create({
      data: {
        filename: req.file?.filename,
        link: req.file?.path,
        meetingId: meeting.id,
      },
    });

    //send email to the author about the meeting
    if (authorEmail) {
      await sendEmail(
        authorEmail,
        "Meeting Created",
        `Hi, a new meeting "${title}" has been created.\n
        Start date: ${newStartDate.toDateString()}\n
        End date: ${newEndDate.toDateString()}`
      );
    }

  res.json(meeting);
});

// Update a meeting

router.put("/:id", upload.single("file"), async (req, res) => {
  const {id} = req.params;
  if (!req.file) res.json("No file").status(404);

  console.log(id);

  const {title, startDate, endDate, description, documentId, documentName} =
    req.body;

  const integerMeetingId = parseInt(id);
  const newStartDate = parseISO(startDate);
  const newEndDate = parseISO(endDate);

  //update meeting
  const updatedMeeting = await prisma.meeting.update({
    where: {id: integerMeetingId},
    data: {
      title,
      startDate: newStartDate,
      endDate: newEndDate,
      description,
    },
  });

  const filePath = path.join(__dirname, "..", "public", "files", documentName);

  //delete the previous document from files
  if (fs.existsSync(filePath)) {
    // delete the document
    fs.unlinkSync(filePath);
    console.log("File deleted successfully");
  } else {
    console.log("File not found");
  }

  // update document with new document
  const updatedDocument = await prisma.document.update({
    where: {id: parseInt(documentId)},
    data: {
      filename: req.file?.filename,
      link: req.file?.path,
      meetingId: integerMeetingId,
    },
  });

  res.json({updatedMeeting, updatedDocument}).status(200);
});

//Delete a meeting

router.delete("/:id", async (req, res) => {
  const {id} = req.params;
  await prisma.document.deleteMany({
    where: {
      meetingId: parseInt(id),
    },
  });
  await prisma.meeting.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.json({message: "Meeting deleted"});
});

module.exports = router;
