import express from 'express';
import { query, validationResult } from 'express-validator';
import Sale from '../models/Sale.js';
import Payment from '../models/Payment.js';
import Purchase from '../models/Purchase.js';
import Customer from '../models/Customer.js';
import User from '../models/User.js';

const router = express.Router();

// Get overview report
router.get('/overview', async (req, res) => {
  try {
    const sales = await Sale.find({ owner: req.userId });
    const payments = await Payment.find({ owner: req.userId });
    const purchases = await Purchase.find({ owner: req.userId });

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalExpenses = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const profit = totalCollected - totalExpenses;

    // Calculate outstanding debt
    let totalDebt = 0;
    const customers = await Customer.find({ owner: req.userId });
    
    for (const customer of customers) {
      const customerSales = sales
        .filter(s => s.customer.toString() === customer._id.toString())
        .reduce((sum, sale) => sum + sale.total, 0);
      
      const customerPayments = payments
        .filter(p => p.customer.toString() === customer._id.toString())
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      totalDebt += (customerSales - customerPayments);
    }

    res.json({
      totalSales,
      totalCollected,
      totalExpenses,
      totalDebt,
      profit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expenses by category with optional date range
router.get('/expenses-by-category', [
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

    const purchases = await Purchase.find(filter);
    
    // Group by item instead of category
    const expensesByItem = {};
    purchases.forEach(purchase => {
      if (!expensesByItem[purchase.item]) {
        expensesByItem[purchase.item] = 0;
      }
      expensesByItem[purchase.item] += purchase.amount;
    });

    const result = Object.entries(expensesByItem)
      .map(([item, total]) => ({
        category: item,
        total
      }))
      .sort((a, b) => b.total - a.total);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all customers with totals
router.get('/customers-summary', async (req, res) => {
  try {
    const sales = await Sale.find({ owner: req.userId });
    const payments = await Payment.find({ owner: req.userId });
    const customers = await Customer.find({ owner: req.userId });

    const summary = customers.map(customer => {
      const customerSales = sales.filter(s => s.customer.toString() === customer._id.toString());
      const customerPayments = payments.filter(p => p.customer.toString() === customer._id.toString());

      const totalQuantity = customerSales.reduce((sum, sale) => sum + sale.quantity, 0);
      const totalBilled = customerSales.reduce((sum, sale) => sum + sale.total, 0);
      const totalPaid = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const balance = totalBilled - totalPaid;

      return {
        customer: customer.name,
        phone: customer.phone,
        totalQuantity,
        totalBilled,
        totalPaid,
        balance
      };
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get items purchased summary
router.get('/items-purchased', async (req, res) => {
  try {
    const purchases = await Purchase.find({ owner: req.userId })
      .sort({ date: -1 });

    const itemsSummary = {};
    
    purchases.forEach(purchase => {
      const key = purchase.item;
      if (!itemsSummary[key]) {
        itemsSummary[key] = {
          item: purchase.item,
          totalAmount: 0,
          count: 0,
          lastPurchase: purchase.date
        };
      }
      itemsSummary[key].totalAmount += purchase.amount;
      itemsSummary[key].count += 1;
      itemsSummary[key].lastPurchase = new Date(purchase.date) > new Date(itemsSummary[key].lastPurchase) 
        ? purchase.date 
        : itemsSummary[key].lastPurchase;
    });

    const result = Object.values(itemsSummary).sort((a, b) => b.totalAmount - a.totalAmount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employee salaries
router.get('/employee-salaries', async (req, res) => {
  try {
    // Get all non-admin users (employees created by the current admin)
    const employees = await User.find({ createdBy: req.userId, role: 'user' });
    
    const salaryInfo = employees.map(emp => ({
      name: emp.username,
      email: emp.email || 'N/A',
      status: emp.isActive ? 'Active' : 'Inactive',
      createdDate: emp.createdAt
    }));

    res.json(salaryInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
