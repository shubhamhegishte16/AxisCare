import mongoose from 'mongoose';

const labAppointmentSchema = new mongoose.Schema({
  // Patient reference
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Prescription reference (if lab tests are prescribed)
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
    default: null,
  },
  
  // Patient details (snapshot)
  patientName: {
    type: String,
    required: true,
    trim: true,
  },
  patientAge: {
    type: String,
    required: true,
  },
  patientGender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    required: true,
  },
  patientPhone: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  patientAddress: {
    type: String,
    required: true,
  },

  // Lab test details
  labTests: [{
    testName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Hematology', 'Biochemistry', 'Urinalysis', 'Microbiology', 'Pathology', 'Radiology', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['Pending', 'Scheduled', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    instructions: {
      type: String,
      default: '',
    },
    results: {
      type: String,
      default: '',
    },
    reportUrl: {
      type: String,
      default: '',
    },
  }],

  // Appointment details
  labName: {
    type: String,
    required: true,
  },
  labAddress: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: String,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
  },
  appointmentType: {
    type: String,
    enum: ['In-Person', 'Home Collection', 'Video Consult'],
    default: 'In-Person',
  },

  // Additional notes
  notes: {
    type: String,
    default: '',
  },
  symptoms: {
    type: String,
    default: '',
  },

  // Doctor reference (who prescribed the tests)
  referringDoctor: {
    type: String,
    default: '',
  },
  referringDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  // Status tracking
  status: {
    type: String,
    enum: ['Pending', 'Scheduled', 'Completed', 'Cancelled'],
    default: 'Pending',
  },

  // Payment
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending',
  },
  amount: {
    type: Number,
    default: 0,
  },

  // Timestamps
  bookedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes
labAppointmentSchema.index({ patientId: 1, appointmentDate: -1 });
labAppointmentSchema.index({ status: 1 });
labAppointmentSchema.index({ prescriptionId: 1 });

const LabAppointment = mongoose.model('LabAppointment', labAppointmentSchema);
export default LabAppointment;