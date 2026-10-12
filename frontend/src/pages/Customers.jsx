import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { gregorianToEthiopian, formatEthiopianDateTable } from '../utils/ethiopianCalendar';

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [summary, setSummary] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to load customers');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Validate name - only letters and spaces
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    if (!nameRegex.test(formData.name.trim())) {
      setError('Name must contain only letters and spaces (minimum 2 characters)');
      return false;
    }

    // Validate phone - 10 digits starting with 09
    const phoneRegex = /^09\d{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setError('Phone must be 10 digits starting with 09 (e.g., 0911234567)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await api.post('/customers', formData);
      setFormData({ name: '', phone: '' });
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCustomer = async (customerId) => {
    setSelectedCustomer(customerId);
    try {
      const response = await api.get(`/customers/${customerId}/summary`);
      setSummary(response.data);
    } catch (err) {
      setError('Failed to load customer summary');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-4 flex items-center gap-2 text-primary hover:text-yellow-700 font-semibold"
      >
        ← Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-6">Customers</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Add Customer Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Add Customer</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Customer Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Customer'}
            </button>
          </form>
        </div>

        {/* All Customers List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">All Customers</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {customers.map(customer => (
              <button
                key={customer._id}
                onClick={() => handleSelectCustomer(customer._id)}
                className={`w-full text-left p-3 rounded border-2 ${
                  selectedCustomer === customer._id
                    ? 'border-primary bg-yellow-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-bold">{customer.name}</div>
                <div className="text-sm text-gray-600">{customer.phone}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Customer Summary */}
        {summary && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">{summary.customer.name}</h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-sm text-gray-600">Total Injera Sold</div>
                <div className="text-2xl font-bold text-blue-600">{summary.totalQuantity}</div>
              </div>
              <div className={`p-3 rounded ${summary.balance >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                <div className="text-sm text-gray-600">Remaining Birr</div>
                <div className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.max(0, summary.balance).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Details */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sales History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Sales History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-2 text-left">Date</th>
                    <th className="px-2 py-2 text-left">Qty</th>
                    <th className="px-2 py-2 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.sales.map(sale => {
                    const ethDate = gregorianToEthiopian(new Date(sale.date));
                    return (
                      <tr key={sale._id} className="border-t">
                        <td className="px-2 py-2">{formatEthiopianDateTable(ethDate.year, ethDate.month, ethDate.day)}</td>
                        <td className="px-2 py-2">{sale.quantity}</td>
                        <td className="px-2 py-2">{sale.total.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                  
                  {/* Total Row */}
                  {summary.sales.length > 0 && (
                    <tr className="border-t-2 border-t-gray-400 bg-gray-100 font-bold">
                      <td className="px-2 py-2"></td>
                      <td className="px-2 py-2 text-right">Total:</td>
                      <td className="px-2 py-2 text-primary">
                        {summary.sales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Payment History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-2 text-left">Date</th>
                    <th className="px-2 py-2 text-left">Amount</th>
                    <th className="px-2 py-2 text-left">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.payments.map(payment => {
                    const ethDate = gregorianToEthiopian(new Date(payment.date));
                    return (
                      <tr key={payment._id} className="border-t">
                        <td className="px-2 py-2">{formatEthiopianDateTable(ethDate.year, ethDate.month, ethDate.day)}</td>
                        <td className="px-2 py-2">{payment.amount.toFixed(2)}</td>
                        <td className="px-2 py-2">{payment.method}</td>
                      </tr>
                    );
                  })}
                  
                  {/* Total Row */}
                  {summary.payments.length > 0 && (
                    <tr className="border-t-2 border-t-gray-400 bg-gray-100 font-bold">
                      <td className="px-2 py-2 text-right">Total:</td>
                      <td className="px-2 py-2 text-primary">
                        {summary.payments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}
                      </td>
                      <td className="px-2 py-2"></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
