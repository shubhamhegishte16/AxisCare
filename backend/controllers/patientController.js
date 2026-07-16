import Patient from '../models/Patient.js';
import User from '../models/user.js';

// Helper function to generate unique patient identifiers
const generatePatientIdentifiers = () => {
  const patientPassNo = String(Math.floor(1000 + Math.random() * 9000));
  const patientId = `#PT-${Math.floor(100000 + Math.random() * 900000)}`;
  return { patientPassNo, patientId };
};

// Helper function to create a new patient profile
const createNewPatient = async (userId, user, additionalData = {}) => {
  const nameParts = user.fullName ? user.fullName.split(' ') : ['', ''];
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  const now = new Date();
  const dateOfRegistration = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
  
  const { patientPassNo, patientId } = generatePatientIdentifiers();

  const patientData = {
    userId: userId,
    firstName: additionalData.firstName || firstName,
    lastName: additionalData.lastName || lastName,
    dateOfBirth: additionalData.dateOfBirth || '01/01/1970',
    gender: additionalData.gender || 'Prefer not to say',
    address: additionalData.address || user.address || 'Not provided',
    phoneNumber: additionalData.phoneNumber || user.phone || 'Not provided',
    email: additionalData.email || user.email || 'Not provided',
    dateOfRegistration: dateOfRegistration,
    patientPassNo: patientPassNo,
    patientId: patientId,
    emergencyContacts: additionalData.emergencyContacts || [
      {
        name: 'Emergency Contact',
        relationship: 'Not specified',
        phone1: 'Not provided',
        isPrimary: true,
      }
    ],
    ...additionalData
  };

  const patient = new Patient(patientData);
  await patient.save();
  console.log('New patient profile created for user');
  return patient;
};

// Get or create patient profile
export const getOrCreatePatientProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if patient profile exists
    let patient = await Patient.findOne({ userId });

    if (!patient) {
      // Create new patient profile
      patient = await createNewPatient(userId, user);
    } else {
      // Ensure the profile has the latest data from user
      let needsUpdate = false;
      if (patient.email !== user.email) {
        patient.email = user.email;
        needsUpdate = true;
      }
      if (patient.phoneNumber !== (user.phone || 'Not provided')) {
        patient.phoneNumber = user.phone || 'Not provided';
        needsUpdate = true;
      }
      if (needsUpdate) {
        await patient.save();
        console.log('Updated patient profile for user:', userId);
      }
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error('Error in getOrCreatePatientProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get patient profile
export const getPatientProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const patient = await Patient.findOne({ userId });

    if (!patient) {
      // If no patient profile, try to create one
      return getOrCreatePatientProfile(req, res);
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error('Error in getPatientProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update patient profile
export const updatePatientProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    console.log('Updating patient profile for user');

    // Remove fields that shouldn't be updated directly
    delete updates.userId;
    delete updates.patientPassNo;
    delete updates.patientId;
    delete updates.dateOfRegistration;

    // Find patient
    let patient = await Patient.findOne({ userId });

    if (!patient) {
      // If no patient, create one with the update data
      const user = await User.findById(userId);
      patient = await createNewPatient(userId, user, updates);
      
      return res.status(201).json({
        success: true,
        message: 'Patient profile created and updated',
        data: patient,
      });
    }

    // Update patient fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && updates[key] !== null && key !== '_id') {
        patient[key] = updates[key];
      }
    });
    patient.lastUpdated = Date.now();
    await patient.save();

    // Also update the main user's email and phone if changed
    if (updates.email || updates.phoneNumber) {
      const userUpdate = {};
      if (updates.email) userUpdate.email = updates.email;
      if (updates.phoneNumber) userUpdate.phone = updates.phoneNumber;
      await User.findByIdAndUpdate(userId, userUpdate);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: patient,
    });
  } catch (error) {
    console.error('Error in updatePatientProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update insurance information
export const updateInsuranceInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const insuranceData = req.body;

    console.log('Updating insurance for user');

    let patient = await Patient.findOne({ userId });

    if (!patient) {
      // Create patient if doesn't exist
      const user = await User.findById(userId);
      patient = await createNewPatient(userId, user, { insurance: insuranceData });
    } else {
      patient.insurance = insuranceData;
      patient.lastUpdated = Date.now();
      await patient.save();
    }

    res.status(200).json({
      success: true,
      message: 'Insurance information updated successfully',
      data: patient.insurance,
    });
  } catch (error) {
    console.error('Error in updateInsuranceInfo:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update emergency contacts
export const updateEmergencyContacts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { emergencyContacts } = req.body;

    if (!emergencyContacts || !Array.isArray(emergencyContacts)) {
      return res.status(400).json({
        success: false,
        message: 'Emergency contacts must be an array',
      });
    }

    // Ensure at least one primary contact
    const hasPrimary = emergencyContacts.some(contact => contact.isPrimary === true);
    if (!hasPrimary && emergencyContacts.length > 0) {
      emergencyContacts[0].isPrimary = true;
    }

    let patient = await Patient.findOne({ userId });

    if (!patient) {
      // Create patient if doesn't exist
      const user = await User.findById(userId);
      patient = await createNewPatient(userId, user, { emergencyContacts });
    } else {
      patient.emergencyContacts = emergencyContacts;
      patient.lastUpdated = Date.now();
      await patient.save();
    }

    res.status(200).json({
      success: true,
      message: 'Emergency contacts updated successfully',
      data: patient.emergencyContacts,
    });
  } catch (error) {
    console.error('Error in updateEmergencyContacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All password fields are required',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    // Import bcrypt
    const bcrypt = await import('bcryptjs');

    // Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error in updatePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get all patients (admin only)
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('userId', 'email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error('Error in getAllPatients:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete patient profile (admin only)
export const deletePatientProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient profile deleted successfully',
    });
  } catch (error) {
    console.error('Error in deletePatientProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};