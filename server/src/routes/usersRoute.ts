import { Router } from 'express';
import { registerUser } from '../controller/UserController.js';
import { verifyToken } from '../middleware/verifyToken.js';
export const usersRoute = Router();

//check token -> save user data to users collection
usersRoute.post('/', verifyToken, registerUser);
