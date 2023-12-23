import express from 'express';
import authRoutes from './auth';
import movieRoutes from './movies';
import watchListRoutes from './watchlist';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/movie', movieRoutes);
router.use('/watchlist', watchListRoutes);

export default router;
