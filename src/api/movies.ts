import express from 'express';
import * as controller from '../controllers/moviesController';
import { check } from '../middlewares/auth';
import { adminCheck } from '../middlewares/admin';

const router = express.Router();

router.post('/', [check, adminCheck], controller.createMovie);
router.put('/:id', [check, adminCheck], controller.updateMovie);
router.delete('/:id', [check, adminCheck], controller.deleteMovie);

router.get('/', check, controller.getMovies);
router.get('/', check, controller.findMovieById);

router.post('/:id/reviews', check, controller.addReview);
router.get('/:id/reviews', controller.getReviews);

export default router;
