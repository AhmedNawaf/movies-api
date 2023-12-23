import type { Request, Response } from 'express';
import { db } from '../db';

export async function createMovie(req: Request, res: Response) {
  const { name, category, description } = req.body;
  try {
    await db.movie.create({
      data: {
        name,
        category,
        description,
      },
    });
    return res.json({
      success: true,
      message: 'Create Success',
    });
  } catch (error) {
    return res.json({ message: 'Something went wrong' });
  }
}

export async function findMovieById(req: Request, res: Response) {
  const { id } = req.params;
  const movie = await db.movie.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      reviews: true,
    },
  });
  if (!movie)
    return res.status(404).json({
      success: false,
      message: 'Invalid credantials',
    });
  return res.json({
    success: true,
    data: movie,
  });
}

export async function updateMovie(req: Request, res: Response) {
  const { id } = req.params;
  const { name, category, description } = req.body;
  try {
    await db.movie.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        category,
        description,
      },
    });
    return res.json({
      success: true,
      message: 'Update Success',
    });
  } catch (error) {
    return res.json({
      success: false,
      messgae: 'Something went wrong',
    });
  }
}

export async function deleteMovie(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await db.movie.delete({
      where: {
        id: Number(id),
      },
    });
    return res.json({
      success: true,
      message: 'Delete Success',
    });
  } catch (error) {
    return res.json({
      success: true,
      message: 'Something went wrong',
    });
  }
}

export async function getMovies(req: Request, res: Response) {
  const page = Number(req.query?.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  const movies = await db.movie.findMany({
    include: {
      reviews: true,
    },
    skip,
    take: limit,
  });
  const total = await db.movie.count();
  const pages = Math.ceil(total / limit);
  res.json({
    success: true,
    pages,
    data: movies,
  });
}

export async function getReviews(req: Request, res: Response) {
  const { id } = req.params;
  const reviews = await db.review.findFirst({
    where: {
      movieId: Number(id),
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  res.json({
    success: true,
    data: reviews,
  });
}

export async function addReview(req: Request, res: Response) {
  const { id } = req.params;
  const { comment, rate } = req.body;

  const movie = await db.movie.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      reviews: true,
    },
  });
  if (!movie) return res.status(404).send();
  const isRated = movie.reviews.findIndex((m) => m.userId == req.userId);

  if (isRated > -1)
    return res.status(403).send({ message: 'Review is already added.' });

  const totalRate = movie.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const finalRate = (totalRate + rate) / (movie.reviews.length + 1);

  await db.movie.update({
    where: {
      id: Number(id),
    },
    data: {
      rating: finalRate,
      reviews: {
        create: {
          userId: req.userId,
          rating: Number(rate),
          comment,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    message: 'Create Success',
  });
}
