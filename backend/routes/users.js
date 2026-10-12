import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import EmployeePayment from '../models/EmployeePayment.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Helper function to convert Ethiopian date to Gregorian ISO date
function ethiopianToGregorianISO(year, month, day) {
  let gregorianYear = year + 8;
  let gregorianMonth = month + 8;
  let gregorianDay = day;
  
  if (gregorianMonth > 12) {
    gregorianMonth -= 12;
    gregorianYear += 1;
  }
  
  const monthStr = String(gregorianMonth).padStart(2, '0');
  const dayStr = String(gregorianDay).padStart(2, '0');
  
  return `${gregorianYear}-${monthStr}-${dayStr}`;
}

// Helper function to convert Gregorian date to Ethiopian date
function gregorianToEthiopian(date) {
  if (typeof date === 'string') {
    // Parse as local date, not UTC
    const parts = date.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const day = parseInt(parts[2]);
      
      let ethYear = year - 8;
      let ethMonth = month - 8;
      
      if (ethMonth <= 0) {
        ethMonth += 12;
        ethYear -= 1;
      }
      
      return { 
        year: ethYear, 
        month: ethMonth, 
        day: day 
      };
    }
    
    date = new Date(date);
  }
  
  // Use local date components, not UTC
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  let ethYear = year - 8;
  let ethMonth = month - 8;
  
  if (ethMonth <= 0) {
    ethMonth += 12;
    ethYear -= 1;
  }
  
  return { 
    year: ethYear, 
    month: ethMonth, 
    day: day 
  };
}

// Get all users (admin only) - excludes employees
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ isEmployee: { $ne: true } }).select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user (admin only)
router.post('/', authenticate, adminOnly, [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('role').optional().isIn(['admin', 'user']).withMessage('Invalid role')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password, email, role } = req.body;

    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      passwordHash: password,
      email,
      role: role || 'user',
      createdBy: req.userId
    });

    await user.save();

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user (admin only) - including employee salary fields
router.put('/:id', authenticate, adminOnly, [
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('role').optional().isIn(['admin', 'user']).withMessage('Invalid role'),
  body('jobPosition').optional().trim(),
  body('hireDate').optional().isISO8601().withMessage('Invalid hire date'),
  body('salaryAmount').optional().isFloat({ min: 0 }).withMessage('Salary must be non-negative'),
  body('paymentFrequency').optional().isIn(['daily', 'weekly', 'monthly']).withMessage('Invalid payment frequency'),
  body('paymentStatus').optional().isIn(['paid', 'pending', 'overdue']).withMessage('Invalid payment status')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, role, isActive, jobPosition, hireDate, salaryAmount, paymentFrequency, paymentStatus, isEmployee } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.userId && isActive === false) {
      return res.status(400).json({ error: 'Cannot deactivate your own admin account' });
    }

    if (email) user.email = email;
    if (role && role !== user.role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    
    // Employee fields
    if (isEmployee !== undefined) user.isEmployee = isEmployee;
    if (jobPosition) user.jobPosition = jobPosition;
    if (hireDate) user.hireDate = new Date(hireDate);
    if (salaryAmount !== undefined) user.salaryAmount = salaryAmount;
    if (paymentFrequency) user.paymentFrequency = paymentFrequency;
    if (paymentStatus) user.paymentStatus = paymentStatus;

    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isEmployee: user.isEmployee,
      jobPosition: user.jobPosition,
      hireDate: user.hireDate,
      salaryAmount: user.salaryAmount,
      paymentFrequency: user.paymentFrequency,
      paymentStatus: user.paymentStatus,
      lastPaymentDate: user.lastPaymentDate,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deactivate user (admin only)
router.post('/:id/deactivate', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.userId) {
      return res.status(400).json({ error: 'Cannot deactivate your own admin account' });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Activate user (admin only)
router.post('/:id/activate', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isActive = true;
    await user.save();

    res.json({ message: 'User activated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all employees (admin only)
router.get('/employees/list', authenticate, adminOnly, async (req, res) => {
  try {
    const employees = await User.find({ createdBy: req.userId, isEmployee: true })
      .select('-passwordHash')
      .sort({ hireDate: -1 });
    
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register new employee directly with name (admin only)
router.post('/employees/register', authenticate, adminOnly, [
  body('employeeName').trim().matches(/^[a-zA-Z\s]{2,}$/).withMessage('Employee name must contain only letters and spaces (minimum 2 characters)'),
  body('phone').matches(/^09\d{8}$/).withMessage('Phone must be 10 digits starting with 09 (e.g., 0911234567)'),
  body('jobPosition').trim().notEmpty().withMessage('Job position is required'),
  body('hireDate').isISO8601().withMessage('Invalid hire date'),
  body('salaryAmount').isFloat({ min: 0.01 }).withMessage('Salary must be greater than 0'),
  body('paymentFrequency').isIn(['daily', 'weekly', 'monthly']).withMessage('Invalid payment frequency')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { employeeName, phone, jobPosition, hireDate, salaryAmount, paymentFrequency } = req.body;

    // Create new employee user
    const employee = new User({
      username: employeeName,
      passwordHash: 'temp123',  // Temporary password - can be changed later
      email: '',
      role: 'user',
      createdBy: req.userId,
      isEmployee: true,
      phone,
      jobPosition,
      hireDate: new Date(hireDate),
      salaryAmount,
      paymentFrequency,
      paymentStatus: 'pending',
      isActive: true
    });

    await employee.save();

    res.status(201).json({
      id: employee._id,
      username: employee.username,
      phone: employee.phone,
      jobPosition: employee.jobPosition,
      hireDate: employee.hireDate,
      salaryAmount: employee.salaryAmount,
      paymentFrequency: employee.paymentFrequency,
      paymentStatus: employee.paymentStatus,
      createdAt: employee.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark employee salary as paid (admin only)
router.post('/:id/pay-salary', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    if (!user.isEmployee) {
      return res.status(400).json({ error: 'This user is not an employee' });
    }

    user.paymentStatus = 'paid';
    user.lastPaymentDate = new Date();
    await user.save();

    res.json({
      message: 'Salary marked as paid',
      employee: {
        id: user._id,
        name: user.username,
        salaryAmount: user.salaryAmount,
        paymentStatus: user.paymentStatus,
        lastPaymentDate: user.lastPaymentDate
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process bulk weekly/monthly payments (admin only)
router.post('/employees/bulk-payment', authenticate, adminOnly, [
  body('paymentDate').isISO8601().withMessage('Invalid payment date'),
  body('paymentType').isIn(['daily', 'weekly', 'monthly']).withMessage('Invalid payment type'),
  body('employeeIds').isArray({ min: 1 }).withMessage('Select at least one employee')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { paymentDate, paymentType, employeeIds } = req.body;
    
    // Get only selected employees
    const employees = await User.find({ 
      _id: { $in: employeeIds },
      createdBy: req.userId, 
      isEmployee: true,
      isActive: true
    });

    let paidCount = 0;
    const paidEmployees = [];
    const paymentDateObj = new Date(paymentDate);
    const ethiopianDate = gregorianToEthiopian(paymentDateObj);

    // Process payment for each selected employee
    for (const employee of employees) {
      employee.paymentStatus = 'paid';
      employee.lastPaymentDate = paymentDateObj;
      await employee.save();

      // Create payment record with Ethiopian date
      const paymentRecord = new EmployeePayment({
        owner: req.userId,
        employee: employee._id,
        employeeName: employee.username,
        phone: employee.phone,
        jobPosition: employee.jobPosition,
        salaryAmount: employee.salaryAmount,
        paymentFrequency: employee.paymentFrequency,
        paymentDate: paymentDateObj,
        ethiopianDate: ethiopianDate,
        status: 'paid'
      });

      await paymentRecord.save();

      paidCount++;
      paidEmployees.push({
        id: employee._id,
        name: employee.username,
        salaryAmount: employee.salaryAmount
      });
    }

    res.json({
      message: `Payments processed for ${paidCount} employees`,
      paidCount,
      paidEmployees,
      paymentDate,
      paymentType
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment history (admin only)
router.get('/employees/payment-history', authenticate, adminOnly, async (req, res) => {
  try {
    // Get all payment records for this admin's employees
    const paymentRecords = await EmployeePayment.find({ 
      owner: req.userId
    })
    .sort({ paymentDate: -1 })
    .lean();

    // Format the response with Ethiopian dates
    const paymentHistory = paymentRecords.map(record => ({
      _id: record._id,
      employeeName: record.employeeName,
      phone: record.phone,
      jobPosition: record.jobPosition,
      salaryAmount: record.salaryAmount,
      paymentFrequency: record.paymentFrequency,
      paymentDate: record.paymentDate,
      ethiopianDate: record.ethiopianDate,
      status: record.status
    }));

    res.json(paymentHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete payment history record (admin only)
router.delete('/employees/payment-history/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const paymentRecord = await EmployeePayment.findById(req.params.id);
    
    if (!paymentRecord) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    // Verify ownership
    if (paymentRecord.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this record' });
    }

    await EmployeePayment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Payment record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to check if two dates are the same day
function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

// Helper function to get week number
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export default router;
