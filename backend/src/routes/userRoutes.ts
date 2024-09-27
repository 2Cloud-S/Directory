import express from 'express';
import { getUserHandler, updateUserHandler, deleteUserHandler } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/:id', authenticate, getUserHandler);
router.put('/:id', authenticate, updateUserHandler);
router.delete('/:id', authenticate, authorize(['admin']), deleteUserHandler);

export default router;