import { Request, Response } from 'express';
import { getToolAnalytics, getUserAnalytics, getOverallAnalytics } from '../services/analyticsService';

export const getToolAnalyticsHandler = async (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;
    const analytics = await getToolAnalytics(toolId);
    res.json(analytics);
  } catch (error) {
    console.error('Error in getToolAnalyticsHandler:', error);
    res.status(500).json({ error: 'An error occurred while fetching tool analytics' });
  }
};

export const getUserAnalyticsHandler = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const analytics = await getUserAnalytics(userId);
    res.json(analytics);
  } catch (error) {
    console.error('Error in getUserAnalyticsHandler:', error);
    res.status(500).json({ error: 'An error occurred while fetching user analytics' });
  }
};

export const getOverallAnalyticsHandler = async (req: Request, res: Response) => {
  try {
    const analytics = await getOverallAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error in getOverallAnalyticsHandler:', error);
    res.status(500).json({ error: 'An error occurred while fetching overall analytics' });
  }
};