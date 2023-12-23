import type { Request, Response, NextFunction } from 'express';
import { db } from '../db';

export async function adminCheck(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = await db.user.findUnique({ where: { id: req.userId } });
  user?.isAdmin ? next() : res.status(403).json({ message: 'Forbidden' });
}
