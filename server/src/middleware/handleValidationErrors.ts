import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

//----------------------------------------------------------------
//Middleware for handling unhandled erros

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg });
    return;
  }
  next();
};
