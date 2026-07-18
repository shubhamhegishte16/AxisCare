import LabAppointment from '../models/LabAppointment.js';
import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';
import User from '../models/user.js';

// Book a lab appointment
export const bookLabAppointment = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get patient details
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found. Please complete your profile first.',
      });
    }

    const user = await User.findById(userId);

    const {
      prescriptionId,
      labTests,
      labName,
      labAddress,
      appointmentDate,
      appointmentTime,
      appointmentType,
      notes,
      symptoms,
      referringDoctor,
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      patientEmail,
      patientAddress,
    } = req.body;

    // Validate required fields
    if (!labTests || labTests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one lab test.',
      });
    }

    if (!labName || !labAddress || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields.',
      });
    }

    // Don't validate prescription - just use it if provided
    let prescriptionData = null;
    if (prescriptionId) {
      try {
        prescriptionData = await Prescription.findById(prescriptionId);
        // If prescription exists, use its data
        if (prescriptionData) {
          // console.log('Prescription found:', prescriptionData.prescriptionId);
        }
      } catch (err) {
        // console.log('Prescription not found, continuing without it');
        // Continue without prescription
      }
    }

    // Create lab appointment
    const appointment = new LabAppointment({
      patientId: userId,
      prescriptionId: prescriptionId || null,
      patientName: patientName || patient.fullName || user.fullName,
      patientAge: patientAge || patient.age || '',
      patientGender: patientGender || patient.gender || 'Prefer not to say',
      patientPhone: patientPhone || patient.phone || user.phone || '',
      patientEmail: patientEmail || patient.email || user.email || '',
      patientAddress: patientAddress || patient.address || '',
      labTests: labTests.map(test => ({
        testName: test.testName,
        category: test.category || 'Other',
        instructions: test.instructions || '',
        status: 'Pending',
      })),
      labName,
      labAddress,
      appointmentDate,
      appointmentTime,
      appointmentType: appointmentType || 'In-Person',
      notes: notes || '',
      symptoms: symptoms || '',
      referringDoctor: referringDoctor || '',
      status: 'Pending',
      paymentStatus: 'Pending',
      amount: 0,
      bookedAt: new Date(),
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Lab appointment booked successfully.',
      data: appointment,
    });
  } catch (error) {
    console.error('Error in bookLabAppointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get all lab appointments for the logged-in patient
export const getMyLabAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 50, page = 1, status } = req.query;

    const query = { patientId: userId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const appointments = await LabAppointment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LabAppointment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      data: appointments,
    });
  } catch (error) {
    console.error('Error in getMyLabAppointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get lab appointment details
export const getLabAppointmentDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const appointment = await LabAppointment.findOne({ _id: id, patientId: userId });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Lab appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Error in getLabAppointmentDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Cancel lab appointment
export const cancelLabAppointment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const appointment = await LabAppointment.findOne({ _id: id, patientId: userId });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Lab appointment not found.',
      });
    }

    if (appointment.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed appointment.',
      });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Lab appointment cancelled successfully.',
      data: appointment,
    });
  } catch (error) {
    console.error('Error in cancelLabAppointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Reschedule lab appointment
export const rescheduleLabAppointment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { appointmentDate, appointmentTime, notes } = req.body;

    const appointment = await LabAppointment.findOne({ _id: id, patientId: userId });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Lab appointment not found.',
      });
    }

    if (appointment.status === 'Completed' || appointment.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot reschedule a ${appointment.status.toLowerCase()} appointment.`,
      });
    }

    appointment.appointmentDate = appointmentDate || appointment.appointmentDate;
    appointment.appointmentTime = appointmentTime || appointment.appointmentTime;
    appointment.notes = notes || appointment.notes;
    appointment.status = 'Scheduled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Lab appointment rescheduled successfully.',
      data: appointment,
    });
  } catch (error) {
    console.error('Error in rescheduleLabAppointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get lab test categories
export const getLabTestCategories = async (req, res) => {
  try {
    const categories = [
      { value: 'Hematology', label: 'Hematology' },
      { value: 'Biochemistry', label: 'Biochemistry' },
      { value: 'Urinalysis', label: 'Urinalysis' },
      { value: 'Microbiology', label: 'Microbiology' },
      { value: 'Pathology', label: 'Pathology' },
      { value: 'Radiology', label: 'Radiology' },
      { value: 'Other', label: 'Other' },
    ];

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error in getLabTestCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};