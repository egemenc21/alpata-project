import express from "express";
import {prisma} from "../lib/prisma";
import { start } from "repl";
import { parseISO } from "date-fns";

const router = express.Router();

//Get all meetings
router.get("/:id", async (req, res) => {
  const authorId = parseInt(req.params.id);
  const meetings = await prisma.meeting.findMany({
    where: {
      authorId
    }
  });
  res.json(meetings);
});

//Creating meetings
router.post('/', async (req, res) => {
    const { title, startDate, endDate, description, authorId } = req.body;
    const newStartDate = parseISO(startDate);
    const newEndDate = parseISO(endDate);
    const meeting = await prisma.meeting.create({
      data: {
        title,
        startDate: newStartDate,
        endDate: newEndDate,
        description,
        authorId,
      }
    });
    res.json(meeting);
  });


// Toplantı güncelleme
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, startDate, endDate, description, authorId } = req.body;
    const updatedMeeting = await prisma.meeting.update({
      where: { id: parseInt(id) },
      data: {
        title,
        startDate,
        endDate,
        description,
        authorId,
      }
    });
    res.json(updatedMeeting);
  });

//Delete a meeting

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.meeting.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Meeting deleted' });
  });
  
 

module.exports = router;
