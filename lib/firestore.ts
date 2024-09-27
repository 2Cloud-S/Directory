import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc, 
  collection, 
  getDocs, 
  deleteDoc,
  query,
  where,
  limit
} from 'firebase/firestore';
import { User } from '../backend/src/models/User';
import { Tool } from '../backend/src/models/Tool';
import { Category } from '../backend/src/models/Category';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export const getUser = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    } else {
      console.error('No user found with UID:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user by UID:', error);
    return null;
  }
};

export const updateUser = async (uid: string, data: Partial<User>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), data);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const createTool = async (toolData: Partial<Tool>): Promise<Tool> => {
  const newToolRef = doc(collection(db, 'tools'));
  const tool: Tool = {
    id: newToolRef.id,
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
  await setDoc(newToolRef, tool);
  return tool;
};

export const getAllTools = async (): Promise<Tool[]> => {
  try {
    const toolsSnapshot = await getDocs(collection(db, 'tools'));
    return toolsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tool));
  } catch (error) {
    console.error('Error fetching tools:', error);
    throw error;
  }
};

export const deleteTool = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'tools', id));
  } catch (error) {
    console.error('Error deleting tool:', error);
    throw error;
  }
};

export const getTool = async (id: string): Promise<Tool | null> => {
  try {
    const toolSnapshot = await getDoc(doc(db, 'tools', id));
    if (toolSnapshot.exists()) {
      return { id: toolSnapshot.id, ...toolSnapshot.data() } as Tool;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching tool:', error);
    throw error;
  }
};

export const getRecentlyViewedTools = async (userId: string): Promise<Tool[]> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const recentlyViewedIds = userData.recentlyViewed || [];
      
      const toolPromises = recentlyViewedIds.map(toolId => 
        getDoc(doc(db, 'tools', toolId))
      );
      
      const toolDocs = await Promise.all(toolPromises);
      return toolDocs
        .filter(doc => doc.exists())
        .map(doc => ({ id: doc.id, ...doc.data() } as Tool));
    }
    return [];
  } catch (error) {
    console.error('Error fetching recently viewed tools:', error);
    return [];
  }
};

export const getSavedTools = async (userId: string): Promise<Tool[]> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const savedToolIds = userData.savedTools || [];
      
      const toolPromises = savedToolIds.map(toolId => 
        getDoc(doc(db, 'tools', toolId))
      );
      
      const toolDocs = await Promise.all(toolPromises);
      return toolDocs
        .filter(doc => doc.exists())
        .map(doc => ({ id: doc.id, ...doc.data() } as Tool));
    }
    return [];
  } catch (error) {
    console.error('Error fetching saved tools:', error);
    return [];
  }
};

export const addRecentlyViewedTool = async (userId: string, toolId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    recentlyViewed: [toolId, ...((await getDoc(userRef)).data()?.recentlyViewed || [])].slice(0, 10)
  });
};

export const saveTool = async (userId: string, toolId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    savedTools: [...new Set([toolId, ...((await getDoc(userRef)).data()?.savedTools || [])])]
  });
};

export const unsaveTool = async (userId: string, toolId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userData = (await getDoc(userRef)).data();
  await updateDoc(userRef, {
    savedTools: (userData?.savedTools || []).filter(id => id !== toolId)
  });
};

export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
  const newCategoryRef = doc(collection(db, 'categories'));
  const category: Category = {
    id: categoryData.id || newCategoryRef.id,
    name: categoryData.name || '',
    description: categoryData.description || '',
    iconName: categoryData.iconName || '',
  };
  await setDoc(doc(db, 'categories', category.id), category);
  return category;
};

export const getAllCategories = async (): Promise<Category[]> => {
  const categoriesCollection = collection(db, 'categories');
  const categoriesSnapshot = await getDocs(categoriesCollection);
  return categoriesSnapshot.docs.map(doc => doc.data() as Category);
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const getCategory = async (id: string): Promise<Category | null> => {
  const docRef = doc(db, 'categories', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as Category;
  } else {
    return null;
  }
};

export const updateCategory = async (categoryData: Category): Promise<void> => {
  const { id, ...updateData } = categoryData;
  const categoryRef = doc(db, 'categories', id);
  await updateDoc(categoryRef, updateData);
};