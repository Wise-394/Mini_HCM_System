import { Router } from 'express';
import { getUser, registerUser } from '../controller/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { validateUserProfile } from '../middleware/validation.js';
import { handleValidationErrors } from '../middleware/handleValidationErrors.js';
export const usersRoute = Router();

// POST   /api/users                  → register a new user profile
// GET    /api/users/:userId          → get user profile by their user ID
usersRoute.post(
  '/',
  verifyToken,
  validateUserProfile,
  handleValidationErrors,
  registerUser
);
usersRoute.get('/:userId', verifyToken, getUser);
