import { Router } from 'express';
import { getUser, registerUser } from '../controller/UserController.js';
import { verifyToken } from '../middleware/verifyToken.js';
export const usersRoute = Router();

usersRoute.post('/', verifyToken, registerUser);
usersRoute.get('/:id', verifyToken, getUser);
