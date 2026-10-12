import express from 'express';
import { body, validationResult } from 'express-validator';
import Category from '../models/Category.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ owner: req.userId }).sort({ createdAt: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add category
router.post('/', [
  body('name').trim().notEmpty().withMessage('Category name is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;

    const category = new Category({
      owner: req.userId,
      name
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize default categories for new user
export const initializeDefaultCategories = async (userId) => {
  const defaultCategories = ['teff', 'firewood/charcoal', 'electricity', 'salaries', 'rent', 'packaging'];
  
  try {
    for (const categoryName of defaultCategories) {
      const exists = await Category.findOne({ owner: userId, name: categoryName });
      if (!exists) {
        await Category.create({
          owner: userId,
          name: categoryName
        });
      }
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
};

export default router;
