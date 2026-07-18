import Bill from '../models/PharmacyPanel/Bill.js';
import Order from '../models/PharmacyPanel/Order.js';
import Patient from '../models/Patient.js';
import User from '../models/user.js';
import { triggerNotification } from '../utils/triggerNotification.js';

// Get patient bills
export const getPatientBills = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, status, limit = 50, page = 1 } = req.query;

    const query = { userId };
    
    // Filter by status
    if (status === 'Unpaid') {
      query.paymentStatus = { $ne: 'Paid' };
    } else if (status === 'Paid') {
      query.paymentStatus = 'Paid';
    }

    // Get patient info
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get bills
    const bills = await Bill.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('orderId', 'orderId prescriptionId doctorName');

    const total = await Bill.countDocuments(query);

    // Format bills for frontend
    const formattedBills = bills.map(bill => ({
      _id: bill._id,
      billId: bill.billId,
      invoiceId: bill.billId,
      date: new Date(bill.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      category: bill.category || getBillCategory(bill),
      department: bill.department || getBillDepartment(bill),
      amount: `Rs. ${bill.totalAmount.toFixed(2)}`,
      amountRaw: bill.totalAmount,
      status: bill.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid',
      orderId: bill.orderId,
      prescriptionId: bill.orderId?.prescriptionId,
      doctorName: bill.orderId?.doctorName,
      items: bill.items,
    }));

    res.status(200).json({
      success: true,
      count: formattedBills.length,
      total,
      data: formattedBills,
    });
  } catch (error) {
    console.error('Error in getPatientBills:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get bill stats
export const getBillStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const bills = await Bill.find({ userId });

    const totalMedicalExpenses = bills.reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingPayments = bills
      .filter(b => b.paymentStatus !== 'Paid')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    const paidBills = bills.filter(b => b.paymentStatus === 'Paid').length;
    
    // Get insurance covered (you can calculate this from your data)
    const insuranceCovered = totalMedicalExpenses * 0.3; // Example calculation

    res.status(200).json({
      success: true,
      data: {
        totalMedicalExpenses,
        pendingPayments,
        paidBills,
        insuranceCovered,
      }
    });
  } catch (error) {
    console.error('Error in getBillStats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get bill details
export const getBillDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const bill = await Bill.findOne({ _id: id, userId })
      .populate('orderId', 'orderId prescriptionId doctorName items');

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    console.error('Error in getBillDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Pay a bill
export const payBill = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { paymentMethod } = req.body;

    const bill = await Bill.findOne({ _id: id, userId });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found',
      });
    }

    if (bill.paymentStatus === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Bill is already paid',
      });
    }

    bill.paymentStatus = 'Paid';
    bill.paymentMethod = paymentMethod || 'Cash';
    bill.paymentDate = new Date();
    await bill.save();

    // Update the associated order
    if (bill.orderId) {
      await Order.findByIdAndUpdate(bill.orderId, {
        paymentStatus: 'Paid',
        paymentMethod: paymentMethod || 'Cash',
        paymentDate: new Date(),
        status: 'Completed',
      });
    }

    // Trigger notification
    await triggerNotification(
      userId,
      'Billing',
      'Payment Successful',
      `Your payment of ${bill.totalAmount.toFixed(2)} for bill ${bill.billId} has been successfully processed.`,
      'View Bill',
      '/patient-bills',
      'high'
    );

    res.status(200).json({
      success: true,
      message: 'Bill paid successfully',
      data: bill,
    });
  } catch (error) {
    console.error('Error in payBill:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Helper functions
function getBillCategory(bill) {
  // Determine category from bill items or order
  if (bill.items && bill.items.length > 0) {
    const firstItem = bill.items[0];
    // Check if it's from pharmacy
    if (firstItem.medicineName) {
      return 'Medicines';
    }
  }
  if (bill.orderId?.doctorName) {
    return 'Consultation';
  }
  return 'Other';
}

function getBillDepartment(bill) {
  if (bill.items && bill.items.length > 0) {
    const firstItem = bill.items[0];
    if (firstItem.medicineName) {
      return 'Pharmacy';
    }
  }
  if (bill.orderId?.doctorName) {
    return 'Cardiology'; // Default department
  }
  return 'Other';
}