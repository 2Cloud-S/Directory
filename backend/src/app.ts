import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import { apiLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/authRoutes';
import toolRoutes from './routes/toolRoutes';
import reviewRoutes from './routes/reviewRoutes';
import userRoutes from './routes/userRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import { cacheService } from './services/cacheService';

const app = express();

app.use(cors({
  origin: 'http://localhost:3001', // Update to your frontend's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.json());
app.use(apiLimiter);

app.use('/auth', authRoutes);
app.use('/tools', toolRoutes);
app.use('/reviews', reviewRoutes);
app.use('/users', userRoutes);
app.use('/analytics', analyticsRoutes);

const PORT = process.env.PORT || 3000;

cacheService.connect().then(() => {
  console.log('Connected to Redis');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(console.error);