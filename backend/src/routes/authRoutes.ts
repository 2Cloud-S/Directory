import express from 'express';
import { signUp, signIn, signOut, updateProfile } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.put('/profile', updateProfile); // Add this line

export default router;