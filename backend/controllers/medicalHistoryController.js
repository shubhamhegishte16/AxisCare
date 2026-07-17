import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Bill from '../models/PharmacyPanel/Bill.js';
import User from '../models/user.js';

// Get patient's medical dashboard with vitals
export const getMedicalDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get patient from PharmacyPanel
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found in pharmacy system. Please complete your profile.',
      });
    }

    // Get user details
    const user = await User.findById(userId);
    
    // Search prescriptions by patientName (from PharmacyPanel) OR by userId
    const prescriptions = await Prescription.find({ 
      $or: [
        { patientName: patient.fullName },
        { patientName: user?.fullName }
      ]
    }).sort({ createdAt: -1 });

    // Get appointments from PharmacyPanel
    const appointments = await Appointment.find({ patientId: patient._id })
      .sort({ date: -1 });

    // Get bills
    const bills = await Bill.find({ patientName: patient.fullName })
      .sort({ createdAt: -1 });

    const latestPrescription = prescriptions.length > 0 ? prescriptions[0] : null;
    const vitals = {
      heartRate: latestPrescription?.vitals?.pulseRate || '70 bpm',
      cholesterol: '180 mg/dL',
      haemoglobin: '14 g/dL',
      bloodPressure: latestPrescription?.vitals?.bloodPressure || '120/80 mm Hg',
      glucose: latestPrescription?.vitals?.bloodSugar || '110 mg/dL',
      whiteBlood: '6,000/mm3',
      bmi: '175 lbs',
      respiratory: '16 b/m',
      plateletCount: '250,000/mm3',
    };

    const totalPrescriptions = await Prescription.countDocuments({ 
      $or: [
        { patientName: patient.fullName },
        { patientName: user?.fullName }
      ]
    });
    const totalAppointments = await Appointment.countDocuments({ patientId: patient._id });
    const totalBills = await Bill.countDocuments({ patientName: patient.fullName });
    
    let pendingLabTests = 0;
    prescriptions.forEach(p => {
      if (p.labAppointments && p.labAppointments.length > 0) {
        pendingLabTests += p.labAppointments.filter(l => l.status === 'Pending' || l.status === 'Scheduled').length;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        vitals,
        patient: {
          name: patient.fullName || patient.name,
          age: patient.age,
          gender: patient.gender,
          lastCheckup: latestPrescription?.consultationDate || null,
        },
        stats: {
          totalPrescriptions,
          totalAppointments,
          totalBills,
          pendingLabTests,
        }
      }
    });
  } catch (error) {
    console.error('Error in getMedicalDashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get all visits (appointments)
export const getVisits = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 50, page = 1 } = req.query;

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const appointments = await Appointment.find({ patientId: patient._id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments({ patientId: patient._id });

    // Get prescriptions for these appointments
    const appointmentIds = appointments.map(a => a._id);
    const prescriptions = await Prescription.find({ 
      appointmentId: { $in: appointmentIds } 
    });

    const formattedVisits = appointments.map(visit => {
      const prescription = prescriptions.find(p => 
        p.appointmentId && p.appointmentId.toString() === visit._id.toString()
      );
      
      return {
        _id: visit._id,
        visitId: visit.appointmentId || `#MH-${String(visit._id).slice(-4)}`,
        date: visit.date ? new Date(visit.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }) : 'N/A',
        department: visit.department || 'General',
        doctor: visit.doctorName || 'N/A',
        reason: prescription?.chiefComplaint || visit.reason || 'N/A',
        status: visit.status || 'Completed',
        prescriptionId: prescription?._id || null,
        prescriptionNumber: prescription?.prescriptionId || null,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedVisits.length,
      total,
      data: formattedVisits,
    });
  } catch (error) {
    console.error('Error in getVisits:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get visit details with prescription
export const getVisitDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const visit = await Appointment.findOne({ _id: id, patientId: patient._id });
    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit not found',
      });
    }

    const prescription = await Prescription.findOne({ 
      appointmentId: visit._id 
    });

    res.status(200).json({
      success: true,
      data: {
        visit,
        prescription,
      },
    });
  } catch (error) {
    console.error('Error in getVisitDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get consultations (prescriptions) - FIXED
export const getConsultations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 50, page = 1 } = req.query;

    // Get patient from PharmacyPanel
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    // Get user details for fullName fallback
    const user = await User.findById(userId);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Search by patientName (from PharmacyPanel) OR by userId reference
    let prescriptions = await Prescription.find({ 
      $or: [
        { patientName: patient.fullName },
        { patientName: user?.fullName }
      ]
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // If no prescriptions found by name, try to find by appointmentId linking to patient
    if (prescriptions.length === 0) {
      // Get all appointments for this patient
      const appointments = await Appointment.find({ patientId: patient._id });
      const appointmentIds = appointments.map(a => a._id);
      
      prescriptions = await Prescription.find({ 
        appointmentId: { $in: appointmentIds } 
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    }

    const total = await Prescription.countDocuments({ 
      $or: [
        { patientName: patient.fullName },
        { patientName: user?.fullName }
      ]
    });

    // Format consultation data
    const formattedConsultations = prescriptions.map(p => ({
      _id: p._id,
      prescriptionId: p.prescriptionId || 'N/A',
      doctor: p.doctorName || 'N/A',
      doctorName: p.doctorName || 'N/A',
      visitDate: p.consultationDate || new Date(p.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      consultationDate: p.consultationDate || new Date(p.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      symptoms: p.symptoms || 'N/A',
      diagnosis: p.diagnosisPrimary || p.diagnosisNotes || 'N/A',
      diagnosisPrimary: p.diagnosisPrimary || '',
      diagnosisNotes: p.diagnosisNotes || '',
      department: p.department || 'General',
      followUp: p.followUpDate ? new Date(p.followUpDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }) : 'N/A',
      prescriptionIdRef: p._id,
      medications: p.medicines || [],
      labAppointments: p.labAppointments || [],
      labTests: p.labTests || '',
      pharmacyStatus: p.pharmacyStatus || 'Pending',
      status: p.status || 'Generated',
      patientName: p.patientName || patient.fullName,
      patientAge: p.patientAge || patient.age || 'N/A',
      patientGender: p.patientGender || patient.gender || 'N/A',
      patientContact: p.patientContact || patient.phone || 'N/A',
      vitals: p.vitals || {},
      chiefComplaint: p.chiefComplaint || '',
      exercises: p.exercises || '',
      dietAdvice: p.dietAdvice || '',
      additionalNotes: p.additionalNotes || '',
      createdAt: p.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formattedConsultations.length,
      total,
      data: formattedConsultations,
    });
  } catch (error) {
    console.error('Error in getConsultations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get consultation details - FIXED
export const getConsultationDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const user = await User.findById(userId);

    // Try multiple ways to find the prescription
    let prescription = await Prescription.findOne({ 
      _id: id,
      $or: [
        { patientName: patient.fullName },
        { patientName: user?.fullName }
      ]
    });

    // If not found, try by prescriptionId field
    if (!prescription) {
      prescription = await Prescription.findOne({ 
        prescriptionId: id,
        $or: [
          { patientName: patient.fullName },
          { patientName: user?.fullName }
        ]
      });
    }

    // If still not found, try by appointmentId
    if (!prescription) {
      const appointments = await Appointment.find({ patientId: patient._id });
      const appointmentIds = appointments.map(a => a._id);
      
      prescription = await Prescription.findOne({ 
        _id: id,
        appointmentId: { $in: appointmentIds }
      });
    }

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found',
      });
    }

    res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    console.error('Error in getConsultationDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get lab tests
export const getLabTests = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 50, page = 1 } = req.query;

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const user = await User.findById(userId);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const prescriptions = await Prescription.find({ 
      $or: [
        { patientName: patient.fullName },
        { patientName: user?.fullName }
      ],
      'labAppointments.0': { $exists: true }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Prescription.countDocuments({ 
      $or: [
        { patientName: patient.fullName },
        { patientName: user?.fullName }
      ],
      'labAppointments.0': { $exists: true }
    });

    const labTests = [];
    prescriptions.forEach(p => {
      p.labAppointments.forEach((lab, index) => {
        labTests.push({
          _id: lab._id || `${p._id}-${index}`,
          patientId: p.prescriptionId || `#MH-${String(p._id).slice(-4)}`,
          testName: lab.testName || 'N/A',
          category: lab.category || 'General',
          requestedBy: p.doctorName || 'N/A',
          status: lab.status || 'Pending',
          date: lab.scheduledDate ? new Date(lab.scheduledDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }) : p.consultationDate || 'N/A',
          prescriptionId: p._id,
          labAppointmentId: lab._id,
          results: lab.results || '',
          reportUrl: lab.reportUrl || '',
        });
      });
    });

    res.status(200).json({
      success: true,
      count: labTests.length,
      total,
      data: labTests,
    });
  } catch (error) {
    console.error('Error in getLabTests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get lab test details
export const getLabTestDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const user = await User.findById(userId);

    const prescription = await Prescription.findOne({
      $or: [
        { patientName: patient.fullName },
        { patientName: user?.fullName }
      ],
      'labAppointments._id': id
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found',
      });
    }

    const labTest = prescription.labAppointments.id(id);

    res.status(200).json({
      success: true,
      data: {
        labTest,
        prescriptionId: prescription._id,
        prescriptionNumber: prescription.prescriptionId,
        doctorName: prescription.doctorName,
      },
    });
  } catch (error) {
    console.error('Error in getLabTestDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get medications with bill status
export const getMedications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 50, page = 1 } = req.query;

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const user = await User.findById(userId);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const prescriptions = await Prescription.find({ 
      $or: [
        { patientName: patient.fullName },
        { patientName: user?.fullName }
      ],
      'medicines.0': { $exists: true }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Prescription.countDocuments({ 
      $or: [
        { patientName: patient.fullName },
        { patientName: user?.fullName }
      ],
      'medicines.0': { $exists: true }
    });

    const bills = await Bill.find({ patientName: patient.fullName });

    const medications = [];
    prescriptions.forEach(p => {
      p.medicines.forEach((med, index) => {
        const bill = bills.find(b => 
          b.prescription && b.prescription.toString() === p._id.toString()
        );
        
        let isPurchased = false;
        let billId = null;
        if (bill) {
          const billItem = bill.items.find(item => 
            item.name.toLowerCase() === med.name.toLowerCase()
          );
          if (billItem) {
            isPurchased = bill.status === 'Paid';
            billId = bill._id;
          }
        }

        medications.push({
          _id: med._id || `${p._id}-${index}`,
          patientId: p.prescriptionId || `#MH-${String(p._id).slice(-4)}`,
          medicine: med.name || 'N/A',
          dosage: med.dosage || 'N/A',
          frequency: med.frequency || 'N/A',
          duration: med.duration || 'N/A',
          status: isPurchased ? 'Purchased' : 'Not Purchased',
          billId: billId,
          billStatus: bill?.status || 'No Bill',
          purchaseDate: bill?.createdAt || p.dispensedAt || null,
          prescriptionId: p._id,
          prescriptionNumber: p.prescriptionId,
          doctorName: p.doctorName,
          quantity: med.quantity || 1,
          instructions: med.instructions || '',
        });
      });
    });

    res.status(200).json({
      success: true,
      count: medications.length,
      total,
      data: medications,
    });
  } catch (error) {
    console.error('Error in getMedications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get medication bill details
export const getMedicationBill = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const bill = await Bill.findOne({ 
      patientName: patient.fullName,
      'items._id': id 
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found for this medication',
      });
    }

    const medication = bill.items.id(id);

    res.status(200).json({
      success: true,
      data: {
        bill: {
          _id: bill._id,
          billId: bill.billId,
          patientName: bill.patientName,
          amount: bill.amount,
          status: bill.status,
          createdAt: bill.createdAt,
        },
        medication,
      },
    });
  } catch (error) {
    console.error('Error in getMedicationBill:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get patient vitals
export const getPatientVitals = async (req, res) => {
  try {
    const userId = req.user._id;

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const user = await User.findById(userId);

    const prescription = await Prescription.findOne({ 
      $or: [
        { patientName: patient.fullName },
        { patientName: user?.fullName }
      ],
      'vitals': { $exists: true, $ne: {} }
    }).sort({ createdAt: -1 });

    const vitals = {
      heartRate: prescription?.vitals?.pulseRate || '70 bpm',
      cholesterol: '180 mg/dL',
      haemoglobin: '14 g/dL',
      bloodPressure: prescription?.vitals?.bloodPressure || '120/80 mm Hg',
      glucose: prescription?.vitals?.bloodSugar || '110 mg/dL',
      whiteBlood: '6,000/mm3',
      bmi: '175 lbs',
      respiratory: '16 b/m',
      plateletCount: '250,000/mm3',
    };

    res.status(200).json({
      success: true,
      data: vitals,
    });
  } catch (error) {
    console.error('Error in getPatientVitals:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};