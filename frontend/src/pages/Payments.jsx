import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import EthiopianDatePicker from '../components/EthiopianDatePicker';
import { gregorianToEthiopian, formatEthiopianDateTable } from '../utils/ethiopianCalendar';
import { formatBirr } from '../utils/formatters';

// Export to CSV function
const exportToCSV = (data, filename, columns) => {
  const headers = columns.map(c => c.label).join(',');
  const rows = data.map(row => 
    columns.map(c => {
      const value = c.accessor(row);
      // Escape commas and quotes in values
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
};

export default function Payments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    customer: '',
    amount: '',
    method: 'cash'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [periodTotal, setPeriodTotal] = useState(0);
  const [selectedPayments, setSelectedPayments] = useState(new Set());

  useEffect(() => {
    loadPayments();
    loadCustomers();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data);
    } catch (err) {
      setError('Failed to load payments');
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
    const amount = parseFloat(formData.amount);

    if (amount <= 0) {
      setError('Amount must be greater than 0');
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
      await api.post('/payments', {
        date: formData.date,
        customer: formData.customer,
        amount: parseFloat(formData.amount),
        method: formData.method
      });

      setFormData({
        date: '',
        customer: '',
        amount: '',
        method: 'cash'
      });

      setSuccess('ክፍያ በስኬት ተመዝግቧል | Payment Recorded Successfully');
      loadPayments();
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/payments/${id}`);
        setSuccess('ክፍያ በስኬት ተሰርዟል | Payment Deleted Successfully');
        loadPayments();
        
        // Auto-dismiss success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete payment');
      }
    }
  };

  const handleCheckboxChange = (paymentId) => {
    const newSelected = new Set(selectedPayments);
    
    if (newSelected.has(paymentId)) {
      newSelected.delete(paymentId);
    } else {
      // Limit to 10 selections
      if (newSelected.size < 10) {
        newSelected.add(paymentId);
      } else {
        setError('You can select up to 10 payments maximum');
        return;
      }
    }
    
    setSelectedPayments(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedPayments.size === 0) {
      setError('Please select at least one payment to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedPayments.size} payment(s)?`)) {
      try {
        setLoading(true);
        
        // Delete all selected payments
        for (const paymentId of selectedPayments) {
          await api.delete(`/payments/${paymentId}`);
        }
        
        setSuccess(`${selectedPayments.size} payment(s) deleted successfully`);
        setSelectedPayments(new Set());
        loadPayments();
        
        // Auto-dismiss success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete selected payments');
      } finally {
        setLoading(false);
      }
    }
  };

  const clearSelection = () => {
    setSelectedPayments(new Set());
  };

  const handleBulkDeleteAll = async () => {
    try {
      setLoading(true);
      
      // Delete all filtered payments
      for (const payment of filteredPayments) {
        await api.delete(`/payments/${payment._id}`);
      }
      
      setSuccess(`${filteredPayments.length} payment(s) deleted successfully`);
      setSelectedPayments(new Set());
      loadPayments();
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete payments');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPayments = () => {
    const columns = [
      { label: 'ቀን | Date', accessor: (row) => {
        const ethDate = gregorianToEthiopian(new Date(row.date));
        return formatEthiopianDateTable(ethDate.year, ethDate.month, ethDate.day);
      }},
      { label: 'ደንበኛ | Customer', accessor: (row) => row.customer.name },
      { label: 'ብር | Amount', accessor: (row) => row.amount },
      { label: 'ዘዴ | Method', accessor: (row) => row.method }
    ];

    const filename = `Payment_History_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(filteredPayments, filename, columns);
  };

  const getFilteredPayments = () => {
    return payments.filter(payment => {
      const matchesCustomer = !filterCustomer || payment.customer._id === filterCustomer;
      
      let matchesDate = true;
      if (filterDate) {
        const paymentDate = new Date(payment.date).toISOString().split('T')[0];
        matchesDate = paymentDate === filterDate;
      }
      
      return matchesCustomer && matchesDate;
    });
  };

  const getPeriodPayments = (startDate, endDate) => {
    return payments.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  };

  const calculatePeriodTotal = (periodType) => {
    const today = new Date();
    let startDate, endDate, label;

    if (periodType === 'week') {
      // Get current week (Monday to Sunday)
      const dayOfWeek = today.getDay();
      const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(today.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      label = `This Week (${startDate.toDateString()} - ${endDate.toDateString()})`;
    } else if (periodType === 'month') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      label = `This Month (${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`;
    } else if (periodType === 'all') {
      startDate = new Date(1970, 0, 1);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      label = 'All Time';
    }

    const periodPayments = getPeriodPayments(startDate, endDate);
    const total = periodPayments.reduce((sum, payment) => sum + payment.amount, 0);

    setSelectedPeriod({ type: periodType, label });
    setPeriodTotal(total);
  };

  const filteredPayments = getFilteredPayments();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-4 flex items-center gap-2 text-primary hover:text-yellow-700 font-semibold"
      >
        ← Back to Home
      </button>

      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">Payments</h1>

      {error && (
        <div className="mb-4 p-3 md:p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm md:text-base">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 md:p-4 bg-green-100 border border-green-400 text-green-700 rounded text-sm md:text-base">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">Record Payment</h2>
          <form onSubmit={handleSubmit}>
            <EthiopianDatePicker
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              label="Payment Date"
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
                Amount Paid
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                step="0.01"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Payment Method
              </label>
              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="cash">Cash</option>
                <option value="Telebirr">Telebirr</option>
                <option value="bank">Bank</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Record Payment'}
            </button>
          </form>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">Filter</h2>
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

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Total by Period
              </label>
              <div className="flex gap-2 flex-wrap mb-3">
                <button
                  onClick={() => calculatePeriodTotal('week')}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    selectedPeriod?.type === 'week'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => calculatePeriodTotal('month')}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    selectedPeriod?.type === 'month'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => calculatePeriodTotal('all')}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    selectedPeriod?.type === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Time
                </button>
              </div>
              {selectedPeriod && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-gray-600 mb-2">{selectedPeriod.label}</p>
                  <p className="text-2xl font-bold text-primary">
                    {periodTotal.toFixed(2)} ብር
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {selectedPayments.size > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-3 md:px-4 py-3 flex justify-between items-center flex-wrap gap-2">
            <span className="text-xs md:text-sm font-semibold text-gray-700">
              {selectedPayments.size} payment(s) selected
            </span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={clearSelection}
                className="px-2 md:px-3 py-1 text-xs md:text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
              >
                Clear Selection
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={loading}
                className="px-2 md:px-3 py-1 text-xs md:text-sm bg-red-600 text-white rounded hover:bg-red-700 font-semibold disabled:opacity-50"
              >
                {loading ? 'Deleting...' : `Delete (${selectedPayments.size})`}
              </button>
            </div>
          </div>
        )}

        <div className="px-3 md:px-4 py-3 bg-gray-50 border-b flex justify-between items-center flex-wrap gap-2">
          <h3 className="font-semibold text-gray-700 text-sm md:text-base">Payment History</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleExportPayments}
              disabled={filteredPayments.length === 0}
              className="px-3 md:px-4 py-1 md:py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export to CSV
            </button>
            {filteredPayments.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm(`Delete all ${filteredPayments.length} payment(s)? This cannot be undone.`)) {
                    handleBulkDeleteAll();
                  }
                }}
                disabled={loading}
                className="px-3 md:px-4 py-1 md:py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-xs md:text-sm disabled:opacity-50"
              >
                Delete All
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm lg:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 md:px-4 py-2 text-left w-8 md:w-10">
                  <input
                    type="checkbox"
                    checked={selectedPayments.size === filteredPayments.length && filteredPayments.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newSelected = new Set();
                        filteredPayments.slice(0, 10).forEach(p => newSelected.add(p._id));
                        setSelectedPayments(newSelected);
                      } else {
                        setSelectedPayments(new Set());
                      }
                    }}
                    className="cursor-pointer"
                  />
                </th>
                <th className="px-2 md:px-4 py-2 text-left">Date</th>
                <th className="px-2 md:px-4 py-2 text-left">Customer</th>
                <th className="px-2 md:px-4 py-2 text-left">Amount</th>
                <th className="px-2 md:px-4 py-2 text-left">Method</th>
                <th className="px-2 md:px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => {
                const ethDate = gregorianToEthiopian(new Date(payment.date));
                const isSelected = selectedPayments.has(payment._id);
                
                return (
                  <tr 
                    key={payment._id} 
                    className={`border-t hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-2 md:px-4 py-2 w-8 md:w-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(payment._id)}
                        disabled={!isSelected && selectedPayments.size >= 10}
                        className="cursor-pointer disabled:opacity-50"
                      />
                    </td>
                    <td className="px-2 md:px-4 py-2">{formatEthiopianDateTable(ethDate.year, ethDate.month, ethDate.day)}</td>
                    <td className="px-2 md:px-4 py-2">{payment.customer.name}</td>
                    <td className="px-2 md:px-4 py-2">{formatBirr(payment.amount)}</td>
                    <td className="px-2 md:px-4 py-2">{payment.method}</td>
                    <td className="px-2 md:px-4 py-2">
                      <button
                        onClick={() => handleDelete(payment._id)}
                        className="text-red-600 hover:text-red-800 text-xs md:text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {/* Total Row */}
              {filteredPayments.length > 0 && (
                <tr className="border-t-2 border-t-gray-400 bg-gray-100 font-bold text-xs md:text-sm lg:text-base">
                  <td className="px-2 md:px-4 py-3"></td>
                  <td className="px-2 md:px-4 py-3"></td>
                  <td className="px-2 md:px-4 py-3 text-right">Total:</td>
                  <td className="px-2 md:px-4 py-3 text-lg text-primary">
                    {formatBirr(filteredPayments.reduce((sum, payment) => sum + payment.amount, 0))} ብር
                  </td>
                  <td className="px-2 md:px-4 py-3"></td>
                  <td className="px-2 md:px-4 py-3"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
