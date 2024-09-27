import { db } from '../config/firebase';

export const searchTools = async (query: string) => {
  const toolsRef = db.collection('tools');
  const snapshot = await toolsRef
    .where('name', '>=', query)
    .where('name', '<=', query + '\uf8ff')
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};