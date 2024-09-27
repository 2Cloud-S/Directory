import { db } from '../config/firebase';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export const createUser = async (id: string, userData: Partial<User>): Promise<User> => {
  const user: User = {
    id,
    name: userData.name || '',
    email: userData.email || '',
    role: userData.role || 'user',
    createdAt: new Date(),
  };
  await db.collection('users').doc(id).set(user);
  return user;
};

export const getUser = async (id: string): Promise<User | null> => {
  const doc = await db.collection('users').doc(id).get();
  return doc.exists ? (doc.data() as User) : null;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  await db.collection('users').doc(id).update(userData);
  return getUser(id) as Promise<User>;
};

export const deleteUser = async (id: string): Promise<void> => {
  await db.collection('users').doc(id).delete();
};