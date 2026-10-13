import express from 'express';
import { body, validationResult } from 'express-validator';
import Loan from '../models/Loan.js';

const router = express.Router();

// Get all loans for logged-in user
router.get('/', async (req, res) => {
  try {
    const loans = await Loan.find({ createdBy: req.userId }).sort({ loanDate: -1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single loan with payment history
router.get('/:id', async (req, res) => {
  try {
    const loan = await Loan.findOne({ _id: req.params.id, createdBy: req.userId });
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new loan
router.post('/', [
  body('lenderName').trim().notEmpty().withMessage('Lender name is required'),
  body('loanDate').notEmpty().withMessage('Loan date is required'),
  body('loanAmount').isFloat({ min: 0.01 }).withMessage('Loan amount must be greater than 0')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { lenderName, loanDate, loanAmount, description } = req.body;

    const loan = new Loan({
      lenderName,
      loanDate,
      loanAmount: parseFloat(loanAmount),
      remainingBalance: parseFloat(loanAmount),
      description,
      createdBy: req.userId
    });

    await loan.save();
    res.status(201).json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Make a payment
router.post('/:id/payment', [
  body('amountPaid').isFloat({ min: 0.01 }).withMessage('Payment amount must be greater than 0'),
  body('paymentDate').notEmpty().withMessage('Payment date is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const loan = await Loan.findOne({ _id: req.params.id, createdBy: req.userId });
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    const { amountPaid, paymentDate, note } = req.body;
    const paymentAmount = parseFloat(amountPaid);

    if (paymentAmount > loan.remainingBalance) {
      return res.status(400).json({ 
        error: `Payment amount (${paymentAmount}) exceeds remaining balance (${loan.remainingBalance})` 
      });
    }

    // Update loan
    loan.amountPaid += paymentAmount;
    loan.remainingBalance = loan.loanAmount - loan.amountPaid;

    // Update status
    if (loan.remainingBalance <= 0) {
      loan.status = 'paid-off';
    }

    // Add to payment history
    loan.paymentHistory.push({
      paymentDate,
      amountPaid: paymentAmount,
      remainingAfter: loan.remainingBalance,
      note
    });

    await loan.save();
    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update loan
router.put('/:id', [
  body('lenderName').optional().trim(),
  body('loanAmount').optional().isFloat({ min: 0.01 })
], async (req, res) => {
  try {
    const loan = await Loan.findOne({ _id: req.params.id, createdBy: req.userId });
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    const { lenderName, loanDate, loanAmount, description } = req.body;

    if (lenderName) loan.lenderName = lenderName;
    if (loanDate) loan.loanDate = loanDate;
    if (loanAmount) loan.loanAmount = parseFloat(loanAmount);
    if (description !== undefined) loan.description = description;

    await loan.save();
    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete loan
router.delete('/:id', async (req, res) => {
  try {
    const loan = await Loan.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.json({ message: 'Loan deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
