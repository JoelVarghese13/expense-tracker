import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    type: {
      type: String,
      enum: ['Income', 'Expense'],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
