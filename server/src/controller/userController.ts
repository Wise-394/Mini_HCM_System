import type { NextFunction, Request, Response } from 'express';
import { createUser, readUser } from '../services/userService.js';
import { UserProfileType } from '../types/types.js';

//----------------------------------------------------------------
//Middleware Controllers for the route /register

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
      .status(200)
      .json({ message: 'User registered successfully.', data: newUser });
  } catch (err) {
    if (err instanceof Error) {
      console.error('registerUser error:', err.message);
    }
    res.status(500).json({ message: 'Failed to register user.' });
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.params.userId !== req.user!.uid) {
      return res.status(403).json({ message: 'Unauthorized access.' });
    }

    const user: UserProfileType | null = await readUser(req.params.userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User profile data does not exist.' });
    }

    return res.status(200).json({ data: user });
  } catch (err) {
    if (err instanceof Error) {
      console.error('getUser error:', err.message);
    }
    res.status(500).json({ message: 'Failed to retrieve user.' });
  }
};
