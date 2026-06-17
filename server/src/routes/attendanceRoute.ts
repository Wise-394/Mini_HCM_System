import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  getLastAttendanceDocByUserController,
  punchAttendance,
  validateAttendance,
} from '../controller/AttendanceController.js';

// POST   /api/attendance/punch          → save a punch in or out
// GET    /api/attendance/:userId/today  → get today's punches for a user
// GET    /api/attendance/:userId/last-punch → get last punch (check if user is in or out)

export const attendanceRouter = Router();

attendanceRouter.get(
  '/:userId/last-punch',
  verifyToken,
  getLastAttendanceDocByUserController
);
attendanceRouter.post(
  '/punch',
  verifyToken,
  validateAttendance,
  punchAttendance
);
