import express from "express";
import { prisma } from "../lib/prisma";


const authRoutes = require('./auth')
const meetingRoutes = require('./meeting')


const router = express.Router();
// router.delete('/delete-all',async (req, res) => {
//     await prisma.user.deleteMany();
//     res.json({ message: 'users deleted' });
//   })
router.use('/',authRoutes)
router.use('/meetings',meetingRoutes)

module.exports = router