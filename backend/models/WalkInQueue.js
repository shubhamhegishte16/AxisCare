import mongoose from 'mongoose';

const walkInQueueSchema = new mongoose.Schema({
  queueNumber: { type: String, unique: true, required: true },
  patientName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, trim: true, default: '' },
  department: { type: String, default: '' },
  priority: { type: String, enum: ['Normal', 'Emergency'], default: 'Normal' },
  status: { type: String, enum: ['Waiting', 'Serving', 'Completed'], default: 'Waiting' },
  arrivalTime: { type: String, required: true },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

walkInQueueSchema.index({ status: 1 });
walkInQueueSchema.index({ createdAt: -1 });

const WalkInQueue = mongoose.model('WalkInQueue', walkInQueueSchema);
export default WalkInQueue;
