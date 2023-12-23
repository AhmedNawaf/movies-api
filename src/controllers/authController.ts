import { db } from '../db';
import { sign } from '../utils/jwtHelpers';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (user && bcrypt.compareSync(password, user.password)) {
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        accessToken: sign({ userId: user.id }),
      },
    });
  } else {
    res.status(401).json({
      message: 'Invalid credentials',
    });
  }
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  try {
    await db.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
      },
    });
    res.json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({
      messasge: 'Something went wrong!',
    });
  }
}

export async function me(req: Request, res: Response) {
  // To make TypeScript happy :)
  if (!('userId' in req)) return;
  if (typeof req.userId !== 'number') return;

  const user = await db.user.findUnique({
    where: {
      id: req.userId,
    },
  });
  if (!user)
    return res.json({
      success: false,
      message: 'No record with this Id',
    });
  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}
