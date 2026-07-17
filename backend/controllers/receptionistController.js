import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import WalkInQueue from '../models/WalkInQueue.js';
import Invoice from '../models/Invoice.js';

const pad2 = (n) => String(n).padStart(2, '0');
const todayStr = () => {
  const now = new Date();
  return `${pad2(now.getMonth() + 1)}/${pad2(now.getDate())}/${now.getFullYear()}`;
};
const nowTimeStr = () =>
  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const generatePatientIdentifiers = () => {
  const patientPassNo = String(Math.floor(1000 + Math.random() * 9000));
  const patientId = `#PT-${Math.floor(100000 + Math.random() * 900000)}`;
  return { patientPassNo, patientId };
};

const generateQueueNumber = () => `Q-${Math.floor(100 + Math.random() * 900)}`;
const generateInvoiceId = () => `INV-${Math.floor(1000 + Math.random() * 9000)}`;

/* ---------------------------------------------------------
 * PATIENT REGISTRATION (front-desk creates a new patient)
 * POST /api/receptionist/register-patient
 * --------------------------------------------------------- */
export const registerPatient = async (req, res) => {
  try {
    const {
      fullName, phone, email, age, gender, bloodGroup, address,
      department, doctor, appointmentType, symptoms,
    } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({ success: false, message: 'Full name and phone number are required.' });
    }

    // Receptionist-created patients may not have an email — generate a
    // placeholder one if missing so the User/Patient schemas are satisfied.
    const safeEmail = email && email.trim()
      ? email.trim().toLowerCase()
      : `walkin.${Date.now()}@axiscare.local`;

    const existingUser = await User.findOne({ $or: [{ email: safeEmail }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'A patient with this phone or email already exists.' });
    }

    // Auto-generate a temporary password for the front-desk-created account.
    const tempPassword = crypto.randomBytes(4).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    const user = await User.create({
      fullName,
      email: safeEmail,
      phone,
      password: hashedPassword,
      role: 'patient',
    });

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || fullName;
    const lastName = nameParts.slice(1).join(' ') || '';
    const { patientPassNo, patientId } = generatePatientIdentifiers();

    const patient = await Patient.create({
      userId: user._id,
      firstName,
      lastName,
      dateOfBirth: '01/01/1970',
      gender: gender || 'Prefer not to say',
      address: address || 'Not provided',
      phoneNumber: phone,
      email: safeEmail,
      patientPassNo,
      patientId,
      dateOfRegistration: todayStr(),
      bloodType: bloodGroup || 'Unknown',
      emergencyContacts: [
        { name: 'Emergency Contact', relationship: 'Not specified', phone1: 'Not provided', isPrimary: true },
      ],
    });

    // If this is a walk-in / emergency visit, drop them straight into the queue.
    let queueEntry = null;
    if (appointmentType === 'Walk-in' || appointmentType === 'Emergency') {
      queueEntry = await WalkInQueue.create({
        queueNumber: generateQueueNumber(),
        patientName: fullName,
        phoneNumber: phone,
        department: department || '',
        priority: appointmentType === 'Emergency' ? 'Emergency' : 'Normal',
        arrivalTime: nowTimeStr(),
        registeredBy: req.user._id,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully.',
      data: {
        patient,
        patientId: patient.patientId,
        tempPassword, // shown once to the receptionist to hand to the patient
        queueEntry,
        symptoms: symptoms || '',
        doctor: doctor || '',
        department: department || '',
      },
    });
  } catch (error) {
    console.error('Error in registerPatient:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/* ---------------------------------------------------------
 * WALK-IN QUEUE
 * --------------------------------------------------------- */

// GET /api/receptionist/walk-in-queue — today's active queue
export const getQueue = async (req, res) => {
  try {
    const queue = await WalkInQueue.find().sort({ createdAt: 1 });
    res.status(200).json({ success: true, count: queue.length, data: queue });
  } catch (error) {
    console.error('Error in getQueue:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// POST /api/receptionist/walk-in-queue — add a walk-in directly to the queue
export const addToQueue = async (req, res) => {
  try {
    const { patientName, phoneNumber, department, priority } = req.body;
    if (!patientName) {
      return res.status(400).json({ success: false, message: 'Patient name is required.' });
    }
    const entry = await WalkInQueue.create({
      queueNumber: generateQueueNumber(),
      patientName,
      phoneNumber: phoneNumber || '',
      department: department || '',
      priority: priority === 'Emergency' ? 'Emergency' : 'Normal',
      arrivalTime: nowTimeStr(),
      registeredBy: req.user._id,
    });
    res.status(201).json({ success: true, message: 'Added to queue.', data: entry });
  } catch (error) {
    console.error('Error in addToQueue:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// PUT /api/receptionist/walk-in-queue/:id/status — Call Next (Serving) / Complete
export const updateQueueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Waiting', 'Serving', 'Completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    const entry = await WalkInQueue.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!entry) return res.status(404).json({ success: false, message: 'Queue entry not found.' });
    res.status(200).json({ success: true, message: 'Queue status updated.', data: entry });
  } catch (error) {
    console.error('Error in updateQueueStatus:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/* ---------------------------------------------------------
 * BILLING
 * --------------------------------------------------------- */

// GET /api/receptionist/billing
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    console.error('Error in getInvoices:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// POST /api/receptionist/billing
export const createInvoice = async (req, res) => {
  try {
    const { patientName, patientId, department, amount, method, status } = req.body;
    if (!patientName || amount === undefined || amount === null) {
      return res.status(400).json({ success: false, message: 'Patient name and amount are required.' });
    }
    const invoice = await Invoice.create({
      invoiceId: generateInvoiceId(),
      patientName,
      patientId: patientId || null,
      department: department || '',
      amount,
      method: method || 'Not Paid',
      status: status || 'Pending',
      issuedBy: req.user._id,
    });
    res.status(201).json({ success: true, message: 'Invoice created.', data: invoice });
  } catch (error) {
    console.error('Error in createInvoice:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// PUT /api/receptionist/billing/:id/status
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { status, method } = req.body;
    const allowed = ['Paid', 'Pending', 'Overdue'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    const update = {};
    if (status) update.status = status;
    if (method) update.method = method;
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });
    res.status(200).json({ success: true, message: 'Invoice updated.', data: invoice });
  } catch (error) {
    console.error('Error in updateInvoiceStatus:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/* ---------------------------------------------------------
 * REPORTS — aggregated summary for the receptionist Reports page
 * GET /api/receptionist/reports/summary
 * --------------------------------------------------------- */
export const getReportsSummary = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [totalAppointments, totalPatients, invoices] = await Promise.all([
      Appointment.countDocuments(),
      Patient.countDocuments(),
      Invoice.find(),
    ]);

    const revenueCollected = invoices
      .filter((i) => i.status === 'Paid')
      .reduce((sum, i) => sum + (i.amount || 0), 0);
    const revenuePending = invoices
      .filter((i) => i.status !== 'Paid')
      .reduce((sum, i) => sum + (i.amount || 0), 0);

    // Registrations grouped by month (last 6 months)
    const patientsByMonth = await Patient.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Appointments grouped by month (last 6 months)
    const appointmentsByMonth = await Appointment.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Revenue grouped by department
    const revenueByDept = await Invoice.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: '$department', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        totalPatients,
        revenueCollected,
        revenuePending,
        patientsByMonth,
        appointmentsByMonth,
        revenueByDept,
      },
    });
  } catch (error) {
    console.error('Error in getReportsSummary:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
