"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes = require('./auth');
const meetingRoutes = require('./meeting');
const router = express_1.default.Router();
// router.delete('/delete-all',async (req, res) => {
//     await prisma.user.deleteMany();
//     res.json({ message: 'users deleted' });
//   })
router.use('/', authRoutes);
router.use('/meetings', meetingRoutes);
module.exports = router;
//# sourceMappingURL=index.js.map