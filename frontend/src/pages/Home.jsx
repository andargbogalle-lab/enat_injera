import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Hero Section */}
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-3xl w-full">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src="/mom.png" alt="እናት እንጀራ Logo" className="h-32 w-32 md:h-40 md:w-40" />
            </div>

            {/* Top Badge */}
            <div className="flex justify-center mb-8">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                Wholesale Injera Management Made Easy
              </span>
            </div>

            {/* Main Title */}
            <div className="text-center mb-8">
              <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-red-500 mb-4 leading-tight">
                እናት እንጀራ
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Manage Your Injera Business with Confidence
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Track sales, manage payments, monitor expenses, and grow your wholesale injera business with our powerful, easy-to-use platform designed specifically for Ethiopian businesses.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 text-center text-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white border-2 border-primary text-primary font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition duration-300 text-center text-lg"
              >
                Sign In
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-primary/20 hover:border-primary/50 transition">
                <h3 className="font-bold text-lg mb-2 text-gray-800">Smart Sales Tracking</h3>
                <p className="text-gray-600">Record sales with automatic calculations. Track every transaction with ease.</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-green-300/20 hover:border-green-400/50 transition">
                <h3 className="font-bold text-lg mb-2 text-gray-800">Payment Management</h3>
                <p className="text-gray-600">Multiple payment methods: Cash, Telebirr, Bank transfers. Never lose a payment record.</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-purple-300/20 hover:border-purple-400/50 transition">
                <h3 className="font-bold text-lg mb-2 text-gray-800">Customer Profiles</h3>
                <p className="text-gray-600">View customer balances, payment history, and outstanding debts at a glance.</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-blue-300/20 hover:border-blue-400/50 transition">
                <h3 className="font-bold text-lg mb-2 text-gray-800">Business Reports</h3>
                <p className="text-gray-600">Comprehensive analytics: profit, expenses, revenue, and customer debt reports.</p>
              </div>
            </div>

            {/* Ethiopian Calendar Highlight */}
            <div className="bg-gradient-to-r from-primary/10 to-orange-300/10 border-2 border-primary/30 rounded-2xl p-8 mb-12">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Ethiopian Calendar Support</h3>
              </div>
              <p className="text-gray-700 text-lg">
                All dates displayed and managed in the Ethiopian calendar system. Meskerem, Tekemi, Hedar, and all 13 months fully supported with proper validation.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">∞</div>
                <p className="text-gray-700 font-semibold">Unlimited Records</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">Secure</div>
                <p className="text-gray-700 font-semibold">Secure & Private</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">Fast</div>
                <p className="text-gray-700 font-semibold">Lightning Fast</p>
              </div>
            </div>

            {/* Testimonial Style Section */}
            <div className="bg-white rounded-2xl p-8 border-2 border-primary/20 text-center">
              <p className="text-xl text-gray-700 font-medium mb-4">
                "Perfect for managing my wholesale injera business. Everything I need in one place!"
              </p>
              <p className="text-gray-600 font-semibold">— Ethiopian Business Owner</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <img src="/mom.png" alt="እናት እንጀራ Logo" className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-4" />
          <h1 className="text-5xl font-black mb-2">እናት እንጀራ</h1>
          <p className="text-2xl font-light">Welcome back, <span className="font-bold">{user.username}</span>!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Ready to Record</p>
            <p className="text-2xl font-bold text-blue-600">Sales</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Track & Manage</p>
            <p className="text-2xl font-bold text-green-600">Payments</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm">Monitor Costs</p>
            <p className="text-2xl font-bold text-orange-600">Purchases</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm">Manage All</p>
            <p className="text-2xl font-bold text-purple-600">Customers</p>
          </div>
        </div>

        {/* Main Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Main Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sales Card */}
            <Link
              to="/sales"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 border-2 border-transparent hover:border-blue-500"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Sales</h3>
              <p className="text-gray-600 mb-4">Record daily injera sales with automatic total calculations. Filter by customer and date for quick access.</p>
              <div className="text-blue-600 font-semibold group-hover:translate-x-2 transition duration-300">
                Start Recording →
              </div>
            </Link>

            {/* Payments Card */}
            <Link
              to="/payments"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 border-2 border-transparent hover:border-green-500"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Payments</h3>
              <p className="text-gray-600 mb-4">Track customer payments with multiple methods: Cash, Telebirr, Bank. Never miss a payment again.</p>
              <div className="text-green-600 font-semibold group-hover:translate-x-2 transition duration-300">
                Record Payment →
              </div>
            </Link>

            {/* Purchases Card */}
            <Link
              to="/purchases"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 border-2 border-transparent hover:border-orange-500"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Purchases</h3>
              <p className="text-gray-600 mb-4">Monitor all input expenses by category. Track teff, firewood, electricity, salaries, rent, and packaging costs.</p>
              <div className="text-orange-600 font-semibold group-hover:translate-x-2 transition duration-300">
                Record Purchase →
              </div>
            </Link>

            {/* Customers Card */}
            <Link
              to="/customers"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 border-2 border-transparent hover:border-purple-500"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Customers</h3>
              <p className="text-gray-600 mb-4">Manage all customers. View totals, balances, payment history, and outstanding debts at a glance.</p>
              <div className="text-purple-600 font-semibold group-hover:translate-x-2 transition duration-300">
                Manage Customers →
              </div>
            </Link>

            {/* Reports Card */}
            <Link
              to="/reports"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 border-2 border-transparent hover:border-red-500"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Reports</h3>
              <p className="text-gray-600 mb-4">Comprehensive business analytics: profit, expenses, revenue, customer debt, and expense breakdown reports.</p>
              <div className="text-red-600 font-semibold group-hover:translate-x-2 transition duration-300">
                View Reports →
              </div>
            </Link>

            {/* Getting Started Card */}
            <div className="bg-gradient-to-br from-primary/10 to-orange-300/10 rounded-2xl p-8 border-2 border-primary/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Getting Started</h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">1.</span> Add your first customer
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">2.</span> Record your first sale
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">3.</span> Track payments
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">4.</span> View reports
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-l-4 border-primary">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Ethiopian Calendar</h4>
                <p className="text-gray-600">All dates displayed in Ethiopian calendar with proper month names and validation.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Secure & Private</h4>
                <p className="text-gray-600">Your data is encrypted and only you can access your business records.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Fast & Reliable</h4>
                <p className="text-gray-600">Lightning-fast calculations with automatic verification on the server.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Smart Analytics</h4>
                <p className="text-gray-600">Comprehensive reports to understand your business performance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-2xl p-12 text-white text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-lg mb-8 opacity-90">Start managing your injera wholesale business more efficiently today.</p>
          <Link
            to="/sales"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
