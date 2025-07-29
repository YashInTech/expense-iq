import mongoose from 'mongoose';

interface IFinancialRecord {
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

const financialRecordSchema = new mongoose.Schema<IFinancialRecord>(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Add an index for better query performance
    },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFinancialRecord>(
  'FinancialRecord',
  financialRecordSchema
);
