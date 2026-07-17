import mongoose from 'mongoose';
const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointmentId: { type: String, unique: true, required: true },
  // Patient snapshot (editable at time of booking)
  fullName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  age: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'], required: true },
  address: { type: String, required: true },
  // Appointment details
  department: { type: String, required: true },
  doctor: { type: String, required: true },
  doctorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'DoctorProfile', default: null },
  appointmentType: { type: String, enum: ['In-Person', 'Video Consult'], required: true },
  preferredDate: { type: String, required: true },
  preferredTime: { type: String, required: true },
  reasonForVisit: { type: String, required: true, trim: true },
  symptoms: { type: String, trim: true, default: '' },
  documentPath: { type: String, default: null },
  status: {
    type: String,
    enum: ['Pending', 'Scheduled', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });
appointmentSchema.index({ userId: 1 });
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ preferredDate: 1 });
const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
