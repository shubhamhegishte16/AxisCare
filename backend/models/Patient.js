import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  // Reference to the main User model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  // Personal Information (extended)
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
    default: '01/01/1970',
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    required: true,
    default: 'Prefer not to say',
  },
  address: {
    type: String,
    required: true,
    default: 'Not provided',
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  // Patient Identifiers
  patientPassNo: {
    type: String,
    unique: true,
    required: true,
  },
  patientId: {
    type: String,
    unique: true,
    required: true,
  },

  // Insurance Information
  insurance: {
    provider: {
      type: String,
      default: 'ABC Health Insurance',
    },
    policyNumber: {
      type: String,
      default: 'POL-8837492-X',
    },
    groupNumber: {
      type: String,
      default: 'GRP-9921',
    },
    coverageType: {
      type: String,
      default: 'Premium Comprehensive Care',
    },
    validUntil: {
      type: String,
      default: '12/31/2028',
    },
    deductible: {
      type: String,
      default: '$500',
    },
    status: {
      type: String,
      enum: ['Verified', 'Pending', 'Expired', 'Not Available'],
      default: 'Verified',
    },
  },

  // Account Status
  accountStatus: {
    type: String,
    enum: ['Active Verified Account', 'Pending Verification', 'Suspended', 'Inactive'],
    default: 'Active Verified Account',
  },

  // Registration Date
  dateOfRegistration: {
    type: String,
    required: true,
  },

  // Emergency Contacts
  emergencyContacts: [{
    name: {
      type: String,
      required: true,
    },
    relationship: {
      type: String,
      required: true,
    },
    phone1: {
      type: String,
      required: true,
    },
    phone2: {
      type: String,
      default: '',
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  }],

  // Medical History (additional info)
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown',
  },
  allergies: [{
    type: String,
  }],
  chronicConditions: [{
    type: String,
  }],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String,
  }],

  // Profile Image
  profileImage: {
    type: String,
    default: null,
  },

  // Timestamps
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

patientSchema.index({ email: 1 });
patientSchema.index({ phoneNumber: 1 });
patientSchema.index({ createdAt: -1 });

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;