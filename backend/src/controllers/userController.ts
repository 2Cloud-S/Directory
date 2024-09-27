import { Request, Response } from 'express';
import { getUser, updateUser, deleteUser } from '../models/User';
import { trackEvent } from '../services/analyticsService';

export const getUserHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUser(id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
};

export const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const { uid, name, email } = req.body;
    if (!uid || !name || !email) {
      throw new Error('Missing required fields');
    }
    const updatedUser = await updateUser(uid, { name, email });
    await trackEvent(uid, 'user_updated', { updatedFields: ['name', 'email'] });
    res.json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    await trackEvent(id, 'user_deleted', {});
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};