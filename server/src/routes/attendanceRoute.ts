import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  getAttendanceOfUserByDate,
  getLastPunchAttendanceByUser,
  punchAttendance,
} from '../controller/attendanceController.js';
import { validateAttendance } from '../middleware/validation.js';
import { handleValidationErrors } from '../middleware/handleValidationErrors.js';

// POST   /api/attendance/punch                 → save a punch in or out
// GET    /api/attendance/:userId/date        → get today's punches for a user
// GET    /api/attendance/:userId/last-punch    → get last punch

export const attendanceRouter = Router();

attendanceRouter.use(verifyToken);
attendanceRouter.get(
  '/:userId/last-punch',

  getLastPunchAttendanceByUser
);
attendanceRouter.get('/:userId/:date', getAttendanceOfUserByDate);
attendanceRouter.post(
  '/punch',
  validateAttendance,
  handleValidationErrors,
  punchAttendance
);
