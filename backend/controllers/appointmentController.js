// appointmentController.js -
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import User from '../models/user.js';
import DoctorProfile from '../models/doctorProfile.js';
import { triggerNotification } from '../utils/triggerNotification.js';
import { triggerDoctorNotification } from '../utils/triggerDoctorNotification.js';

const generateAppointmentId = () => `#APT-${Math.floor(100000 + Math.random() * 900000)}`;
// POST /api/appointments — patient books appointment
export const bookAppointment = async (req, res) => {
  try {
    const userId = req.user._id;
    const patient = await Patient.findOne({ userId });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found. Please complete your profile first.' });
    const { fullName, phoneNumber, email, age, gender, address, department, doctor, doctorProfileId, appointmentType, preferredDate, preferredTime, reasonForVisit, symptoms } = req.body;
    if (!fullName || !phoneNumber || !email || !age || !gender || !address || !department || !doctor || !appointmentType || !preferredDate || !preferredTime || !reasonForVisit) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }
    const appointmentId = generateAppointmentId();
    const documentPath = req.file ? `/uploads/${req.file.filename}` : null;
    const appointment = new Appointment({
      userId,
      patientId: patient._id,
      appointmentId,
      fullName, phoneNumber, email, age, gender, address,
      department, doctor,
      doctorProfileId: doctorProfileId || null,
      appointmentType, preferredDate, preferredTime,
      reasonForVisit,
      symptoms: symptoms || '',
      documentPath,
      status: 'Pending',
    });
    await appointment.save();

    await triggerNotification(
      userId,
      'Appointments',
      'Appointment Request Submitted',
      `Your appointment request with Dr. ${doctor} for ${reasonForVisit} has been submitted successfully.`,
      'Track Status',
      '/patient-appointments',
      'high'
    );

    if (doctorProfileId) {
      const docProfile = await DoctorProfile.findById(doctorProfileId);
      if (docProfile) {
        await triggerDoctorNotification(
          docProfile.user,
          'Appointments',
          'New Appointment Request',
          `You have a new appointment request from ${fullName} for ${reasonForVisit}.`,
          'View Details',
          '/doctordashboard/appointments',
          'high'
        );
      }
    } else {
      // Try to find the doctor by name if profile ID isn't provided
      const doctorNameMatch = doctor.replace('Dr. ', '').trim();
      const docUsers = await User.find({ role: 'doctor', fullName: new RegExp(doctorNameMatch, 'i') });
      if (docUsers.length > 0) {
         await triggerDoctorNotification(
          docUsers[0]._id,
          'Appointments',
          'New Appointment Request',
          `You have a new appointment request from ${fullName} for ${reasonForVisit}.`,
          'View Details',
          '/doctordashboard/appointments',
          'high'
        );
      }
    }

    res.status(201).json({ success: true, message: 'Appointment request submitted successfully.', data: appointment });
  } catch (error) {
    console.error('Error in bookAppointment:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
// GET /api/appointments/mine — get logged-in patient's appointments
export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    const appointments = await Appointment.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    console.error('Error in getMyAppointments:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
// PUT /api/appointments/:id/cancel — patient cancels their appointment
export const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user._id;
    const appointment = await Appointment.findOne({ _id: req.params.id, userId });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    if (['Completed', 'Cancelled'].includes(appointment.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel an appointment with status '${appointment.status}'.` });
    }
    appointment.status = 'Cancelled';
    await appointment.save();

    //TRIGGER NOTIFICATION: Appointment cancelled
    await triggerNotification(
      userId,
      'Appointments',
      'Appointment Cancelled',
      `Your appointment with Dr. ${appointment.doctor} on ${appointment.preferredDate} has been cancelled.`,
      'Reschedule',
      '/appointments',
      'high'
    );

    res.status(200).json({ success: true, message: 'Appointment cancelled.', data: appointment });
  } catch (error) {
    console.error('Error in cancelAppointment:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
// POST /api/appointments/receptionist-create — receptionist/admin books an appointment for a patient
export const createAppointmentByReceptionist = async (req, res) => {
  try {
    const {
      phoneNumber, fullName, email, age, gender, address,
      department, doctor, doctorProfileId, appointmentType,
      preferredDate, preferredTime, reasonForVisit, symptoms, status,
    } = req.body;

    if (!phoneNumber || !fullName || !department || !doctor || !appointmentType || !preferredDate || !preferredTime || !reasonForVisit) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    // Find the patient by phone so we can link the appointment to their profile
    const patient = await Patient.findOne({ phoneNumber });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'No patient found with this phone number. Please register the patient first.',
      });
    }

    const appointmentId = generateAppointmentId();
    const appointment = new Appointment({
      userId: patient.userId,
      patientId: patient._id,
      appointmentId,
      fullName,
      phoneNumber,
      email: email || patient.email,
      age: age || '',
      gender: gender || patient.gender,
      address: address || patient.address,
      department,
      doctor,
      doctorProfileId: doctorProfileId || null,
      appointmentType,
      preferredDate,
      preferredTime,
      reasonForVisit,
      symptoms: symptoms || '',
      status: status || 'Scheduled',
    });
    await appointment.save();
    res.status(201).json({ success: true, message: 'Appointment created successfully.', data: appointment });
  } catch (error) {
    console.error('Error in createAppointmentByReceptionist:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    console.error('Error in getAllAppointments:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
// PUT /api/appointments/:id/status — admin / receptionist updates status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Scheduled', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status value.' });
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found.' });

    //TRIGGER NOTIFICATION: Appointment status changed
    if (status === 'Scheduled') {
      await triggerNotification(
        appointment.userId,
        'Appointments',
        'Appointment Confirmed',
        `Your appointment with Dr. ${appointment.doctor} has been confirmed for ${appointment.preferredDate} at ${appointment.preferredTime}.`,
        'View Details',
        '/appointments',
        'high'
      );
    } else if (status === 'Completed') {
      await triggerNotification(
        appointment.userId,
        'Appointments',
        'Appointment Completed',
        `Your appointment with Dr. ${appointment.doctor} has been marked as completed.`,
        'View Details',
        '/appointments',
        'medium'
      );
    }

    res.status(200).json({ success: true, message: 'Status updated.', data: appointment });
  } catch (error) {
    console.error('Error in updateAppointmentStatus:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
// GET /api/appointments/doctors — fetch all doctors from User collection (role: doctor)
// export const getDoctorsByDepartment = async (req, res) => {
//   try {
//     const doctors = await User.find({ role: 'doctor', isActive: true }).select('_id fullName department').sort({ fullName: 1 });
//     res.status(200).json({ success: true, data: doctors });
//   } catch (error) {
//     console.error('Error in getDoctorsByDepartment:', error);
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

// GET /api/appointments/my-doctor-appointments — doctor sees their appointments (status: Scheduled)
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorName = req.user.fullName;
    const appointments = await Appointment.find({ doctor: doctorName, status: { $in: ['Scheduled', 'Completed'] } }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    console.error('Error in getDoctorAppointments:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
// PUT /api/appointments/:id/doctor-cancel — doctor cancels an appointment assigned to them
export const cancelByDoctor = async (req, res) => {
  try {
    const doctorName = req.user.fullName;
    const appointment = await Appointment.findOne({ _id: req.params.id, doctor: doctorName });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    if (appointment.status === 'Cancelled') return res.status(400).json({ success: false, message: 'Already cancelled.' });
    appointment.status = 'Cancelled';
    await appointment.save();

    // TRIGGER NOTIFICATION: Appointment cancelled by doctor
    await triggerNotification(
      appointment.userId,
      'Appointments',
      'Appointment Cancelled',
      `Your appointment with Dr. ${appointment.doctor} on ${appointment.preferredDate} has been cancelled by the doctor.`,
      'Reschedule',
      '/appointments',
      'high'
    );

    res.status(200).json({ success: true, message: 'Appointment cancelled.', data: appointment });
  } catch (error) {
    console.error('Error in cancelByDoctor:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET /api/appointments/my-doctor-patients — doctor gets a list of unique patients they have seen/are scheduled to see
export const getDoctorPatients = async (req, res) => {
  try {
    const doctorName = req.user.fullName;
    // Find all non-cancelled appointments for this doctor, sorted by most recent
    const appointments = await Appointment.find({ doctor: doctorName, status: { $ne: 'Cancelled' } }).sort({ preferredDate: -1, createdAt: -1 });

    // Extract unique patients based on patientId
    const patientMap = new Map();
    appointments.forEach(apt => {
      const pid = apt.patientId ? apt.patientId.toString() : apt.email;
      if (!patientMap.has(pid)) {
        patientMap.set(pid, {
          id: apt.appointmentId, // Using apt id as a visual reference
          name: apt.fullName,
          age: apt.age,
          gender: apt.gender,
          contact: apt.phoneNumber,
          condition: apt.reasonForVisit,
          lastVisit: apt.preferredDate,
          status: apt.status === 'Completed' ? 'Follow-up Due' : 'Active',
          img: `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.fullName)}&background=random`
        });
      }
    });

    const uniquePatients = Array.from(patientMap.values());
    res.status(200).json({ success: true, count: uniquePatients.length, data: uniquePatients });
  } catch (error) {
    console.error('Error in getDoctorPatients:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// PUT /api/appointments/:id/doctor-complete — doctor marks an appointment as Completed
export const completeByDoctor = async (req, res) => {
  try {
    const doctorName = req.user.fullName;
    const appointment = await Appointment.findOne({ _id: req.params.id, doctor: doctorName });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    if (appointment.status === 'Completed') return res.status(400).json({ success: false, message: 'Already completed.' });
    appointment.status = 'Completed';
    await appointment.save();

    //TRIGGER NOTIFICATION: Appointment completed
    await triggerNotification(
      appointment.userId,
      'Appointments',
      'Appointment Completed',
      `Your appointment with Dr. ${appointment.doctor} has been completed successfully.`,
      'View Details',
      '/appointments',
      'medium'
    );

    res.status(200).json({ success: true, message: 'Appointment marked as completed.', data: appointment });
  } catch (error) {
    console.error('Error in completeByDoctor:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET /api/appointments/doctors — fetch all doctors with their profiles
export const getDoctorsByDepartment = async (req, res) => {
  try {
    console.log('Fetching doctors with profiles...');

    // First, get all doctors from User collection
    const doctors = await User.find({
      role: 'doctor',
      isActive: true
    }).select('_id fullName email phone avatar');

    // console.log(`Found ${doctors.length} doctors in User collection`);

    // Get their doctor profiles to fetch department and specialization
    const doctorIds = doctors.map(d => d._id);
    const doctorProfiles = await DoctorProfile.find({
      user: { $in: doctorIds }
    });

    // console.log(`Found ${doctorProfiles.length} doctor profiles`);

    // Merge the data
    const mergedDoctors = doctors.map(doctor => {
      const profile = doctorProfiles.find(p => p.user.toString() === doctor._id.toString());
      return {
        _id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        phone: doctor.phone,
        avatar: doctor.avatar,
        department: profile?.department || 'General Medicine', // Fallback if no department
        specialization: profile?.specialization || '',
        qualification: profile?.qualification || '',
        experience: profile?.experience || '',
        consultationFee: profile?.consultationFee || 0,
        availableDays: profile?.availableDays || [],
        availableTime: profile?.availableTime || '',
      };
    });

    // console.log('Merged doctors with departments:', mergedDoctors.map(d => ({
    //   name: d.fullName,
    //   department: d.department
    // })));

    res.status(200).json({
      success: true,
      data: mergedDoctors
    });
  } catch (error) {
    console.error('Error in getDoctorsByDepartment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};