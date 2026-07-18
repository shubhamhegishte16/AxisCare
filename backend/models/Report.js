import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  patientName: { type: String, required: true },
  patientIdString: { type: String }, // e.g. P-0001
  ageGender: { type: String }, // e.g. 45 / Male
  
  reportType: { type: String, required: true },
  priority: { type: String, default: 'NORMAL' },
  visitDate: { type: String, required: true },
  visitTime: { type: String, required: true },
  
  chiefComplaint: { type: String, default: '' },
  
  symptoms: { type: String, default: '' },
  diagnosis: { type: String, default: '' },
  clinicalObservations: { type: String, default: '' },
  
  vitalSigns: {
    temperature: { type: String, default: '' },
    bloodPressure: { type: String, default: '' },
    pulseRate: { type: String, default: '' },
    respiratoryRate: { type: String, default: '' },
    spO2: { type: String, default: '' },
    weight: { type: String, default: '' },
    height: { type: String, default: '' },
    bmi: { type: String, default: '' }
  },

  treatmentSummary: {
    treatmentProvided: { type: String, default: '' },
    medicationsGiven: { type: String, default: '' },
    proceduresPerformed: { type: String, default: '' }
  },
  
  laboratoryAndImaging: {
    labReports: { type: String, default: '' },
    imaging: { type: String, default: '' }
  },
  
  followUpAdvice: { type: String, default: '' },
  lifestyleAdvice: { type: String, default: '' },
  additionalNotes: { type: String, default: '' },
  
  documentPath: { type: String, default: null },
  status: { type: String, enum: ['Draft', 'Final', 'Completed', 'Signed'], default: 'Draft' }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
