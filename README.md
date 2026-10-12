# እናት እንጀራ - Injera Management System

A complete MERN stack web application for managing wholesale injera business operations with full Ethiopian calendar support.

## 🎯 Overview

This system helps injera business owners:
- Record daily sales to customers
- Track customer payments (cash, Telebirr, bank transfers)
- Manage purchase expenses by category
- Monitor customer balances and payment status
- Generate comprehensive business reports

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 16+ 
- MongoDB Atlas account (free M0 tier)
- npm or yarn

### 2. Setup in 5 Minutes

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 and register to get started!

For detailed setup: See [QUICKSTART.md](QUICKSTART.md)

## 📁 Project Structure

```
እናት እንጀራ/
├── backend/              # Express REST API
│   ├── models/          # Mongoose schemas (6 collections)
│   ├── routes/          # API endpoints (24 routes)
│   ├── middleware/      # Authentication
│   ├── server.js        # Express server
│   ├── package.json
│   ├── .env.example     # Environment template
│   └── README.md
│
├── frontend/            # React SPA
│   ├── src/
│   │   ├── components/  # Navigation, DatePicker, ProtectedRoute
│   │   ├── pages/       # 8 main pages
│   │   ├── context/     # Auth state management
│   │   ├── utils/       # API client, Calendar converter
│   │   ├── App.jsx      # Main app with routing
│   │   └── index.css    # Tailwind styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
├── QUICKSTART.md        # 5-minute setup guide
├── SETUP.md            # Detailed configuration guide
├── PROJECT_SUMMARY.md  # Complete feature list
└── README.md           # This file
```

## ✨ Features

### User Management
- User registration and login
- Secure password hashing (bcrypt)
- JWT-based authentication
- Protected routes

### Sales
- Record daily sales with date, customer, quantity, unit price
- Automatic total calculation
- Filter by customer and date
- Sales history per customer

### Payments
- Record customer payments
- Multiple payment methods (Cash, Telebirr, Bank)
- Filter by customer
- Payment history tracking

### Purchases
- Track input expenses (teff, firewood, electricity, salaries, rent, packaging)
- Create custom expense categories
- View totals by category
- Expense history

### Customers
- Add and manage customers
- View customer details:
  - Total injera quantity taken
  - Total amount billed
  - Total payments received
  - Outstanding balance
- Sales and payment history per customer

### Reports
- Overview dashboard with key metrics
  - Total sales
  - Total collected revenue
  - Total expenses
  - Outstanding customer debt
  - Net profit calculation
- Expenses breakdown by category
- All-customers summary table

### Ethiopian Calendar
- All dates displayed in Ethiopian calendar
- Date picker with Ethiopian month names
- 13-month system with Pagume validation
- Conversion between Gregorian and Ethiopian dates
- Maintains ISO date format for sorting/filtering

### Security
- Password hashing with bcrypt
- JWT authentication on all protected routes
- Owner-based data isolation (users see only their own data)
- Input validation on all endpoints
- Rate limiting on login
- CORS protection
- Security headers with Helmet

## 🏗️ Architecture

### Backend Stack
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database with ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **express-validator** - Input validation

### Frontend Stack
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router v6** - Routing

### Database Collections
- **User** - Registration and authentication
- **Customer** - Customer information
- **Sale** - Sales transactions
- **Payment** - Payment records
- **Purchase** - Expense records
- **Category** - Expense categories

## 📊 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| GET | /api/customers | List customers |
| POST | /api/customers | Add customer |
| GET | /api/customers/:id/summary | Customer details |
| GET, POST, DELETE | /api/sales | Manage sales |
| GET, POST, DELETE | /api/payments | Manage payments |
| GET, POST, DELETE | /api/purchases | Manage purchases |
| GET, POST | /api/categories | Manage categories |
| GET | /api/reports/overview | Overview report |
| GET | /api/reports/expenses-by-category | Expense breakdown |
| GET | /api/reports/customers-summary | Customers summary |

## 🎨 Pages

1. **Home** - Welcome and feature overview
2. **Login** - User authentication
3. **Register** - New account creation
4. **Sales** - Record and view sales
5. **Payments** - Track customer payments
6. **Purchases** - Manage expenses
7. **Customers** - Customer management and profiles
8. **Reports** - Business analytics and metrics

## 🚢 Deployment

### Backend (Node.js API)
Deploy to:
- [Render.com](https://render.com) ⭐ Recommended
- [Railway.app](https://railway.app)
- [Heroku](https://www.heroku.com/)

### Frontend (React SPA)
Deploy to:
- [Vercel.com](https://vercel.com) ⭐ Recommended
- [Netlify.com](https://netlify.com)
- [GitHub Pages](https://pages.github.com/)

### Database
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Free M0 tier

See [SETUP.md](SETUP.md) for detailed deployment instructions.

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes
- **[SETUP.md](SETUP.md)** - Detailed setup and deployment guide
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete feature overview
- **[backend/README.md](backend/README.md)** - Backend documentation
- **[frontend/README.md](frontend/README.md)** - Frontend documentation

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev      # Start with auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev      # Start with hot reload
npm run build    # Build for production
```

## ✅ Testing

1. Register a new account
2. Add a customer
3. Record a sale
4. Record a payment
5. Check customer summary
6. View reports

## 🤝 Contributing

This is a complete Phase 1 implementation. Planned enhancements:
- Cashier role (read-only)
- Driver role (delivery tracking)
- Receipt printing
- Excel/PDF export
- Telegram/SMS notifications
- PWA offline support

## 📝 Requirements Met

Phase 1 requirements from the specification:
- ✅ User authentication (register/login)
- ✅ Sales recording with automatic calculations
- ✅ Payment tracking with multiple methods
- ✅ Purchase/expense management
- ✅ Customer management with summaries
- ✅ Comprehensive business reports
- ✅ Ethiopian calendar throughout
- ✅ Secure API with JWT
- ✅ Database with proper indexing
- ✅ Owner-based data isolation

## 📄 License

Built for wholesale injera business management.

## 🙋 Support

- **Setup issues?** See [SETUP.md](SETUP.md)
- **Quick start?** See [QUICKSTART.md](QUICKSTART.md)
- **Feature details?** See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
- **Backend help?** See [backend/README.md](backend/README.md)
- **Frontend help?** See [frontend/README.md](frontend/README.md)

---

**Ready to launch your injera business management system!** 🎉

Start with: [QUICKSTART.md](QUICKSTART.md)
#   e n a t _ i n j e r a  
 