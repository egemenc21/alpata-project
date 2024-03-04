import express from "express";
const authRoutes = require('./auth')
const meetingRoutes = require('./meeting')


const router = express.Router();

router.use('/',authRoutes)
router.use('/meetings',meetingRoutes)

module.exports = router