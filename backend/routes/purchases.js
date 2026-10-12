import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Purchase from '../models/Purchase.js';

const router = express.Router();

// Get purchases with filters
router.get('/', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const filter = { owner: req.userId };

    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.date.$lte = new Date(req.query.endDate);
      }
    }

    const purchases = await Purchase.find(filter)
      .sort({ date: -1 });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add purchase
router.post('/', [
  body('date').optional().custom((value) => {
    if (value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      // Convert Gregorian to Ethiopian and check year is 2019 or later
      const gregorianYear = date.getFullYear();
      const ethiopianYear = gregorianYear - 8;
      if (ethiopianYear < 2019) {
        throw new Error('Ethiopian year must be 2019 or later');
      }
    }
    return true;
  }),
  body('item').trim().notEmpty().withMessage('Item description is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be non-negative')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, item, amount } = req.body;

    const purchase = new Purchase({
      owner: req.userId,
      date: date ? new Date(date) : new Date(),
      item,
      amount
    });

    await purchase.save();
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete purchase
router.delete('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase || purchase.owner.toString() !== req.userId) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: 'Purchase deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
