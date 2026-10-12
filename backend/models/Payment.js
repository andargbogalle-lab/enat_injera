import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
      index: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer is required'],
      index: true
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    method: {
      type: String,
      enum: ['cash', 'Telebirr', 'bank'],
      required: [true, 'Payment method is required']
    }
  },
  { timestamps: true }
);

// Indexes for efficient queries
paymentSchema.index({ owner: 1, date: -1 });
paymentSchema.index({ owner: 1, customer: 1, date: -1 });

export default mongoose.model('Payment', paymentSchema);
