import express from 'express';
import { login, register, me } from '../controllers/authController';
import { check } from '../middlewares/auth';

const router = express.Router();

/**
 * Routes.
 */
router.post('/login', login);
router.post('/register', register);
router.get('/me', check, me);

export default router;
