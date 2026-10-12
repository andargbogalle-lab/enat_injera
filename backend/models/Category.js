import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true
    }
  },
  { timestamps: true }
);

// Index for owner queries
categorySchema.index({ owner: 1 });

export default mongoose.model('Category', categorySchema);
