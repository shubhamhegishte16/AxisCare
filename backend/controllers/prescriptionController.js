import Prescription from '../models/Prescription.js';
import { notifyPharmacists } from '../utils/pharmacyNotify.js';

const generatePrescriptionId = async () => {
  const currentYear = new Date().getFullYear();
  const latest = await Prescription.findOne({
    prescriptionId: { $regex: `^RX-${currentYear}-` },
  }).sort({ createdAt: -1 }).select('prescriptionId');

  const latestNumber = latest?.prescriptionId
    ? parseInt(latest.prescriptionId.split('-').pop(), 10)
    : 1000;

  let nextNumber = Number.isFinite(latestNumber) ? latestNumber + 1 : 1001;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const prescriptionId = `RX-${currentYear}-${nextNumber + attempt}`;
    const exists = await Prescription.exists({ prescriptionId });
    if (!exists) return prescriptionId;
  }

  return `RX-${currentYear}-${Date.now()}`;
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

    if (!appointmentId || !patientName) {
      return res.status(400).json({
        success: false,
        message: 'Please select a completed appointment before creating a prescription.',
      });
    }

    const sanitizedMedicines = Array.isArray(medicines)
      ? medicines
          .filter((medicine) => medicine?.name?.trim())
          .map((medicine) => ({
            name: medicine.name.trim(),
            dosage: medicine.dosage?.trim() || 'As directed',
            frequency: medicine.frequency?.trim() || 'As directed',
            duration: medicine.duration?.trim() || 'As directed',
            instructions: medicine.instructions?.trim() || '',
          }))
      : [];

    const prescriptionId = await generatePrescriptionId();

    const newPrescription = new Prescription({
      prescriptionId,
      appointmentId,
      doctorId,
      doctorName,
      patientName,
      patientAge: patientAge || 'Not provided',
      patientGender: patientGender || 'Prefer not to say',
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
      medicines: sanitizedMedicines,
      vitals,
      status: status || 'Draft'
    });

    await newPrescription.save();

    res.status(201).json({ success: true, message: `Prescription ${status === 'Draft' ? 'saved as draft' : 'generated'} successfully`, data: newPrescription });

    if (newPrescription.status === 'Generated') {
      notifyPharmacists(
        'New Prescription',
        `New prescription ${prescriptionId} for ${patientName} from Dr. ${doctorName} is ready for fulfillment.`
      );
    }
  } catch (error) {
    console.error('Error in createPrescription:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map((err) => err.message).join(', '),
        error: error.message,
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Prescription ID conflict. Please try generating again.',
        error: error.message,
      });
    }
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
