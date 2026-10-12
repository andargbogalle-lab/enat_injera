import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
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
    item: {
      type: String,
      required: [true, 'Item description is required'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
    }
  },
  { timestamps: true }
);

// Indexes for efficient queries
purchaseSchema.index({ owner: 1, date: -1 });

export default mongoose.model('Purchase', purchaseSchema);
