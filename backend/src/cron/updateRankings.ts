import { functions } from '../config/firebase';
import { db } from '../config/firebase';

export const updateRankings = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const toolsSnapshot = await db.collection('tools').get();
  const tools = toolsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Calculate rankings based on reviews, ratings, and usage
  const rankedTools = tools.sort((a, b) => {
    // Implement your ranking algorithm here
    return b.averageRating - a.averageRating;
  });

  // Update rankings in the database
  const batch = db.batch();
  rankedTools.forEach((tool, index) => {
    const toolRef = db.collection('tools').doc(tool.id);
    batch.update(toolRef, { ranking: index + 1 });
  });

  await batch.commit();
  console.log('Rankings updated successfully');
});