import express from "express";
import {prisma} from "../lib/prisma";
import {start} from "repl";
import path from "path";
import {parseISO} from "date-fns";
import multer from "multer";

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
  const {title, startDate, endDate, description, authorId} = req.body;
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
        link: req.file.path,
        meetingId: meeting.id,
      },
    });
  res.json(meeting);
});

// Update a meeting

router.put("/:id", async (req, res) => {
  const {id} = req.params;
  const {title, startDate, endDate, description, authorId} = req.body;
  const updatedMeeting = await prisma.meeting.update({
    where: {id: parseInt(id)},
    data: {
      title,
      startDate,
      endDate,
      description,
      authorId,
    },
  });
  res.json(updatedMeeting);
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
