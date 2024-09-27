import { db } from '../config/firebase';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  website: string;
  pricing: string;
  features: string[];
  rating: number;
  reviewCount: number;
  createdAt: Date;
}

export const createTool = async (toolData: Partial<Tool>): Promise<Tool> => {
  const tool: Tool = {
    id: db.collection('tools').doc().id,
    name: toolData.name || '',
    description: toolData.description || '',
    category: toolData.category || '',
    website: toolData.website || '',
    pricing: toolData.pricing || '',
    features: toolData.features || [],
    rating: 0,
    reviewCount: 0,
    createdAt: new Date(),
  };
  await db.collection('tools').doc(tool.id).set(tool);
  return tool;
};

export const getTool = async (id: string): Promise<Tool | null> => {
  const doc = await db.collection('tools').doc(id).get();
  return doc.exists ? (doc.data() as Tool) : null;
};

export const updateTool = async (id: string, toolData: Partial<Tool>): Promise<Tool> => {
  await db.collection('tools').doc(id).update(toolData);
  return getTool(id) as Promise<Tool>;
};

export const deleteTool = async (id: string): Promise<void> => {
  await db.collection('tools').doc(id).delete();
};

export const getAllTools = async (): Promise<Tool[]> => {
  const snapshot = await db.collection('tools').get();
  return snapshot.docs.map(doc => doc.data() as Tool);
};

export const updateToolRating = async (toolId: string): Promise<void> => {
  const reviewsSnapshot = await db.collection('reviews').where('toolId', '==', toolId).get();
  const reviews = reviewsSnapshot.docs.map(doc => doc.data());
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  await db.collection('tools').doc(toolId).update({
    rating: averageRating,
    reviewCount: reviews.length,
  });
};