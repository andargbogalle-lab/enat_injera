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

// CORS configuration
const corsOptions = {
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
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.'
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

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
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Enat Injera API Server', version: '1.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Connect to MongoDB
let mongooseConnected = false;

if (!mongooseConnected && process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('[INFO] Connected to MongoDB');
      mongooseConnected = true;
    })
    .catch(err => {
      console.error('[ERROR] MongoDB connection error:', err);
    });
}

// For local development with npm start
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[INFO] Server running on port ${PORT}`);
  });
}

export default app;
