import express from 'express';

const router = express.Router();

import {
  getWatchList,
  toggleWatchList,
} from '../controllers/watchlistController';

import { check } from '../middlewares/auth';

router.post('/', check, toggleWatchList);
router.get('/', check, getWatchList);

export default router;
