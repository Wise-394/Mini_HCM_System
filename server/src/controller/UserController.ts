import type { NextFunction, Request, Response } from 'express';
import { createUser, readUser } from '../services/userService.js';
import { UserProfileType } from '../types/types.js';

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
    if (req.params.id !== req.user!.uid) {
      console.log('unauthorized');
      return res.status(401).json({ message: 'unauthorized' });
    }

    const user: UserProfileType | null = await readUser(req.params.id);
    return res.status(200).json({ user });
  } catch (err) {
    if (err instanceof Error) {
      console.error('registerUser error:', err.message);
    }

    res.status(500).json({ message: 'Failed to retrieve user.' });
  }
};
