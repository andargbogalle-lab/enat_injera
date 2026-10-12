# Injera Management System - Frontend

A React SPA (Single Page Application) for managing wholesale injera business operations with Vite and Tailwind CSS.

## Prerequisites

- Node.js (LTS version 16+)
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:5000/api
```

For production, update this to your API deployment URL.

### 3. Start Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Navigation.jsx   # Top navigation bar
│   ├── ProtectedRoute.jsx  # Auth guard for routes
│   ├── EthiopianDatePicker.jsx # Ethiopian calendar date picker
├── context/            # React Context for state management
│   └── AuthContext.jsx  # Authentication context
├── pages/             # Page components (routes)
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Sales.jsx
│   ├── Payments.jsx
│   ├── Purchases.jsx
│   ├── Customers.jsx
│   └── Reports.jsx
├── utils/             # Utility functions
│   ├── api.js         # Axios API client
│   └── ethiopianCalendar.js # Date conversion utilities
├── App.jsx            # Main app with routing
├── main.jsx           # Entry point
└── index.css          # Global styles with Tailwind
```

## Features

### 1. Authentication
- User registration and login
- JWT token-based authentication
- Protected routes
- Auto-logout on token expiration

### 2. Sales Management
- Record daily injera sales
- Automatic total calculation
- Filter by customer and date
- View sales history

### 3. Payment Tracking
- Record customer payments
- Multiple payment methods (Cash, Telebirr, Bank)
- Filter payments by customer
- Payment history

### 4. Purchase/Expense Management
- Record input purchases (teff, firewood, electricity, etc.)
- Custom category creation
- View expenses by category
- Category totals

### 5. Customer Management
- Add and manage customers
- View customer details including:
  - Total injera taken
  - Total billed amount
  - Total payments received
  - Outstanding balance
- View customer sales and payment history

### 6. Business Reports
- Overview dashboard with key metrics
- Sales, collections, expenses, debt, profit
- Expenses breakdown by category
- All-customers summary table
- Outstanding balances

### 7. Ethiopian Calendar
- All dates displayed in Ethiopian calendar
- Ethiopian month names
- Day, month, year selectors
- Validation for Pagume (13th month) dates
- Conversion between Gregorian and Ethiopian calendars

## Ethiopian Calendar Integration

The system uses a custom Ethiopian calendar converter that:
- Converts Gregorian dates to Ethiopian calendar for display
- Stores dates in ISO format for sorting and filtering
- Provides date picker with month names in Ethiopian
- Validates date ranges (13 months, Pagume has 5-6 days)

## API Integration

The frontend communicates with the backend API via:
- Axios HTTP client (`src/utils/api.js`)
- Automatic JWT token injection
- Error handling and 401 redirect on auth failure
- CORS support with credentials

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import repository to Vercel
3. Set environment variables (VITE_API_URL)
4. Deploy (auto-deploys on git push)

### Deploy to Netlify

1. Build locally: `npm run build`
2. Connect GitHub repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Set environment variables
6. Deploy (auto-deploys on git push)

## Development

### Code Style
- ES6+ JavaScript
- React Hooks for state management
- Functional components
- Tailwind CSS for styling

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Navigation.jsx`
4. Wrap with `<ProtectedRoute>` if authenticated access required

### Common Tasks

**Add a new API endpoint:**
```javascript
// In api.js or directly in a component
const response = await api.get('/api/endpoint');
```

**Use Ethiopian date picker:**
```jsx
<EthiopianDatePicker
  value={formData.date}
  onChange={(date) => setFormData({ ...formData, date })}
  label="Select Date"
/>
```

**Access authentication:**
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, token, login, logout } = useAuth();
  // ...
}
```

## Troubleshooting

**API connection issues:**
- Check `VITE_API_URL` environment variable
- Ensure backend server is running on port 5000
- Check CORS settings in backend

**Date display issues:**
- Ensure backend stores dates in ISO format
- Check Ethiopian calendar converter in `utils/ethiopianCalendar.js`

**Authentication issues:**
- Clear localStorage and login again
- Check JWT token expiry
- Verify backend JWT_SECRET matches frontend expectations

## Support

For issues or questions, refer to the main project documentation.
