import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { translations } from '../utils/translations';
import EthiopianDatePicker from '../components/EthiopianDatePicker';

const t = translations.employees;

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [formData, setFormData] = useState({
    employeeName: '',
    phone: '',
    jobPosition: '',
    hireDate: '',
    salaryAmount: '',
    paymentFrequency: 'monthly'
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showBulkPayment, setShowBulkPayment] = useState(false);
  const [bulkPaymentData, setBulkPaymentData] = useState({
    paymentDate: '',
    paymentType: 'monthly',
    selectedEmployees: []
  });
  const [bulkPaymentLoading, setBulkPaymentLoading] = useState(false);
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);
  const [summaryFilter, setSummaryFilter] = useState({
    type: 'monthly', // 'weekly' or 'monthly'
    selectedMonth: new Date().toISOString().split('T')[0].substring(0, 7), // YYYY-MM format
    selectedWeek: Math.floor((new Date().getDate() - 1) / 7) + 1 // Week number
  });
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [selectedPaymentHistoryRows, setSelectedPaymentHistoryRows] = useState(new Set());
  const [paymentHistoryDeleting, setPaymentHistoryDeleting] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await api.get('/users/employees/list');
      setEmployees(response.data);
      
      // Load payment history
      const paymentRes = await api.get('/users/employees/payment-history');
      setPaymentHistory(paymentRes.data);
    } catch (err) {
      setError(t.loadingError);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.employeeName || !formData.phone || !formData.jobPosition || !formData.salaryAmount) {
        setError(t.requiredFields);
        setLoading(false);
        return;
      }

      // Validate name - only letters and spaces
      const nameRegex = /^[a-zA-Z\s]{2,}$/;
      if (!nameRegex.test(formData.employeeName.trim())) {
        setError('Employee name must contain only letters and spaces (minimum 2 characters)');
        setLoading(false);
        return;
      }

      // Validate phone - 10 digits starting with 09
      const phoneRegex = /^09\d{8}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError('Phone must be 10 digits starting with 09 (e.g., 0911234567)');
        setLoading(false);
        return;
      }

      const salaryAmount = parseFloat(formData.salaryAmount);
      if (salaryAmount <= 0) {
        setError('Salary amount must be greater than 0');
        setLoading(false);
        return;
      }

      await api.post('/users/employees/register', {
        employeeName: formData.employeeName,
        phone: formData.phone,
        jobPosition: formData.jobPosition,
        hireDate: formData.hireDate,
        salaryAmount: salaryAmount,
        paymentFrequency: formData.paymentFrequency
      });

      setFormData({
        employeeName: '',
        phone: '',
        jobPosition: '',
        hireDate: '',
        salaryAmount: '',
        paymentFrequency: 'monthly'
      });

      setSuccess('ሰራተኛ በስኬት ተመዝግቧል | Employee Registered Successfully');
      setShowForm(false);
      loadEmployees();
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || t.registerError);
    } finally {
      setLoading(false);
    }
  };

  const handlePaySalary = async (employeeId) => {
    if (window.confirm(t.payConfirm)) {
      try {
        await api.post(`/users/${employeeId}/pay-salary`);
        setSuccess('ደመወዝ በስኬት ተከፈለ | Salary Paid Successfully');
        loadEmployees();
        
        // Auto-dismiss success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(t.paymentError);
      }
    }
  };

  const handleBulkPayment = async () => {
    if (!bulkPaymentData.paymentDate) {
      setError('Please select a payment date');
      return;
    }

    if (bulkPaymentData.selectedEmployees.length === 0) {
      setError('Please select at least one employee');
      return;
    }

    const confirmMsg = `Process payment for ${bulkPaymentData.selectedEmployees.length} employee(s) on ${bulkPaymentData.paymentDate}?`;
    
    if (window.confirm(confirmMsg)) {
      setBulkPaymentLoading(true);
      setError('');
      
      try {
        const response = await api.post('/users/employees/bulk-payment', {
          paymentDate: bulkPaymentData.paymentDate,
          paymentType: bulkPaymentData.paymentType,
          employeeIds: bulkPaymentData.selectedEmployees
        });

        setSuccess(`${response.data.paidCount} ሰራተኞች ደመወዝ ተከፈላቸው | Salaries paid to ${response.data.paidCount} employees`);
        setBulkPaymentData({
          paymentDate: '',
          paymentType: 'monthly',
          selectedEmployees: []
        });
        setShowBulkPayment(false);
        loadEmployees();
        
        // Auto-dismiss success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to process bulk payments');
      } finally {
        setBulkPaymentLoading(false);
      }
    }
  };

  const toggleEmployeeSelection = (employeeId) => {
    setBulkPaymentData(prev => {
      const isSelected = prev.selectedEmployees.includes(employeeId);
      return {
        ...prev,
        selectedEmployees: isSelected 
          ? prev.selectedEmployees.filter(id => id !== employeeId)
          : [...prev.selectedEmployees, employeeId]
      };
    });
  };

  const handleEdit = (employee) => {
    setEditingId(employee._id);
    setFormData({
      employeeName: employee.username,
      phone: employee.phone,
      jobPosition: employee.jobPosition,
      hireDate: employee.hireDate.split('T')[0],
      salaryAmount: employee.salaryAmount.toString(),
      paymentFrequency: employee.paymentFrequency
    });
    setShowForm(true);
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/users/${employeeId}`);
        setSuccess('ሰራተኛ በስኬት ተሰርዟል | Employee Deleted Successfully');
        loadEmployees();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete employee');
      }
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyLabel = (freq) => {
    switch (freq) {
      case 'daily':
        return t.daily;
      case 'weekly':
        return t.weekly;
      case 'monthly':
        return t.monthly;
      default:
        return freq;
    }
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case 'paid':
        return t.paid;
      case 'pending':
        return t.pending;
      case 'overdue':
        return t.overdue;
      default:
        return status;
    }
  };

  // Calculate payment summary based on filter
  const calculatePaymentSummary = () => {
    if (paymentHistory.length === 0) {
      setPaymentSummary(null);
      return;
    }

    let filteredPayments = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    if (summaryFilter.type === 'monthly') {
      // Parse the selected month (YYYY-MM format)
      const [year, month] = summaryFilter.selectedMonth.split('-');
      
      filteredPayments = paymentHistory.filter(record => {
        if (!record.ethiopianDate) return false;
        
        // For Ethiopian calendar, month should match
        // We'll check based on the Gregorian date and convert to Ethiopian month
        const paymentDate = new Date(record.paymentDate);
        const paymentMonth = paymentDate.getMonth() + 1;
        const paymentYear = paymentDate.getFullYear();
        
        return paymentYear.toString() === year && paymentMonth.toString() === month.padStart(2, '0');
      });
    } else if (summaryFilter.type === 'weekly') {
      // Filter by week
      const selectedWeek = parseInt(summaryFilter.selectedWeek);
      
      filteredPayments = paymentHistory.filter(record => {
        const paymentDate = new Date(record.paymentDate);
        const start = new Date(currentYear, 0, 1);
        const diff = paymentDate - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const day = Math.floor(diff / oneDay);
        const weekNum = Math.floor((day + start.getDay()) / 7) + 1;
        
        return weekNum === selectedWeek && paymentDate.getFullYear() === currentYear;
      });
    }

    // Calculate totals
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.salaryAmount, 0);
    const totalEmployees = new Set(filteredPayments.map(p => p.employeeName)).size;
    const paidCount = filteredPayments.filter(p => p.status === 'paid').length;

    setPaymentSummary({
      totalAmount,
      totalEmployees,
      paidCount,
      totalRecords: filteredPayments.length,
      records: filteredPayments
    });
  };

  // Handle summary filter change
  const handleSummaryFilterChange = () => {
    calculatePaymentSummary();
  };

  const handlePaymentHistoryCheckboxChange = (recordIndex) => {
    const newSelected = new Set(selectedPaymentHistoryRows);
    if (newSelected.has(recordIndex)) {
      newSelected.delete(recordIndex);
    } else {
      if (newSelected.size < 10) {
        newSelected.add(recordIndex);
      } else {
        setError('You can select up to 10 records maximum');
        return;
      }
    }
    setSelectedPaymentHistoryRows(newSelected);
  };

  const handleBulkDeletePaymentHistory = async () => {
    if (selectedPaymentHistoryRows.size === 0) {
      setError('Please select at least one payment record to delete');
      return;
    }

    const confirmMsg = `Delete ${selectedPaymentHistoryRows.size} payment record(s)? This cannot be undone.`;
    if (window.confirm(confirmMsg)) {
      try {
        setPaymentHistoryDeleting(true);
        setError('');

        // Delete selected records
        const recordsToDelete = Array.from(selectedPaymentHistoryRows).map(idx => paymentHistory[idx]);
        
        for (const record of recordsToDelete) {
          await api.delete(`/users/employees/payment-history/${record._id}`);
        }

        setSuccess(`${selectedPaymentHistoryRows.size} payment record(s) deleted successfully`);
        setSelectedPaymentHistoryRows(new Set());
        loadEmployees();
        
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete payment records');
        console.error(err);
      } finally {
        setPaymentHistoryDeleting(false);
      }
    }
  };

  const clearPaymentHistorySelection = () => {
    setSelectedPaymentHistoryRows(new Set());
  };

  return (
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 text-primary hover:text-yellow-700 font-semibold"
        >
          {translations.nav.backToHome}
        </button>

      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>

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

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 bg-primary hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
      >
        {showForm ? t.close : t.register}
      </button>

      <button
        onClick={() => setShowBulkPayment(!showBulkPayment)}
        className="mb-6 ml-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {showBulkPayment ? 'Cancel' : 'Process Weekly/Monthly Payment'}
      </button>

      <button
        onClick={() => {
          setShowPaymentSummary(!showPaymentSummary);
          if (!showPaymentSummary) {
            calculatePaymentSummary();
          }
        }}
        className="mb-6 ml-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        {showPaymentSummary ? 'Hide' : 'Payment Summary'}
      </button>

      {showBulkPayment && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Process Weekly/Monthly Payments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <EthiopianDatePicker
                value={bulkPaymentData.paymentDate}
                onChange={(date) => setBulkPaymentData({ ...bulkPaymentData, paymentDate: date })}
                label="Payment Date (E.C)"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Payment Type <span className="text-red-500">*</span>
              </label>
              <select
                value={bulkPaymentData.paymentType}
                onChange={(e) => setBulkPaymentData({ ...bulkPaymentData, paymentType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Employee Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Employees <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
              {employees.length > 0 ? (
                employees.map(emp => (
                  <label key={emp._id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bulkPaymentData.selectedEmployees.includes(emp._id)}
                      onChange={() => toggleEmployeeSelection(emp._id)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{emp.username}</div>
                      <div className="text-xs text-gray-500">{emp.phone} • {emp.jobPosition}</div>
                    </div>
                    <div className="text-sm font-semibold text-primary">{emp.salaryAmount.toFixed(2)}</div>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No employees available</p>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Selected: {bulkPaymentData.selectedEmployees.length} employee(s)
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBulkPayment}
              disabled={bulkPaymentLoading || bulkPaymentData.selectedEmployees.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
            >
              {bulkPaymentLoading ? 'Processing...' : 'Process Payments'}
            </button>
            <button
              onClick={() => {
                setShowBulkPayment(false);
                setBulkPaymentData({
                  paymentDate: '',
                  paymentType: 'monthly',
                  selectedEmployees: []
                });
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Payment Summary Section */}
      {showPaymentSummary && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Filter Type <span className="text-red-500">*</span>
              </label>
              <select
                value={summaryFilter.type}
                onChange={(e) => {
                  setSummaryFilter({ ...summaryFilter, type: e.target.value });
                  setTimeout(() => handleSummaryFilterChange(), 0);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            {summaryFilter.type === 'monthly' && (
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Month <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  value={summaryFilter.selectedMonth}
                  onChange={(e) => {
                    setSummaryFilter({ ...summaryFilter, selectedMonth: e.target.value });
                    setTimeout(() => handleSummaryFilterChange(), 0);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}

            {summaryFilter.type === 'weekly' && (
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Week <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="53"
                  value={summaryFilter.selectedWeek}
                  onChange={(e) => {
                    setSummaryFilter({ ...summaryFilter, selectedWeek: e.target.value });
                    setTimeout(() => handleSummaryFilterChange(), 0);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Week number (1-53)"
                />
              </div>
            )}
          </div>

          {/* Summary Display */}
          {paymentSummary && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-sm font-semibold text-gray-600">Total Amount</div>
                  <div className="text-2xl font-bold text-blue-600 mt-1">
                    {paymentSummary.totalAmount.toFixed(2)} ብር
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-sm font-semibold text-gray-600">Unique Employees</div>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    {paymentSummary.totalEmployees}
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-sm font-semibold text-gray-600">Paid Records</div>
                  <div className="text-2xl font-bold text-purple-600 mt-1">
                    {paymentSummary.paidCount}
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="text-sm font-semibold text-gray-600">Total Records</div>
                  <div className="text-2xl font-bold text-orange-600 mt-1">
                    {paymentSummary.totalRecords}
                  </div>
                </div>
              </div>

              {/* Payment records for this period */}
              {paymentSummary.records.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-3">Payment Details for This Period</h3>
                  <div className="overflow-x-auto max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left">Employee</th>
                          <th className="px-3 py-2 text-left">Position</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                          <th className="px-3 py-2 text-left">Frequency</th>
                          <th className="px-3 py-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentSummary.records.map((record, idx) => (
                          <tr key={idx} className="border-t hover:bg-gray-50">
                            <td className="px-3 py-2 font-medium">{record.employeeName}</td>
                            <td className="px-3 py-2">{record.jobPosition}</td>
                            <td className="px-3 py-2 text-right font-semibold">{record.salaryAmount.toFixed(2)}</td>
                            <td className="px-3 py-2">{getFrequencyLabel(record.paymentFrequency)}</td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                record.status === 'paid' 
                                  ? 'bg-green-200 text-green-800' 
                                  : 'bg-yellow-200 text-yellow-800'
                              }`}>
                                {record.status === 'paid' ? 'Paid ✓' : 'Unpaid ✗'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {paymentSummary && paymentSummary.totalRecords === 0 && (
            <div className="text-center text-gray-500 py-8">
              No payments found for the selected period
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">{t.registerForm}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="e.g., John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., 0911234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {t.jobPosition} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jobPosition"
                  value={formData.jobPosition}
                  onChange={handleChange}
                  placeholder={t.jobExample}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <EthiopianDatePicker
                  value={formData.hireDate}
                  onChange={(date) => setFormData({ ...formData, hireDate: date })}
                  label={t.hireDate}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {t.salaryAmount} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salaryAmount"
                  value={formData.salaryAmount}
                  onChange={handleChange}
                  placeholder={t.enterSalary}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {t.paymentFrequency}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentFrequency"
                      value="daily"
                      checked={formData.paymentFrequency === 'daily'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>{t.daily}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentFrequency"
                      value="weekly"
                      checked={formData.paymentFrequency === 'weekly'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>{t.weekly}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentFrequency"
                      value="monthly"
                      checked={formData.paymentFrequency === 'monthly'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>{t.monthly}</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-secondary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? t.registering : t.register}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-bold p-6 bg-gray-50">{t.list}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">{t.name}</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">{t.position}</th>
                <th className="px-4 py-2 text-left">{t.hireDate}</th>
                <th className="px-4 py-2 text-right">{t.salary}</th>
                <th className="px-4 py-2 text-left">{t.frequency}</th>
                <th className="px-4 py-2 text-left">{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map(emp => (
                  <tr key={emp._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{emp.username}</td>
                    <td className="px-4 py-2">{emp.phone || 'N/A'}</td>
                    <td className="px-4 py-2">{emp.jobPosition || 'N/A'}</td>
                    <td className="px-4 py-2">
                      {emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-right font-semibold">{emp.salaryAmount.toFixed(2)}</td>
                    <td className="px-4 py-2">{getFrequencyLabel(emp.paymentFrequency)}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                    {t.noEmployees}
                  </td>
                </tr>
              )}
              {employees.length > 0 && (
                <tr className="bg-gray-100 font-bold border-t-2 border-gray-400">
                  <td className="px-4 py-3 text-left">
                    <span className="text-blue-600">{t.totalEmployees}: {employees.length}</span>
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-primary">
                      {employees.reduce((sum, e) => sum + e.salaryAmount, 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
        {selectedPaymentHistoryRows.size > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">
              {selectedPaymentHistoryRows.size} record(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={clearPaymentHistorySelection}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
              >
                Clear Selection
              </button>
              <button
                onClick={handleBulkDeletePaymentHistory}
                disabled={paymentHistoryDeleting}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 font-semibold disabled:opacity-50"
              >
                {paymentHistoryDeleting ? 'Deleting...' : `Delete Selected (${selectedPaymentHistoryRows.size})`}
              </button>
            </div>
          </div>
        )}

        <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">💳 Payment History</h2>
          {paymentHistory.length > 0 && (
            <span className="text-sm text-gray-600">
              Total Records: {paymentHistory.length}
            </span>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedPaymentHistoryRows.size === paymentHistory.length && paymentHistory.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newSelected = new Set();
                        paymentHistory.slice(0, 10).forEach((_, idx) => newSelected.add(idx));
                        setSelectedPaymentHistoryRows(newSelected);
                      } else {
                        setSelectedPaymentHistoryRows(new Set());
                      }
                    }}
                    className="cursor-pointer"
                  />
                </th>
                <th className="px-4 py-2 text-left">Employee Name</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Position</th>
                <th className="px-4 py-2 text-right">Salary</th>
                <th className="px-4 py-2 text-left">Frequency</th>
                <th className="px-4 py-2 text-left">Payment Date (E.C)</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.length > 0 ? (
                paymentHistory.map((record, idx) => {
                  // Format Ethiopian date as DD/MM/YYYY
                  const ethDateStr = record.ethiopianDate 
                    ? `${String(record.ethiopianDate.day).padStart(2, '0')}/${String(record.ethiopianDate.month).padStart(2, '0')}/${record.ethiopianDate.year}`
                    : 'N/A';
                  
                  const isSelected = selectedPaymentHistoryRows.has(idx);
                  
                  return (
                    <tr 
                      key={idx} 
                      className={`border-t hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-2 w-10">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handlePaymentHistoryCheckboxChange(idx)}
                          disabled={!isSelected && selectedPaymentHistoryRows.size >= 10}
                          className="cursor-pointer disabled:opacity-50"
                        />
                      </td>
                      <td className="px-4 py-2 font-medium">{record.employeeName}</td>
                      <td className="px-4 py-2">{record.phone}</td>
                      <td className="px-4 py-2">{record.jobPosition}</td>
                      <td className="px-4 py-2 text-right font-semibold">{record.salaryAmount.toFixed(2)}</td>
                      <td className="px-4 py-2">{getFrequencyLabel(record.paymentFrequency)}</td>
                      <td className="px-4 py-2 font-semibold text-blue-600">{ethDateStr}</td>
                      <td className="px-4 py-2">
                        <span className={`px-3 py-1 rounded text-xs font-bold ${
                          record.status === 'paid' 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {record.status === 'paid' ? 'Paid ✓' : 'Unpaid ✗'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                    No payment history
                  </td>
                </tr>
              )}
              
              {/* Total Row */}
              {paymentHistory.length > 0 && (
                <tr className="border-t-2 border-t-gray-400 bg-gray-100 font-bold">
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right">Total Paid:</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-lg text-primary">
                    {paymentHistory.reduce((sum, record) => sum + record.salaryAmount, 0).toFixed(2)} ብር
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
