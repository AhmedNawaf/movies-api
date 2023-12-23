import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'some-secret';
const expiresIn = process.env.JWT_EXPIRES_IN;

interface UserPayload {
  userId: number;
}

export function sign(payload: UserPayload) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verify(token: string) {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    return false;
  }
}
