import express from 'express';
import { createReviewHandler, getReviewsHandler, updateReviewHandler, deleteReviewHandler } from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, createReviewHandler);
router.get('/:toolId', getReviewsHandler);
router.put('/:id', authenticate, updateReviewHandler);
router.delete('/:id', authenticate, deleteReviewHandler);

export default router;