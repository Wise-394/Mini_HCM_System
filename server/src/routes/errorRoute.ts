import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';

export const errorRouter = Router();

errorRouter.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: err.message || 'Internal Server Error',
  });
});
