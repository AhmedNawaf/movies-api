import { db } from '../db';
import type { Request, Response } from 'express';

export async function toggleWatchList(req: Request, res: Response) {
  const { movieId } = req.body as { movieId: number | null };
  if (!movieId) return res.status(422).json({ message: 'Missing movieId' });
  const movie = await db.movie.findUnique({ where: { id: movieId } });
  if (!movie) return res.json({ message: 'Movie not found' });

  const user = await db.user.findUnique({
    where: {
      id: req.userId,
    },
    include: {
      watchList: true,
    },
  });
  if (!user) return res.json({ message: 'User not found' });
  const watchedMovie = user.watchList.find((elm) => elm.movieId === movie?.id);

  if (watchedMovie) {
    await db.watchList.delete({
      where: {
        ...watchedMovie,
      },
    });
    return res.json({
      sucess: true,
      message: 'Removed from the list successfully',
    });
  }
  await db.watchList.create({
    data: {
      movieId: movie.id,
      userId: user.id,
    },
  });

  res.json({
    success: true,
    message: 'Added to the list successfully',
  });
}

export async function getWatchList(req: Request, res: Response) {
  const user = await db.user.findUnique({
    where: { id: req.userId },
    include: { watchList: true },
  });
  if (!user) return res.json({ message: 'User not found' });
  res.json({
    success: true,
    data: user.watchList,
  });
}
