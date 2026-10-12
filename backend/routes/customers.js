import express from 'express';
import { body, validationResult } from 'express-validator';
import Customer from '../models/Customer.js';
import Sale from '../models/Sale.js';
import Payment from '../models/Payment.js';

const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add customer
router.post('/', [
  body('name').trim().notEmpty().withMessage('Customer name is required'),
  body('phone').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, phone } = req.body;

    const customer = new Customer({
      owner: req.userId,
      name,
      phone
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer summary (total injera, billed, paid, balance)
router.get('/:id/summary', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer || customer.owner.toString() !== req.userId) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get sales for this customer
    const sales = await Sale.find({
      owner: req.userId,
      customer: req.params.id
    });

    // Get payments for this customer
    const payments = await Payment.find({
      owner: req.userId,
      customer: req.params.id
    });

    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalBilled = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const balance = totalBilled - totalPaid;

    res.json({
      customer,
      totalQuantity,
      totalBilled,
      totalPaid,
      balance,
      sales: sales.sort((a, b) => b.date - a.date),
      payments: payments.sort((a, b) => b.date - a.date)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
