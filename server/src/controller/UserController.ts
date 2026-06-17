import type { NextFunction, Request, Response } from 'express';
import { createUser } from '../services/userService.js';
import { UserProfileType } from '../types/types.js';
import { nextTick } from 'node:process';

//save user profile data to users collection
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { uid, name, email, timezone, schedule } = req.body;

    if (req.user?.uid !== uid) {
      res.status(403).json({ message: 'Unauthorized.' });
      return;
    }

    const userProfile: UserProfileType = {
      uid,
      name,
      email,
      role: 'employee',
      timezone,
      schedule: {
        start: schedule.start,
        end: schedule.end,
      },
    };

    const newUser = await createUser(userProfile);

    res
      .status(201)
      .json({ message: 'User registered successfully.', user: newUser });
  } catch (err) {
    if (err instanceof Error) {
      console.error('registerUser error:', err);
    }

    res.status(500).json({ message: 'Failed to register user.' });
  }
};
