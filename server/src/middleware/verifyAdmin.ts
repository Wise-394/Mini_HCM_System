import type { Request, Response, NextFunction } from 'express';
import { readUser } from '../services/userService.js';

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.uid;
    const user = await readUser(userId);

    if (!user || user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Operation requires admin privileges.' });
    }

    return next();
  } catch (err) {
    if (err instanceof Error) console.error(err.message);
    return res.status(500).json({ message: 'Failed to verify admin' });
  }
};
