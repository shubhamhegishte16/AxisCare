// appointmentController.js -
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import User from '../models/user.js';
import DoctorProfile from '../models/doctorProfile.js';

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
    });
    await appointment.save();
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
    res.status(200).json({ success: true, message: 'Appointment cancelled.', data: appointment });
  } catch (error) {
    console.error('Error in cancelAppointment:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
// GET /api/appointments/all — admin / receptionist
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
