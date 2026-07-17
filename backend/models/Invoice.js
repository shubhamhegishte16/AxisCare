import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, unique: true, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  patientName: { type: String, required: true, trim: true },
  department: { type: String, default: '' },
  amount: { type: Number, required: true, min: 0 },
  method: { type: String, enum: ['Cash', 'Card', 'UPI', 'Insurance', 'Not Paid'], default: 'Not Paid' },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

invoiceSchema.index({ status: 1 });
invoiceSchema.index({ createdAt: -1 });

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
