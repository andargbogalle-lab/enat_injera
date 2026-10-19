import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import customerRoutes from './routes/customers.js';
import saleRoutes from './routes/sales.js';
import paymentRoutes from './routes/payments.js';
import purchaseRoutes from './routes/purchases.js';
import categoryRoutes from './routes/categories.js';
import reportRoutes from './routes/reports.js';
import loanRoutes from './routes/loans.js';

// Import middleware
import { authenticate } from './middleware/auth.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:3000',
    'https://enat-injera.vercel.app',
    'https://enat-injera-eqq6.vercel.app',
    process.env.CLIENT_URL
  ],
  credentials: true
}));

// Rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.'
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', loginLimiter, authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/customers', authenticate, customerRoutes);
app.use('/api/sales', authenticate, saleRoutes);
app.use('/api/payments', authenticate, paymentRoutes);
app.use('/api/purchases', authenticate, purchaseRoutes);
app.use('/api/categories', authenticate, categoryRoutes);
app.use('/api/reports', authenticate, reportRoutes);
app.use('/api/loans', authenticate, loanRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
