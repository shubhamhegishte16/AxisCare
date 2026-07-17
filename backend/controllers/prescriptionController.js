import Prescription from '../models/Prescription.js';

const generatePrescriptionId = async () => {
  const currentYear = new Date().getFullYear();
  const count = await Prescription.countDocuments();
  return `RX-${currentYear}-${1000 + count + 1}`;
};

// POST /api/prescriptions
export const createPrescription = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const doctorName = req.user.fullName;
    
    const { 
      appointmentId, patientName, patientAge, patientGender, patientContact,
      department, visitType, consultationDate,
      chiefComplaint, symptoms, diagnosisPrimary, diagnosisNotes,
      exercises, dietAdvice, additionalNotes, labTests,
      medicines, vitals, status
    } = req.body;

    const prescriptionId = await generatePrescriptionId();

    const newPrescription = new Prescription({
      prescriptionId,
      appointmentId,
      doctorId,
      doctorName,
      patientName,
      patientAge,
      patientGender,
      patientContact,
      department,
      visitType,
      consultationDate,
      chiefComplaint,
      symptoms,
      diagnosisPrimary,
      diagnosisNotes,
      exercises,
      dietAdvice,
      additionalNotes,
      labTests,
      medicines,
      vitals,
      status: status || 'Draft'
    });

    await newPrescription.save();

    res.status(201).json({ success: true, message: `Prescription ${status === 'Draft' ? 'saved as draft' : 'generated'} successfully`, data: newPrescription });
  } catch (error) {
    console.error('Error in createPrescription:', error);
    res.status(500).json({ success: false, message: 'Failed to save prescription', error: error.message });
  }
};

// GET /api/prescriptions/my-prescriptions
export const getDoctorPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (error) {
    console.error('Error in getDoctorPrescriptions:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// PUT /api/prescriptions/:id/status
export const updatePrescriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const prescription = await Prescription.findOneAndUpdate(
      { _id: id, doctorId: req.user._id },
      { status },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    res.status(200).json({ success: true, message: 'Status updated', data: prescription });
  } catch (error) {
    console.error('Error in updatePrescriptionStatus:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// DELETE /api/prescriptions/:id
export const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findOneAndDelete({ _id: id, doctorId: req.user._id });
    
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    res.status(200).json({ success: true, message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Error in deletePrescription:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
