import type { Request, Response, NextFunction } from 'express';
import { verify } from '../utils/jwtHelpers';

export function check(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'] ?? null;
  // Authorization: Bearer token....
  const token = authHeader ? authHeader.replace('Bearer', '').trim() : null;
  if (!token) return res.json({ message: 'Missing token' });
  const payload = verify(token) as { userId: number };
  if (payload) {
    req.userId = payload.userId;
    return next();
  }
  res.status(401).json({
    message: 'Unauthorized!',
  });
}
