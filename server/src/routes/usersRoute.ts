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
