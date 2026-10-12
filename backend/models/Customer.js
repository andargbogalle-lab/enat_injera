import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// Index for owner queries
customerSchema.index({ owner: 1 });

export default mongoose.model('Customer', customerSchema);
