import mongoose from 'mongoose';

const employeePaymentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeName: String,
  phone: String,
  jobPosition: String,
  salaryAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  ethiopianDate: {
    year: Number,
    month: Number,
    day: Number
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'paid'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
employeePaymentSchema.index({ owner: 1, employee: 1, paymentDate: -1 });
employeePaymentSchema.index({ owner: 1, paymentDate: -1 });

export default mongoose.model('EmployeePayment', employeePaymentSchema);
