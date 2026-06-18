import { Router } from 'express';
import { getUser, registerUser } from '../controller/UserController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { validateUserProfile } from '../middleware/validation.js';
import { handleValidationErrors } from '../middleware/handleValidationErrors.js';
export const usersRoute = Router();

usersRoute.post(
  '/',
  verifyToken,
  validateUserProfile,
  handleValidationErrors,
  registerUser
);
usersRoute.get('/:id', verifyToken, getUser);

// TODO
//1. Fetch attendance record for that userId + date from attendance
// Fetch user schedule from users collection
// Compute late, undertime, regular, OT, ND
// Save results to dailySummary/{userId}_{date}
// Return the summary to frontend

// {
//   "id": "user_abc123_2025-06-18",
//   "userId": "user_abc123",
//   "date": "2025-06-18",
//   "regularHours": 8.75,
//   "overtimeHours": 2.0,
//   "nightDiffHours": 0.0,
//   "lateMinutes": 15,
//   "undertimeMinutes": 0
// }
