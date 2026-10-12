import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Sale from '../models/Sale.js';

const router = express.Router();

// Get sales with filters
router.get('/', [
  query('customer').optional(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const filter = { owner: req.userId };
    
    if (req.query.customer) {
      filter.customer = req.query.customer;
    }

    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.date.$lte = new Date(req.query.endDate);
      }
    }

    const sales = await Sale.find(filter)
      .populate('customer', 'name phone')
      .sort({ date: -1 });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add sale
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
  body('customer').notEmpty().withMessage('Customer is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be non-negative')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, customer, quantity, unitPrice } = req.body;
    const total = quantity * unitPrice;

    const sale = new Sale({
      owner: req.userId,
      date: date ? new Date(date) : new Date(),
      customer,
      quantity,
      unitPrice,
      total
    });

    await sale.save();
    await sale.populate('customer', 'name phone');
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete sale
router.delete('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale || sale.owner.toString() !== req.userId) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sale deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
