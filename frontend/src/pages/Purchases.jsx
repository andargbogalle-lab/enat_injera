import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import EthiopianDatePicker from '../components/EthiopianDatePicker';
import { gregorianToEthiopian, formatEthiopianDateTable } from '../utils/ethiopianCalendar';
import { formatBirr } from '../utils/formatters';

export default function Purchases() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    item: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterItem, setFilterItem] = useState('');

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      const response = await api.get('/purchases');
      setPurchases(response.data);
    } catch (err) {
      setError('Failed to load purchases');
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
      await api.post('/purchases', {
        date: formData.date,
        item: formData.item,
        amount: parseFloat(formData.amount)
      });

      setFormData({
        date: '',
        item: '',
        amount: ''
      });

      setSuccess('ገዥ በስኬት ተመዝግቧል | Purchase Recorded Successfully');
      loadPurchases();
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add purchase');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/purchases/${id}`);
        setSuccess('ገዥ በስኬት ተሰርዟል | Purchase Deleted Successfully');
        loadPurchases();
        
        // Auto-dismiss success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete purchase');
      }
    }
  };

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

  const handleExportPurchases = () => {
    const columns = [
      { label: 'ቀን | Date', accessor: (row) => {
        const ethDate = gregorianToEthiopian(new Date(row.date));
        return formatEthiopianDateTable(ethDate.year, ethDate.month, ethDate.day);
      }},
      { label: 'ዕቃ | Item', accessor: (row) => row.item },
      { label: 'ወጪ | Amount', accessor: (row) => row.amount }
    ];

    const filename = `Purchase_History_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(getFilteredPurchases(), filename, columns);
  };

  const getFilteredPurchases = () => {
    return purchases.filter(purchase => {
      let matchesDate = true;
      let matchesItem = true;
      
      if (filterDate) {
        const purchaseDate = new Date(purchase.date).toISOString().split('T')[0];
        matchesDate = purchaseDate === filterDate;
      }
      
      if (filterItem) {
        matchesItem = purchase.item.toLowerCase().includes(filterItem.toLowerCase());
      }
      
      return matchesDate && matchesItem;
    });
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

      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">Purchases (Input Expenses)</h1>

      {error && (
        <div className="mb-4 p-3 md:p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm md:text-base">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">Record Purchase</h2>
          <form onSubmit={handleSubmit}>
            <EthiopianDatePicker
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              label="Purchase Date"
            />

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Item Description
              </label>
              <input
                type="text"
                name="item"
                value={formData.item}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Flour, Sugar, Injera"
                required
              />
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Record Purchase'}
            </button>
          </form>
        </div>

        {/* Item Summary & Date Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">Items Summary & Filter</h2>
          
          <div className="mb-4">
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

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Filter by Item Name
            </label>
            <input
              type="text"
              value={filterItem}
              onChange={(e) => setFilterItem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Flour, Sugar, Injera"
            />
            {filterItem && (
              <button
                onClick={() => setFilterItem('')}
                className="mt-2 text-sm text-primary hover:text-yellow-700 font-semibold"
              >
                Clear Item Filter
              </button>
            )}
          </div>

          <div className="space-y-2">
            {getFilteredPurchases().length > 0 ? (
              <div className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between">
                  <span className="font-medium">Total Items</span>
                  <span className="font-bold text-secondary">{getFilteredPurchases().length}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No purchases {filterDate ? 'on this date' : ''}{filterItem ? ' with this item' : ''}.</p>
            )}
            {getFilteredPurchases().length > 0 && (
              <div className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-bold text-secondary">{formatBirr(getFilteredPurchases().reduce((sum, p) => sum + p.amount, 0))} ብር</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchases List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-3 md:px-4 py-3 bg-gray-50 border-b flex justify-between items-center flex-wrap gap-2">
          <h3 className="font-semibold text-gray-700 text-sm md:text-base">Purchase History</h3>
          <button
            onClick={handleExportPurchases}
            disabled={getFilteredPurchases().length === 0}
            className="px-3 md:px-4 py-1 md:py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export to CSV
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm lg:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 md:px-4 py-2 text-left">Date</th>
                <th className="px-2 md:px-4 py-2 text-left">Item</th>
                <th className="px-2 md:px-4 py-2 text-left">Amount</th>
                <th className="px-2 md:px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredPurchases().map(purchase => {
                const ethDate = gregorianToEthiopian(new Date(purchase.date));
                const unit = purchase.item.toLowerCase().includes('injera') || purchase.item.toLowerCase().includes('እንጀራ') ? 'እንጀራ' : 'ብር';
                return (
                  <tr key={purchase._id} className="border-t hover:bg-gray-50">
                    <td className="px-2 md:px-4 py-2">{formatEthiopianDateTable(ethDate.year, ethDate.month, ethDate.day)}</td>
                    <td className="px-2 md:px-4 py-2">{purchase.item}</td>
                    <td className="px-2 md:px-4 py-2">{formatBirr(purchase.amount)} {unit}</td>
                    <td className="px-2 md:px-4 py-2">
                      <button
                        onClick={() => handleDelete(purchase._id)}
                        className="text-red-600 hover:text-red-800 text-xs md:text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {/* Total Row */}
              {getFilteredPurchases().length > 0 && (
                <tr className="border-t-2 border-t-gray-400 bg-gray-100 font-bold text-xs md:text-sm lg:text-base">
                  <td className="px-2 md:px-4 py-3"></td>
                  <td className="px-2 md:px-4 py-3 text-right">Total:</td>
                  <td className="px-2 md:px-4 py-3 text-lg text-primary">
                    {formatBirr(getFilteredPurchases().reduce((sum, purchase) => sum + purchase.amount, 0))} ብር
                  </td>
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
