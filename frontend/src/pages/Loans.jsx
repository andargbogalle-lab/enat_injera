import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import EthiopianDatePicker from '../components/EthiopianDatePicker';
import { gregorianToEthiopian, formatEthiopianDateTable } from '../utils/ethiopianCalendar';
import { formatBirr, formatCurrency } from '../utils/formatters';

export default function Loans() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [formData, setFormData] = useState({
    lenderName: '',
    loanDate: '',
    loanAmount: '',
    description: ''
  });
  const [paymentData, setPaymentData] = useState({
    amountPaid: '',
    paymentDate: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      const response = await api.get('/loans');
      setLoans(response.data);
    } catch (err) {
      setError('Failed to load loans');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const loanAmount = parseFloat(formData.loanAmount);
    if (loanAmount <= 0) {
      setError('Loan amount must be greater than 0');
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
      await api.post('/loans', {
        lenderName: formData.lenderName,
        loanDate: formData.loanDate,
        loanAmount: parseFloat(formData.loanAmount),
        description: formData.description
      });

      setFormData({ lenderName: '', loanDate: '', loanAmount: '', description: '' });
      setSuccess('የተበደረ ገንዘብ በስኬት ተመዝግቧል | Loan Registered Successfully');
      setShowForm(false);
      loadLoans();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register loan');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const paymentAmount = parseFloat(paymentData.amountPaid);
      if (paymentAmount <= 0) {
        setError('Payment amount must be greater than 0');
        setLoading(false);
        return;
      }

      if (paymentAmount > selectedLoan.remainingBalance) {
        setError(`Payment amount cannot exceed remaining balance (${selectedLoan.remainingBalance})`);
        setLoading(false);
        return;
      }

      await api.post(`/loans/${selectedLoan._id}/payment`, {
        amountPaid: paymentAmount,
        paymentDate: paymentData.paymentDate,
        note: paymentData.note
      });

      setPaymentData({ amountPaid: '', paymentDate: '', note: '' });
      setSuccess('ክፍያ በስኬት ተመዝግቧል | Payment Recorded Successfully');
      setShowPaymentForm(false);
      loadLoans();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (loanId) => {
    if (window.confirm('Are you sure you want to delete this loan record?')) {
      try {
        await api.delete(`/loans/${loanId}`);
        setSuccess('የተበደረ ገንዘብ በስኬት ተሰርዟል | Loan Deleted Successfully');
        loadLoans();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete loan');
      }
    }
  };

  const selectLoan = (loan) => {
    setSelectedLoan(loan);
    setShowPaymentForm(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid-off':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid-off':
        return 'Paid Off';
      case 'overdue':
        return 'Overdue';
      case 'active':
        return 'Active';
      default:
        return status;
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

      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">Loans Management (የተበደረ ገንዘብ)</h1>

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

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 bg-primary hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
      >
        {showForm ? 'Cancel' : 'Register New Loan'}
      </button>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
          <h2 className="text-lg md:text-xl font-bold mb-4">Register New Loan (የአበዳሪውን ስም ከቀንና ብር ብዛት ጋር)</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Lender Name (የአበዳሪውን ስም) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lenderName"
                  value={formData.lenderName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  placeholder="e.g., ሳቦ ወይም ነጋዴ"
                />
              </div>

              <div>
                <EthiopianDatePicker
                  value={formData.loanDate}
                  onChange={(date) => setFormData({ ...formData, loanDate: date })}
                  label="Loan Date (የተበደርኩበትን ቀን) *"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Loan Amount (ብር) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  step="0.01"
                  min="0"
                  placeholder="Enter loan amount"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description (ማብራሪያ)
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., ለንግድ ሥራ"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-secondary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Loan'}
            </button>
          </form>
        </div>
      )}

      {/* Loans Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">Total Loans</div>
          <div className="text-3xl font-bold text-blue-600">{loans.length}</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">Total Borrowed</div>
          <div className="text-3xl font-bold text-red-600">
            {formatBirr(loans.reduce((sum, l) => sum + l.loanAmount, 0))} ብር
          </div>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">Total Remaining</div>
          <div className="text-3xl font-bold text-green-600">
            {formatBirr(loans.reduce((sum, l) => sum + l.remainingBalance, 0))} ብር
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-lg md:text-xl font-bold p-4 md:p-6 border-b">All Loans</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm lg:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 md:px-4 py-2 text-left">Lender</th>
                <th className="px-2 md:px-4 py-2 text-left">Loan Date</th>
                <th className="px-2 md:px-4 py-2 text-right">Loan Amount</th>
                <th className="px-2 md:px-4 py-2 text-right">Amount Paid</th>
                <th className="px-2 md:px-4 py-2 text-right">Remaining</th>
                <th className="px-2 md:px-4 py-2 text-left">Status</th>
                <th className="px-2 md:px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(loan => {
                const ethDate = gregorianToEthiopian(new Date(loan.loanDate));
                return (
                  <tr key={loan._id} className="border-t hover:bg-gray-50">
                    <td className="px-2 md:px-4 py-2 font-medium">{loan.lenderName}</td>
                    <td className="px-2 md:px-4 py-2">
                      {formatEthiopianDateTable(ethDate.year, ethDate.month, ethDate.day)}
                    </td>
                    <td className="px-2 md:px-4 py-2 text-right font-semibold">{formatBirr(loan.loanAmount)}</td>
                    <td className="px-2 md:px-4 py-2 text-right text-green-600">{formatBirr(loan.amountPaid)}</td>
                    <td className="px-2 md:px-4 py-2 text-right text-red-600 font-semibold">{formatBirr(loan.remainingBalance)}</td>
                    <td className="px-2 md:px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(loan.status)}`}>
                        {getStatusLabel(loan.status)}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-2 flex gap-2">
                      <button
                        onClick={() => selectLoan(loan)}
                        disabled={loan.status === 'paid-off'}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                      >
                        Pay
                      </button>
                      <button
                        onClick={() => handleDelete(loan._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
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

      {/* Payment Form Modal */}
      {showPaymentForm && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-sm w-full my-8">
            <h2 className="text-lg font-bold mb-3">Make Payment (ክፍያ ማድረግ)</h2>
            
            <div className="mb-3 p-2 bg-blue-50 rounded">
              <p className="text-xs text-gray-600">Lender: <span className="font-bold text-sm">{selectedLoan.lenderName}</span></p>
              <p className="text-xs text-gray-600">Remaining: <span className="font-bold text-red-600 text-sm">{formatBirr(selectedLoan.remainingBalance)} ብር</span></p>
            </div>

            <form onSubmit={handlePayment} className="space-y-3">
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">
                  Payment Amount (ክፍያ ብር) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amountPaid"
                  value={paymentData.amountPaid}
                  onChange={handlePaymentChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                  required
                  step="0.01"
                  min="0"
                  max={selectedLoan.remainingBalance}
                  placeholder="Enter payment amount"
                />
              </div>

              <div>
                <EthiopianDatePicker
                  value={paymentData.paymentDate}
                  onChange={(date) => setPaymentData({ ...paymentData, paymentDate: date })}
                  label="Payment Date (ክፍያ ቀን) *"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">
                  Note (ማስታወሻ)
                </label>
                <input
                  type="text"
                  name="note"
                  value={paymentData.note}
                  onChange={handlePaymentChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                  placeholder="e.g., Partial payment"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Process'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentForm(false);
                    setPaymentData({ amountPaid: '', paymentDate: '', note: '' });
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Payment History */}
            {selectedLoan.paymentHistory && selectedLoan.paymentHistory.length > 0 && (
              <div className="mt-3 border-t pt-3">
                <h3 className="font-bold text-gray-800 text-sm mb-2">Payment History (ክፍያ ታሪክ)</h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {selectedLoan.paymentHistory.map((payment, idx) => {
                    const ethDate = gregorianToEthiopian(new Date(payment.paymentDate));
                    return (
                      <div key={idx} className="p-1.5 bg-gray-50 rounded border-l-4 border-green-500">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-800">
                              {formatBirr(payment.amountPaid)} ብር
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatEthiopianDateTable(ethDate.year, ethDate.month, ethDate.day)}
                            </p>
                            {payment.note && (
                              <p className="text-xs text-gray-500 italic">{payment.note}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Remaining:</p>
                            <p className="text-xs font-bold text-primary">{formatBirr(payment.remainingAfter)} ብር</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
