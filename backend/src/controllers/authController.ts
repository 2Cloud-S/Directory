import { Request, Response } from 'express';
import { createUser, getUser, updateUser } from '../models/User'; // Import updateUser function
import { auth } from '../config/firebase'; // Import Firebase auth

export const signUp = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  try {
    const userRecord = await auth.createUser({ email, password });
    const uid = userRecord.uid;
    const user = await createUser(uid, { email, name });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userRecord = await auth.getUserByEmail(email);
    const uid = userRecord.uid;
    const user = await getUser(uid);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const signOut = async (req: Request, res: Response) => {
  // Firebase handles sign-out on the client-side
  res.status(200).json({ message: 'Sign out successful' });
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { uid, name, email } = req.body;
    await updateUser(uid, { name, email });
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};