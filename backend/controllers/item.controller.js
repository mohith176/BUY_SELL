import Item from '../models/item.model.js';
import mongoose from 'mongoose';

// Get all items
export const getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create a new item
export const createItem = async (req, res) => {
    const item = new Item(req.body);
    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Search items
export const searchItems = async (req, res) => {
    const { query, categories } = req.query;
  
    try {
      const searchCriteria = {};
  
      if (query) {
        searchCriteria.name = { $regex: query, $options: 'i' }; // Case insensitive search
      }
  
      if (categories) {
        searchCriteria.category = { $in: categories.split(',') };
      }
  
      const items = await Item.find(searchCriteria).populate('sellerId', 'firstName lastName');
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching items', error });
    }
  };

 // Get item by ID
  export const getItemById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const item = await Item.findById(id).populate('sellerId', 'firstName lastName');
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching item', error });
    }
  };