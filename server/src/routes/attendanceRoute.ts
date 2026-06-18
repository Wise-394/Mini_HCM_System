import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  getLastAttendanceByUser,
  punchAttendance,
  validateAttendanceType,
} from '../controller/AttendanceController.js';
import { validateAttendance } from '../middleware/validation.js';
import { handleValidationErrors } from '../middleware/handleValidationErrors.js';

// POST   /api/attendance/punch                 → save a punch in or out
// GET    /api/attendance/:userId/today         → get today's punches for a user
// GET    /api/attendance/:userId/last-punch    → get last punch (check if user is in or out)

export const attendanceRouter = Router();

attendanceRouter.get(
  '/:userId/last-punch',
  verifyToken,
  getLastAttendanceByUser
);
attendanceRouter.post(
  '/punch',
  verifyToken,
  validateAttendance,
  handleValidationErrors,
  validateAttendanceType,
  punchAttendance
);
