import { getAuth } from 'firebase-admin/auth';
import { Request, Response, NextFunction } from 'express';

//successful verification -> attach to user object
//failed verification -> return res 401 unauthorized
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      message: 'Unable to proceed with the operation.',
    });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decoded = await getAuth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      message: 'Unable to proceed with the operation.',
    });
  }
};
