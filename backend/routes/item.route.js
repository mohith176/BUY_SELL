import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { createItem, getAllItems,searchItems, getItemById} from '../controllers/item.controller.js';

const router = express.Router();

// Create a new item
router.post('/create', protect, createItem);

//Get all items
router.get('/getAll', protect, getAllItems);

//search items
router.get('/search', protect, searchItems);

// Get item by ID
router.get('/:id', protect, getItemById);

export default router;