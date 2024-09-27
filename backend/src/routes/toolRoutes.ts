import express from 'express';
import { createToolHandler, getToolHandler, updateToolHandler, deleteToolHandler, searchToolsHandler, getAllToolsHandler } from '../controllers/toolController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, authorize(['admin']), createToolHandler);
router.get('/', getAllToolsHandler);
router.get('/search', searchToolsHandler);
router.get('/:id', getToolHandler);
router.put('/:id', authenticate, authorize(['admin']), updateToolHandler);
router.delete('/:id', authenticate, authorize(['admin']), deleteToolHandler);

export default router;