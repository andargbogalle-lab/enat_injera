import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import EthiopianDatePicker from '../components/EthiopianDatePicker';
import { gregorianToEthiopian, formatEthiopianDateTable } from '../utils/ethiopianCalendar';

export default function Sales() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customer: '',
    quantity: '',
    unitPrice: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    loadSales();
    loadCustomers();
  }, []);

  const loadSales = async () => {
    try {
      const response = await api.get('/sales');
      setSales(response.data);
    } catch (err) {
      setError('Failed to load sales');
    }
  };

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
    const quantity = parseInt(formData.quantity);
    const unitPrice = parseFloat(formData.unitPrice);

    if (quantity <= 0) {
      setError('Quantity must be greater than 0');
      return false;
    }

    if (unitPrice <= 0) {
      setError('Unit Price must be greater than 0');
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
      await api.post('/sales', {
        date: formData.date,
        customer: formData.customer,
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice)
      });

      setFormData({
        date: new Date().toISOString().split('T')[0],
        customer: '',
        quantity: '',
        unitPrice: ''
      });

      setSuccess('ሽያጭ በስኬት ተመዝግቧል | Sale Recorded Successfully');
      loadSales();
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add sale');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/sales/${id}`);
        setSuccess('ሽያጭ በስኬት ተሰርዟል | Sale Deleted Successfully');
        loadSales();
        
        // Auto-dismiss success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete sale');
      }
    }
  };

  const getFilteredSales = () => {
    return sales.filter(sale => {
      const matchesCustomer = !filterCustomer || sale.customer._id === filterCustomer;
      
      let matchesDate = true;
      if (filterDate) {
        const saleDate = new Date(sale.date).toISOString().split('T')[0];
        matchesDate = saleDate === filterDate;
      }
      
      return matchesCustomer && matchesDate;
    });
  };

  const filteredSales = getFilteredSales();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-4 flex items-center gap-2 text-primary hover:text-yellow-700 font-semibold"
      >
        ← Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-6">Sales</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Record Sale</h2>
          <form onSubmit={handleSubmit}>
            <EthiopianDatePicker
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              label="Sale Date"
            />

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Customer
              </label>
              <select
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Customer</option>
                {customers.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quantity (count)
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                min="1"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Unit Price
              </label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                step="0.01"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Sale'}
            </button>
          </form>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Filter</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Filter by Customer
              </label>
              <select
                value={filterCustomer}
                onChange={(e) => setFilterCustomer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Customers</option>
                {customers.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Filter by Date
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate('')}
                  className="mt-2 text-sm text-primary hover:text-yellow-700 font-semibold"
                >
                  Clear Date Filter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Unit Price</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map(sale => {
              const ethDate = gregorianToEthiopian(new Date(sale.date));
              return (
                <tr key={sale._id} className="border-t">
                  <td className="px-4 py-2">{formatEthiopianDateTable(ethDate.year, ethDate.month, ethDate.day)}</td>
                  <td className="px-4 py-2">{sale.customer.name}</td>
                  <td className="px-4 py-2">{sale.quantity}</td>
                  <td className="px-4 py-2">{sale.unitPrice}</td>
                  <td className="px-4 py-2 font-bold">{sale.total}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(sale._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
