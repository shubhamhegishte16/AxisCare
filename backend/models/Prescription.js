import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  instructions: { type: String, default: '' },
});

const vitalsSchema = new mongoose.Schema({
  bloodPressure: { type: String, default: '' },
  pulseRate: { type: String, default: '' },
  temperature: { type: String, default: '' },
  weight: { type: String, default: '' },
  height: { type: String, default: '' },
  spO2: { type: String, default: '' },
  bloodSugar: { type: String, default: '' },
});

const prescriptionSchema = new mongoose.Schema({
  prescriptionId: { type: String, unique: true, required: true }, // e.g. RX-2026-1250
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName: { type: String, required: true },
  
  // Patient details (snapshot)
  patientName: { type: String, required: true },
  patientAge: { type: String, required: true },
  patientGender: { type: String, required: true },
  patientContact: { type: String, default: '' },
  
  // Appointment Details
  department: { type: String, default: '' },
  visitType: { type: String, default: '' },
  consultationDate: { type: String, default: '' },

  // Form Fields
  chiefComplaint: { type: String, default: '' },
  symptoms: { type: String, default: '' },
  diagnosisPrimary: { type: String, default: '' },
  diagnosisNotes: { type: String, default: '' },
  exercises: { type: String, default: '' },
  dietAdvice: { type: String, default: '' },
  additionalNotes: { type: String, default: '' },
  labTests: { type: String, default: '' },
  
  medicines: [medicineSchema],
  vitals: { type: vitalsSchema, default: () => ({}) },

  status: {
    type: String,
    enum: ['Draft', 'Generated'],
    default: 'Draft',
  },
}, { timestamps: true });

prescriptionSchema.index({ doctorId: 1 });
prescriptionSchema.index({ status: 1 });

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
