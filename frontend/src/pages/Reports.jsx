import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { gregorianToEthiopian, formatEthiopianDateTable } from '../utils/ethiopianCalendar';

// Simple export to CSV function
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
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
};

export default function Reports() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [customersSummary, setCustomersSummary] = useState([]);
  const [itemsPurchased, setItemsPurchased] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const [overviewRes, expensesRes, customersRes, itemsRes, employeesRes, purchasesRes] = await Promise.all([
        api.get('/reports/overview'),
        api.get('/reports/expenses-by-category'),
        api.get('/reports/customers-summary'),
        api.get('/reports/items-purchased'),
        api.get('/reports/employee-salaries'),
        api.get('/purchases')
      ]);

      setOverview(overviewRes.data);
      setExpenses(expensesRes.data);
      setCustomersSummary(customersRes.data);
      setItemsPurchased(itemsRes.data);
      setEmployees(employeesRes.data);
      setPurchases(purchasesRes.data);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary metrics
  const getTotalInjera = () => {
    return customersSummary.reduce((sum, c) => sum + c.totalQuantity, 0);
  };

  const getTotalBirr = () => {
    return customersSummary.reduce((sum, c) => sum + c.totalBilled, 0);
  };

  const getTotalPaidBirr = () => {
    return customersSummary.reduce((sum, c) => sum + c.totalPaid, 0);
  };

  const getTotalRemainingBirr = () => {
    return customersSummary.reduce((sum, c) => sum + Math.max(0, c.balance), 0);
  };

  const getCustomerCount = () => {
    return customersSummary.length;
  };

  const getItemsCount = () => {
    return itemsPurchased.length;
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, e) => sum + e.total, 0);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-6">Loading reports...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-4 flex items-center gap-2 text-primary hover:text-yellow-700 font-semibold"
      >
        ← Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Business Metrics Cards - English Labels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 mb-8">
        {/* Total Injera Sold */}
        <div className="bg-blue-50 rounded-lg shadow-md p-4">
          <div className="text-xs text-gray-600 mb-2">Total Injera Sold</div>
          <div className="text-2xl font-bold text-blue-600">{getTotalInjera()}</div>
        </div>

        {/* Total Birr */}
        <div className="bg-purple-50 rounded-lg shadow-md p-4">
          <div className="text-xs text-gray-600 mb-2">Total Billed</div>
          <div className="text-2xl font-bold text-purple-600">{getTotalBirr().toFixed(2)}</div>
        </div>

        {/* Total Paid Birr */}
        <div className="bg-green-50 rounded-lg shadow-md p-4">
          <div className="text-xs text-gray-600 mb-2">Total Paid</div>
          <div className="text-2xl font-bold text-green-600">{getTotalPaidBirr().toFixed(2)}</div>
        </div>

        {/* Remaining Birr */}
        <div className="bg-red-50 rounded-lg shadow-md p-4">
          <div className="text-xs text-gray-600 mb-2">Remaining Balance</div>
          <div className="text-2xl font-bold text-red-600">{getTotalRemainingBirr().toFixed(2)}</div>
        </div>

        {/* Customer Count */}
        <div className="bg-cyan-50 rounded-lg shadow-md p-4">
          <div className="text-xs text-gray-600 mb-2">Total Customers</div>
          <div className="text-2xl font-bold text-cyan-600">{getCustomerCount()}</div>
        </div>

        {/* Items Purchased */}
        <div className="bg-orange-50 rounded-lg shadow-md p-4">
          <div className="text-xs text-gray-600 mb-2">Items Purchased</div>
          <div className="text-2xl font-bold text-orange-600">{getItemsCount()}</div>
        </div>

        {/* Total Expenses */}
        <div className="bg-amber-50 rounded-lg shadow-md p-4">
          <div className="text-xs text-gray-600 mb-2">Total Expenses</div>
          <div className="text-2xl font-bold text-amber-600">{getTotalExpenses().toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Expenses by Category */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Expenses by Category</h2>
            <button
              onClick={() => exportToCSV(expenses, 'expenses.csv', [
                { label: 'Category', accessor: (e) => e.category },
                { label: 'Total', accessor: (e) => e.total.toFixed(2) }
              ])}
              className="bg-secondary text-white px-3 py-1 rounded hover:bg-opacity-90 text-xs"
            >
              Export
            </button>
          </div>
          <div className="space-y-2">
            {expenses.length > 0 ? (
              expenses.map((exp, idx) => (
                <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">{exp.category}</span>
                  <span className="font-bold text-secondary">{exp.total.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No expenses recorded</p>
            )}
          </div>
        </div>

        {/* Items Purchased */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Items Purchased</h2>
            <button
              onClick={() => exportToCSV(itemsPurchased, 'items-purchased.csv', [
                { label: 'Item', accessor: (i) => i.item },
                { label: 'Total Amount', accessor: (i) => i.totalAmount.toFixed(2) },
                { label: 'Unit', accessor: (i) => i.item.toLowerCase().includes('injera') || i.item.toLowerCase().includes('እንጀራ') ? 'እንጀራ' : 'ብር' }
              ])}
              className="bg-secondary text-white px-3 py-1 rounded hover:bg-opacity-90 text-xs"
            >
              Export
            </button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {itemsPurchased.length > 0 ? (
              itemsPurchased.map((item, idx) => {
                const unit = item.item.toLowerCase().includes('injera') || item.item.toLowerCase().includes('እንጀራ') ? 'እንጀራ' : 'ብር';
                return (
                  <div key={idx} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{item.item}</span>
                      <span className="font-bold text-blue-600">{item.totalAmount.toFixed(2)} {unit}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {item.count} purchase(s)
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No items purchased</p>
            )}
          </div>
        </div>
      </div>



      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">All Customers Summary</h2>
          <button
            onClick={() => exportToCSV(customersSummary, 'customers-summary.csv', [
              { label: 'Customer', accessor: (c) => c.customer },
              { label: 'Phone', accessor: (c) => c.phone },
              { label: 'Injera Taken', accessor: (c) => c.totalQuantity },
              { label: 'Total Billed', accessor: (c) => c.totalBilled.toFixed(2) },
              { label: 'Amount Paid', accessor: (c) => c.totalPaid.toFixed(2) },
              { label: 'Remaining Birr', accessor: (c) => Math.max(0, c.balance).toFixed(2) }
            ])}
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-opacity-90 text-sm"
          >
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-right">Injera Taken</th>
                <th className="px-4 py-2 text-right">Total Billed</th>
                <th className="px-4 py-2 text-right">Amount Paid</th>
                <th className="px-4 py-2 text-right">Remaining Birr</th>
              </tr>
            </thead>
            <tbody>
              {customersSummary.length > 0 ? (
                customersSummary.map((customer, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2 font-medium">{customer.customer}</td>
                    <td className="px-4 py-2">{customer.phone}</td>
                    <td className="px-4 py-2 text-right">{customer.totalQuantity}</td>
                    <td className="px-4 py-2 text-right">{customer.totalBilled.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right text-green-600 font-semibold">{customer.totalPaid.toFixed(2)}</td>
                    <td className={`px-4 py-2 text-right font-bold ${customer.balance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {Math.max(0, customer.balance).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                    No customers with transactions
                  </td>
                </tr>
              )}
              {customersSummary.length > 0 && (
                <tr className="bg-gray-100 font-bold border-t-2 border-gray-400">
                  <td className="px-4 py-3 text-left">
                    <span className="text-blue-600">Total Customers: {customersSummary.length}</span>
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-primary">
                      {customersSummary.reduce((sum, c) => sum + c.totalQuantity, 0)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-primary">
                      {customersSummary.reduce((sum, c) => sum + c.totalBilled, 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-green-600">
                      {customersSummary.reduce((sum, c) => sum + c.totalPaid, 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-red-600">
                      {customersSummary.reduce((sum, c) => sum + Math.max(0, c.balance), 0).toFixed(2)}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* All Purchases Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">All Purchases</h2>
          <button
            onClick={() => exportToCSV(purchases, 'purchases.csv', [
              { label: 'Date', accessor: (p) => {
                const ethDate = gregorianToEthiopian(new Date(p.date));
                return formatEthiopianDateTable(ethDate.year, ethDate.month, ethDate.day);
              }},
              { label: 'Item', accessor: (p) => p.item },
              { label: 'Amount', accessor: (p) => p.amount.toFixed(2) }
            ])}
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-opacity-90 text-sm"
          >
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length > 0 ? (
                purchases.map((purchase, idx) => {
                  const ethDate = gregorianToEthiopian(new Date(purchase.date));
                  return (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{formatEthiopianDateTable(ethDate.year, ethDate.month, ethDate.day)}</td>
                      <td className="px-4 py-2">{purchase.item}</td>
                      <td className="px-4 py-2 text-right font-semibold">{purchase.amount.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                    No purchases recorded
                  </td>
                </tr>
              )}
              {purchases.length > 0 && (
                <tr className="bg-gray-100 font-bold border-t-2 border-gray-400">
                  <td className="px-4 py-3 text-left">
                    <span className="text-blue-600">Total Purchases: {purchases.length}</span>
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-primary">
                      {purchases.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
