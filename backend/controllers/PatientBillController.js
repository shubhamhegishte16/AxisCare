import Bill from '../models/PharmacyPanel/Bill.js';
import Order from '../models/PharmacyPanel/Order.js';
import Patient from '../models/Patient.js';
import User from '../models/user.js';
import { triggerNotification } from '../utils/triggerNotification.js';

// Get patient bills (orders displayed as bills)
export const getPatientBills = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, status, limit = 50, page = 1 } = req.query;

    // console.log('Fetching orders for user:', userId);

    let query = { userId };

    if (status === 'Unpaid') {
      query.paymentStatus = 'Unpaid';
    } else if (status === 'Paid') {
      query.paymentStatus = 'Paid';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('prescriptionId', 'prescriptionId doctorName');

    const total = await Order.countDocuments(query);

    // console.log('Found orders:', orders.length);
    if (orders.length > 0) {
      // console.log('Sample order:', {
      //   id: orders[0]._id,
      //   totalAmount: orders[0].totalAmount,
      //   total: orders[0].total,
      //   amount: orders[0].amount,
      //   paymentStatus: orders[0].paymentStatus
      // });
    }

    // Format orders as bills
    const formattedBills = orders.map(order => {
      let totalAmount = order.totalAmount || order.total || order.amount || order.orderTotal || 0;
      totalAmount = parseFloat(totalAmount) || 0;

      return {
        _id: order._id,
        billId: order.orderId || `ORD-${order._id.toString().slice(-6)}`,
        invoiceId: order.orderId || `ORD-${order._id.toString().slice(-6)}`,
        date: new Date(order.createdAt).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        category: 'Medicines',
        department: 'Pharmacy',
        amount: `Rs. ${totalAmount.toFixed(2)}`,
        amountRaw: totalAmount,
        status: order.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid',
        orderId: order._id,
        items: order.items || [],
        createdAt: order.createdAt,
        paymentStatus: order.paymentStatus,
        totalAmount: totalAmount,
        patientName: order.patientName,
        doctorName: order.doctorName,
        prescriptionId: order.prescriptionId
      };
    });

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

// Get bill stats from orders
export const getBillStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId });

    const totalMedicalExpenses = orders.reduce((sum, o) => {
      let amount = o.totalAmount || o.total || o.amount || o.orderTotal || 0;
      return sum + (parseFloat(amount) || 0);
    }, 0);

    const pendingPayments = orders
      .filter(o => o.paymentStatus !== 'Paid')
      .reduce((sum, o) => {
        let amount = o.totalAmount || o.total || o.amount || o.orderTotal || 0;
        return sum + (parseFloat(amount) || 0);
      }, 0);

    const paidBills = orders.filter(o => o.paymentStatus === 'Paid').length;
    const insuranceCovered = totalMedicalExpenses * 0.3;

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

// Pay a bill (update order payment status) with notification
export const payBill = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { paymentMethod } = req.body;

    // console.log('Processing payment for order:', id);

    const order = await Order.findOne({ _id: id, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid',
      });
    }

    // Calculate total amount for notification
    let totalAmount = order.totalAmount || order.total || 0;
    if (totalAmount === 0 && order.items) {
      totalAmount = order.items.reduce((sum, item) => {
        return sum + ((item.price || 0) * (item.quantity || 0));
      }, 0);
    }

    // Update order
    order.paymentStatus = 'Paid';
    order.paymentMethod = paymentMethod || 'Cash';
    order.paymentDate = new Date();
    order.status = 'Completed';
    await order.save();

    // Trigger notification for payment success
    try {
      await triggerNotification(
        userId,
        'Payment',
        'Payment Successful',
        `Your payment of Rs. ${totalAmount.toFixed(2)} for order ${order.orderId || order._id} has been successfully processed.`,
        'View Bill',
        '/patient-bills',
        'high'
      );
      // console.log('Payment notification sent successfully');
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: order,
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

// Download bill as HTML
export const downloadBill = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    // console.log('Downloading bill for order:', id);

    const order = await Order.findOne({ _id: id, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Calculate total
    let totalAmount = order.totalAmount || order.total || 0;
    if (totalAmount === 0 && order.items) {
      totalAmount = order.items.reduce((sum, item) => {
        return sum + ((item.price || 0) * (item.quantity || 0));
      }, 0);
    }

    // HTML Bill
    const billHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Bill - ${order.orderId || order._id}</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #0f4c81;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo { font-size: 28px; font-weight: bold; color: #0f4c81; }
    .subtitle { color: #666; font-size: 14px; }
    .bill-title { font-size: 20px; font-weight: bold; text-align: center; margin: 20px 0; }
    .info-box {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      display: flex;
      justify-content: space-between;
    }
    .info-box div { line-height: 1.8; }
    .label { font-weight: 600; color: #555; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #0f4c81; color: white; padding: 10px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #eee; }
    .total-box {
      text-align: right;
      padding: 20px;
      background: #f0f5fa;
      border-radius: 8px;
      margin-top: 20px;
    }
    .total-amount { font-size: 24px; font-weight: bold; color: #0f4c81; }
    .status-paid { color: #2e7d32; font-weight: bold; }
    .status-unpaid { color: #d32f2f; font-weight: bold; }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #888;
      font-size: 12px;
    }
    .print-btn {
      background: #0f4c81;
      color: white;
      border: none;
      padding: 10px 30px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      margin-top: 20px;
    }
    .print-btn:hover { background: #0a3a63; }
    @media print {
      .no-print { display: none; }
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">AxisCare</div>
    <div class="subtitle">Multi-Specialty Hospital</div>
  </div>
  
  <div class="bill-title">Medicine Purchase Bill</div>
  
  <div class="info-box">
    <div>
      <div><span class="label">Order ID:</span> ${order.orderId || order._id}</div>
      <div><span class="label">Patient:</span> ${order.patientName || 'N/A'}</div>
      <div><span class="label">Doctor:</span> ${order.doctorName || 'N/A'}</div>
    </div>
    <div style="text-align: right;">
      <div><span class="label">Date:</span> ${new Date(order.createdAt).toLocaleDateString()}</div>
      <div><span class="label">Status:</span> <span class="${order.paymentStatus === 'Paid' ? 'status-paid' : 'status-unpaid'}">${order.paymentStatus || 'Unpaid'}</span></div>
      ${order.paymentMethod ? `<div><span class="label">Payment:</span> ${order.paymentMethod.toUpperCase()}</div>` : ''}
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Medicine</th>
        <th style="text-align:center;">Quantity</th>
        <th style="text-align:right;">Price (Rs.)</th>
        <th style="text-align:right;">Total (Rs.)</th>
      </tr>
    </thead>
    <tbody>
      ${order.items && order.items.length > 0 ? order.items.map(item => `
        <tr>
          <td>${item.medicineName || item.name || 'N/A'}</td>
          <td style="text-align:center;">${item.quantity}</td>
          <td style="text-align:right;">Rs. ${(item.price || 0).toFixed(2)}</td>
          <td style="text-align:right;">Rs. ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
        </tr>
      `).join('') : `
        <tr><td colspan="4" style="text-align:center;color:#888;">No items found</td></tr>
      `}
    </tbody>
  </table>
  
  <div class="total-box">
    <div style="font-size:16px;color:#555;">Total Amount</div>
    <div class="total-amount">Rs. ${totalAmount.toFixed(2)}</div>
  </div>
  
  <div class="footer">
    <p>Thank you for choosing AxisCare. Stay Healthy!</p>
  </div>
  
  <div style="text-align:center;margin-top:20px;" class="no-print">
    <button onclick="window.print()" class="print-btn">Print Bill</button>
    <button onclick="window.close()" class="print-btn" style="background:#666;margin-left:10px;">Close</button>
  </div>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename=Bill-${order.orderId || order._id}.html`);
    res.send(billHTML);

  } catch (error) {
    console.error('Error in downloadBill:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get bill details (accepts both bill ID and order ID)
export const getBillDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    // console.log('Looking for order/bill with ID:', id);

    // First try to find as order
    let order = await Order.findOne({
      _id: id,
      userId
    }).populate('prescriptionId', 'prescriptionId doctorName');

    // If not found as order, try to find as bill
    if (!order) {
      const bill = await Bill.findOne({
        _id: id,
        userId
      }).populate('orderId', 'orderId prescriptionId doctorName');

      if (bill) {
        if (bill.orderId) {
          order = await Order.findOne({
            _id: bill.orderId,
            userId
          }).populate('prescriptionId', 'prescriptionId doctorName');
        }

        if (!order) {
          return res.status(200).json({
            success: true,
            data: {
              _id: bill._id,
              billId: bill.billId,
              items: bill.items || [],
              totalAmount: bill.totalAmount || 0,
              paymentStatus: bill.paymentStatus || 'Unpaid',
              createdAt: bill.createdAt,
              category: bill.category || 'Medicines',
              department: bill.department || 'Pharmacy'
            }
          });
        }
      }
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Format as bill
    const bill = {
      _id: order._id,
      billId: order.orderId || `ORD-${order._id}`,
      orderId: order._id,
      items: order.items || [],
      totalAmount: order.totalAmount || 0,
      paymentStatus: order.paymentStatus || 'Unpaid',
      createdAt: order.createdAt,
      patientName: order.patientName,
      doctorName: order.doctorName,
      prescriptionId: order.prescriptionId,
      category: 'Medicines',
      department: 'Pharmacy'
    };

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

// Helper functions
function getBillCategory(bill) {
  if (bill.items && bill.items.length > 0) {
    const firstItem = bill.items[0];
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
    return 'Cardiology';
  }
  return 'Other';
}

// Create bill from order
export const createBillFromOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.body;

    // console.log('Creating bill from order:', orderId);

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if bill already exists
    const existingBill = await Bill.findOne({ orderId: order._id });
    if (existingBill) {
      return res.status(200).json({
        success: true,
        message: 'Bill already exists',
        data: existingBill
      });
    }

    const bill = new Bill({
      userId: userId,
      orderId: order._id,
      billId: `BILL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      items: order.items.map(item => ({
        medicineName: item.medicineName || item.name,
        quantity: item.quantity,
        price: item.price || 0,
        total: (item.price || 0) * item.quantity
      })),
      totalAmount: order.totalAmount || 0,
      paymentStatus: order.paymentStatus || 'Unpaid',
      category: 'Medicines',
      department: 'Pharmacy',
      createdAt: order.createdAt || new Date()
    });

    await bill.save();

    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: bill
    });

  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bill',
      error: error.message
    });
  }
};