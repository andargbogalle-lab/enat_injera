import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Payment from '../models/Payment.js';

const router = express.Router();

// Get payments with filters
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

    const payments = await Payment.find(filter)
      .populate('customer', 'name phone')
      .sort({ date: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add payment
router.post('/', [
  body('date').optional().custom((value) => {
    if (value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      // Convert Gregorian to Ethiopian and check year is 2019 or later
      const gregorianYear = date.getFullYear();
      const gregorianMonth = date.getMonth() + 1;
      // Ethiopian year is 8 years before, except for Jan-Aug (then it's 8 years before + adjustment)
      let ethiopianYear = gregorianYear - 8;
      let ethiopianMonth = gregorianMonth - 8;
      
      if (ethiopianMonth <= 0) {
        ethiopianMonth += 12;
        ethiopianYear -= 1;
      }
      
      if (ethiopianYear < 2019) {
        throw new Error('Ethiopian year must be 2019 or later');
      }
    }
    return true;
  }),
  body('customer').notEmpty().withMessage('Customer is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be non-negative'),
  body('method').isIn(['cash', 'Telebirr', 'bank']).withMessage('Invalid payment method')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, customer, amount, method } = req.body;

    const payment = new Payment({
      owner: req.userId,
      date: date ? new Date(date) : new Date(),
      customer,
      amount,
      method
    });

    await payment.save();
    await payment.populate('customer', 'name phone');
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete payment
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment || payment.owner.toString() !== req.userId) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
