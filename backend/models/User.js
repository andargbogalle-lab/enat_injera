import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    email: {
      type: String,
      sparse: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    // Employee/Salary Fields
    isEmployee: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      trim: true
    },
    jobPosition: {
      type: String,
      trim: true
    },
    hireDate: {
      type: Date
    },
    salaryAmount: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
      default: 0
    },
    paymentFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'monthly'
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'overdue'],
      default: 'pending'
    },
    lastPaymentDate: {
      type: Date
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const salt = await bcryptjs.genSalt(10);
    this.passwordHash = await bcryptjs.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(password) {
  return await bcryptjs.compare(password, this.passwordHash);
};

export default mongoose.model('User', userSchema);
