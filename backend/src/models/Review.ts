import { db } from '../config/firebase';

export interface Review {
  id: string;
  toolId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export const createReview = async (reviewData: Partial<Review>): Promise<Review> => {
  const review: Review = {
    id: db.collection('reviews').doc().id,
    toolId: reviewData.toolId || '',
    userId: reviewData.userId || '',
    rating: reviewData.rating || 0,
    comment: reviewData.comment || '',
    createdAt: new Date(),
  };
  await db.collection('reviews').doc(review.id).set(review);
  return review;
};

export const getReviewsForTool = async (toolId: string): Promise<Review[]> => {
  const snapshot = await db.collection('reviews').where('toolId', '==', toolId).get();
  return snapshot.docs.map(doc => doc.data() as Review);
};

export const updateReview = async (id: string, reviewData: Partial<Review>): Promise<Review> => {
  await db.collection('reviews').doc(id).update(reviewData);
  const doc = await db.collection('reviews').doc(id).get();
  return doc.data() as Review;
};

export const deleteReview = async (id: string): Promise<void> => {
  await db.collection('reviews').doc(id).delete();
};