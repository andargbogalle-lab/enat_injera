import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema(
  {
    lenderName: {
      type: String,
      required: [true, 'Lender name is required'],
      trim: true
    },
    loanDate: {
      type: Date,
      required: [true, 'Loan date is required']
    },
    loanAmount: {
      type: Number,
      required: [true, 'Loan amount is required'],
      min: [0, 'Loan amount cannot be negative']
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: [0, 'Amount paid cannot be negative']
    },
    remainingBalance: {
      type: Number,
      required: [true, 'Remaining balance is required'],
      min: [0, 'Remaining balance cannot be negative']
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'paid-off', 'overdue'],
      default: 'active'
    },
    paymentHistory: [
      {
        paymentDate: Date,
        amountPaid: Number,
        remainingAfter: Number,
        note: String,
        _id: false
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// Auto-calculate remaining balance
loanSchema.pre('save', function(next) {
  if (this.isModified('amountPaid') || this.isModified('loanAmount')) {
    this.remainingBalance = this.loanAmount - this.amountPaid;
    
    // Update status
    if (this.remainingBalance <= 0) {
      this.status = 'paid-off';
    } else {
      this.status = 'active';
    }
  }
  next();
});

export default mongoose.model('Loan', loanSchema);
