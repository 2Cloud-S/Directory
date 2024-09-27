import { Request, Response } from 'express';
import { createReview, getReviewsForTool, updateReview, deleteReview } from '../models/Review';
import { updateToolRating } from '../models/Tool';
import { trackEvent } from '../services/analyticsService';

export const createReviewHandler = async (req: Request, res: Response) => {
  try {
    const { toolId, userId, rating, comment } = req.body;
    const review = await createReview({ toolId, userId, rating, comment });
    await updateToolRating(toolId);
    await trackEvent(userId, 'review_created', { toolId, rating });
    res.status(201).json(review);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const getReviewsHandler = async (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;
    const reviews = await getReviewsForTool(toolId);
    res.json(reviews);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const updateReviewHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const updatedReview = await updateReview(id, { rating, comment });
    await updateToolRating(updatedReview.toolId);
    res.json(updatedReview);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const deleteReviewHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteReview(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};