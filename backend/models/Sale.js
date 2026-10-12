import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
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
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative']
    },
    total: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

// Indexes for efficient queries
saleSchema.index({ owner: 1, date: -1 });
saleSchema.index({ owner: 1, customer: 1, date: -1 });

export default mongoose.model('Sale', saleSchema);
