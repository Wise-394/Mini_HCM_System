import { Router } from 'express';
import { registerUser } from '../controller/UserController.js';
import { verifyToken } from '../middleware/verifyToken.js';
export const usersRoute = Router();

usersRoute.post('/', verifyToken, registerUser);
