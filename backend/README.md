# Injera Management System - Backend API

A Node.js and Express REST API for managing wholesale injera business operations with MongoDB.

## Prerequisites

- Node.js (LTS version 16+)
- MongoDB Atlas account (free M0 tier available)
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/injera_db?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Note:** Replace the MongoDB URI with your actual connection string from MongoDB Atlas.

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Add new customer
- `GET /api/customers/:id/summary` - Get customer summary (totals and history)

### Sales
- `GET /api/sales` - List sales (with filters)
- `POST /api/sales` - Record new sale
- `DELETE /api/sales/:id` - Delete sale

### Payments
- `GET /api/payments` - List payments (with filters)
- `POST /api/payments` - Record new payment
- `DELETE /api/payments/:id` - Delete payment

### Purchases
- `GET /api/purchases` - List purchases (with filters)
- `POST /api/purchases` - Record new purchase
- `DELETE /api/purchases/:id` - Delete purchase

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Add new category

### Reports
- `GET /api/reports/overview` - Business overview
- `GET /api/reports/expenses-by-category` - Expenses breakdown
- `GET /api/reports/customers-summary` - All customers summary

## Database Schema

### User
```json
{
  "username": "string (unique)",
  "passwordHash": "string",
  "createdAt": "date"
}
```

### Customer
```json
{
  "owner": "ObjectId (User)",
  "name": "string",
  "phone": "string",
  "createdAt": "date"
}
```

### Sale
```json
{
  "owner": "ObjectId (User)",
  "date": "date",
  "customer": "ObjectId (Customer)",
  "quantity": "number",
  "unitPrice": "number",
  "total": "number (calculated)"
}
```

### Payment
```json
{
  "owner": "ObjectId (User)",
  "date": "date",
  "customer": "ObjectId (Customer)",
  "amount": "number",
  "method": "string (cash|Telebirr|bank)"
}
```

### Purchase
```json
{
  "owner": "ObjectId (User)",
  "date": "date",
  "category": "ObjectId (Category)",
  "item": "string",
  "amount": "number"
}
```

### Category
```json
{
  "owner": "ObjectId (User)",
  "name": "string"
}
```

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Rate limiting on login endpoints
- CORS protection
- Helmet security headers
- Owner-based data isolation (users see only their own data)
- Input validation on all endpoints

## Testing with Postman

1. Register a new account at `/api/auth/register`
2. Login at `/api/auth/login` to get JWT token
3. Add JWT token to Authorization header for all subsequent requests
4. Test endpoints as documented above

## Deployment

### Deploy to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables in Render dashboard
5. Render will auto-deploy on git push

### Deploy to Railway

1. Push code to GitHub
2. Create new project on Railway
3. Connect GitHub repository
4. Add MongoDB connection via Railway marketplace
5. Railway will auto-deploy on git push

## Support

For issues or questions, refer to the main project documentation.
