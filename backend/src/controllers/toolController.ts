import { Request, Response } from 'express';
import { createTool, getTool, updateTool, deleteTool, getAllTools } from '../models/Tool';
import { searchTools } from '../services/searchService';
import { cacheService } from '../services/cacheService';

export const createToolHandler = async (req: Request, res: Response) => {
  try {
    const toolData = req.body;
    const tool = await createTool(toolData);
    res.status(201).json(tool);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const getToolHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cachedTool = await cacheService.get(`tool:${id}`);
    if (cachedTool) {
      return res.json(JSON.parse(cachedTool));
    }
    const tool = await getTool(id);
    await cacheService.set(`tool:${id}`, JSON.stringify(tool), 3600); // Cache for 1 hour
    res.json(tool);
  } catch (error) {
    res.status(404).json({ error: 'Tool not found' });
  }
};

export const updateToolHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const toolData = req.body;
    const updatedTool = await updateTool(id, toolData);
    await cacheService.del(`tool:${id}`);
    res.json(updatedTool);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const deleteToolHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteTool(id);
    await cacheService.del(`tool:${id}`);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const searchToolsHandler = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid query parameter' });
    }
    const results = await searchTools(query);
    res.json(results);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const getAllToolsHandler = async (req: Request, res: Response) => {
  try {
    const tools = await getAllTools();
    res.json(tools);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};