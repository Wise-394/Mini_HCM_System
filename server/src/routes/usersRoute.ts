import { Router } from 'express';
import { getUser, registerUser } from '../controller/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { validateUserProfile } from '../middleware/validation.js';
import { handleValidationErrors } from '../middleware/handleValidationErrors.js';
export const usersRouter = Router();

// POST   /api/users                  → register a new user profile
// GET    /api/users/:userId          → get user profile by their user ID

usersRouter.use(verifyToken);
usersRouter.post(
  '/',
  validateUserProfile,
  handleValidationErrors,
  registerUser
);
usersRouter.get('/:userId', getUser);
