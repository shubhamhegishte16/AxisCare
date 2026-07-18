import PurchaseOrder from "../../models/PharmacyPanel/PurchaseOrder.js";
import Supplier from "../../models/PharmacyPanel/Supplier.js";
import Medicine from "../../models/PharmacyPanel/Medicine.js";
import Notification from "../../models/PharmacyPanel/Notification.js";
import Order from '../../models/PharmacyPanel/Order.js';
import Bill from '../../models/PharmacyPanel/Bill.js';

const generateOrderId = async () => {
  const last = await PurchaseOrder.findOne().sort({ createdAt: -1 }).select("orderId");
  const lastNum = last ? parseInt(last.orderId.replace("PO-", ""), 10) : 3000;
  const nextNum = (Number.isFinite(lastNum) ? lastNum : 3000) + 1;
  return `PO-${nextNum}`;
};

const shapeOrder = (o) => ({
  id: o.orderId,
  _id: o._id,
  supplier: o.supplierName,
  supplierId: o.supplier,
  date: new Date(o.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
  amount: o.amount,
  status: o.status,
  items: o.items,
});

// @desc    Get all purchase orders (search + status filter)
// @route   GET /api/pharmacy/orders
export const getOrders = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { supplierName: { $regex: search, $options: "i" } },
        { orderId: { $regex: search, $options: "i" } },
      ];
    }
    if (status && status !== "All") {
      filter.status = status;
    }

    const orders = await PurchaseOrder.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders.map(shapeOrder) });
  } catch (error) {
    console.error("Error in getOrders:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get order stats
// @route   GET /api/pharmacy/orders/stats
export const getOrderStats = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find();
    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "Pending").length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
      totalValue: orders.reduce((sum, o) => sum + o.amount, 0),
    };
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Error in getOrderStats:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/pharmacy/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: shapeOrder(order) });
  } catch (error) {
    console.error("Error in getOrderById:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Place a new purchase order
// @route   POST /api/pharmacy/orders
export const createOrder = async (req, res) => {
  try {
    const { supplier, amount, items } = req.body;

    if (!supplier || amount === undefined) {
      return res.status(400).json({ success: false, message: "Supplier and amount are required" });
    }

    // supplier can be a supplier name (free text) or an existing Supplier _id
    let supplierDoc = await Supplier.findOne({ name: supplier });
    if (!supplierDoc && supplier.match(/^[0-9a-fA-F]{24}$/)) {
      supplierDoc = await Supplier.findById(supplier);
    }

    if (!supplierDoc) {
      return res.status(400).json({
        success: false,
        message: `Supplier "${supplier}" not found. Please add this supplier first or pick one from the list.`,
      });
    }

    let order;
    try {
      const orderId = await generateOrderId();
      order = await PurchaseOrder.create({
        orderId,
        supplier: supplierDoc._id,
        supplierName: supplierDoc.name,
        items: items || [],
        amount: Number(amount) || 0,
        status: "Pending",
        createdBy: req.user._id,
      });
    } catch (err) {
      // Extremely rare race: two orders generated the same ID at once — retry once.
      if (err.code === 11000 && err.keyPattern?.orderId) {
        const orderId = await generateOrderId();
        order = await PurchaseOrder.create({
          orderId,
          supplier: supplierDoc._id,
          supplierName: supplierDoc.name,
          items: items || [],
          amount: Number(amount) || 0,
          status: "Pending",
          createdBy: req.user._id,
        });
      } else {
        throw err;
      }
    }

    res.status(201).json({ success: true, message: "Purchase order placed successfully", data: shapeOrder(order) });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update order status (Delivered/Cancelled)
// @route   PUT /api/pharmacy/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const wasAlreadyDelivered = order.status === "Delivered";

    // When an order newly transitions to Delivered, add the ordered
    // quantities back into stock for each medicine on the order.
    if (status === "Delivered" && !wasAlreadyDelivered) {
      for (const item of order.items) {
        let medicine = null;

        if (item.medicine) {
          medicine = await Medicine.findById(item.medicine);
        }
        // Fallback: match by name if the item wasn't linked to a medicine record
        if (!medicine && item.name) {
          medicine = await Medicine.findOne({ name: item.name });
        }

        if (medicine) {
          medicine.stock += item.quantity;
          await medicine.save();
        }
      }
    }

    order.status = status;
    await order.save();

    if (status === "Delivered" && !wasAlreadyDelivered) {
      await Notification.create({
        user: req.user._id,
        type: "Purchase Delivered",
        text: `Order ${order.orderId} from ${order.supplierName} has been delivered and stock updated.`,
      });
    }

    res.status(200).json({ success: true, message: "Order status updated", data: shapeOrder(order) });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

<<<<<<< HEAD
// @desc    Get dashboard stats
// @route   GET /api/pharmacy/dashboard
export const getDashboard = async (req, res) => {
  try {
    // console.log("Fetching dashboard data...");

    const totalMedicines = await Medicine.countDocuments();
    const lowStockItems = await Medicine.countDocuments({ stock: { $lt: 10, $gt: 0 } });
    const outOfStock = await Medicine.countDocuments({ stock: 0 });
    const totalOrders = await PurchaseOrder.countDocuments();
    const pendingOrders = await PurchaseOrder.countDocuments({ status: "Pending" });
    const completedOrders = await PurchaseOrder.countDocuments({ status: "Delivered" });

    const deliveredOrders = await PurchaseOrder.find({ status: "Delivered" });
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.amount, 0);
    const totalSuppliers = await Supplier.countDocuments();

    const recentOrders = await PurchaseOrder.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("supplier", "name");

    const recentActivity = recentOrders.map((order) => ({
      type: "order",
      message: `Order ${order.orderId} from ${order.supplierName || "Unknown Supplier"}`,
      time: new Date(order.createdAt).toLocaleString(),
    }));

    const data = {
      totalMedicines,
      lowStockItems,
      outOfStock,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      totalSuppliers,
      recentActivity,
    };

    // console.log("Dashboard data:", data);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in getDashboard:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// PATIENT ORDER ROUTES

export const checkMedicineAvailability = async (req, res) => {
  try {
=======

// PATIENT ORDER ROUTES

export const checkMedicineAvailability = async (req, res) => {
  try {
>>>>>>> d9195c598e222a22f0a9e962f1e9b84df0a477a9
    // console.log('Checking medicine availability');
    // console.log('Request body:', req.body);
    
    const { medicines } = req.body;
    
    if (!medicines || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No medicines to check'
      });
    }

    const availabilityResults = [];

    for (const med of medicines) {
      const medicine = await Medicine.findOne({ 
        name: { $regex: new RegExp(`^${med.medicineName}$`, 'i') } 
      });

      if (medicine) {
        availabilityResults.push({
          medicineName: med.medicineName,
          requestedQuantity: med.quantity || 1,
          available: medicine.stock >= (med.quantity || 1),
          stock: medicine.stock,
          price: medicine.price || 0,
          medicineId: medicine._id,
          isAvailable: true
        });
      } else {
        availabilityResults.push({
          medicineName: med.medicineName,
          requestedQuantity: med.quantity || 1,
          available: false,
          stock: 0,
          price: 0,
          medicineId: null,
          isAvailable: false,
          message: 'Medicine not found in pharmacy'
        });
      }
    }

    const allAvailable = availabilityResults.every(r => r.isAvailable && r.available);
    const unavailableItems = availabilityResults.filter(r => !r.isAvailable || !r.available);

    res.status(200).json({
      success: true,
      data: {
        allAvailable,
        results: availabilityResults,
        unavailableItems: unavailableItems,
        totalItems: medicines.length,
        availableCount: availabilityResults.filter(r => r.isAvailable && r.available).length
      }
    });
  } catch (error) {
    console.error('Error in checkMedicineAvailability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check medicine availability',
      error: error.message
    });
  }
};

// Get patient orders
export const getPatientOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error in getPatientOrders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Create order from prescription (patient)
export const createOrderFromPrescription = async (req, res) => {
  try {
    // console.log('Patient creating order from prescription');
    // console.log('User ID:', req.user?._id);
    // console.log('Request body:', JSON.stringify(req.body, null, 2));

    const userId = req.user._id;
    const { prescriptionId, items, patientName, doctorName } = req.body;

    // Validate required fields
    if (!prescriptionId) {
      // console.log('Missing prescriptionId');
      return res.status(400).json({
        success: false,
        message: 'Prescription ID is required'
      });
    }

    if (!items || items.length === 0) {
      // console.log('No items provided');
      return res.status(400).json({
        success: false,
        message: 'At least one item is required'
      });
    }

    // console.log(`Processing ${items.length} items`);

    // Process each item
    const orderItems = [];
    let totalAmount = 0;
    let allAvailable = true;
    const unavailableItems = [];

    for (const item of items) {
      // console.log(`Checking medicine: ${item.name}`);
      
      // Find medicine by name (case insensitive)
      const medicine = await Medicine.findOne({ 
        name: { $regex: new RegExp(`^${item.name}$`, 'i') } 
      });

      if (!medicine) {
        console.log(`Medicine not found: ${item.name}`);
        allAvailable = false;
        unavailableItems.push({
          name: item.name,
          reason: 'Medicine not found in pharmacy'
        });
        continue;
      }

      // console.log(`Medicine found: ${medicine.name}, Stock: ${medicine.stock}, Price: ${medicine.price}`);

      if (medicine.stock < (item.quantity || 1)) {
        // console.log(`Insufficient stock for ${item.name}: Available ${medicine.stock}, Requested ${item.quantity}`);
        allAvailable = false;
        unavailableItems.push({
          name: item.name,
          reason: `Insufficient stock. Available: ${medicine.stock}`
        });
        continue;
      }

      const price = medicine.price || 0;
      const quantity = item.quantity || 1;
      const itemTotal = price * quantity;
      totalAmount += itemTotal;

      // console.log(`${item.name}: ${quantity} x ₹${price} = ₹${itemTotal}`);

      orderItems.push({
        medicineName: medicine.name,
        dosage: item.dosage || '',
        quantity: quantity,
        instructions: item.instructions || '',
        price: price,
        medicineId: medicine._id
      });

      // Reduce stock
      await Medicine.findByIdAndUpdate(medicine._id, {
        $inc: { stock: -quantity }
      });
      // console.log(`Stock updated for ${medicine.name}: -${quantity}`);
    }

    if (!allAvailable) {
      // console.log('Some medicines are not available:', unavailableItems);
      return res.status(400).json({
        success: false,
        message: 'Some medicines are not available',
        data: {
          unavailableItems: unavailableItems
        }
      });
    }

    // console.log(`Total amount: ₹${totalAmount}`);

    // Create order - let the pre-save hook generate the orderId
    // console.log('Creating order...');
    const orderData = {
      userId,
      prescriptionId,
      patientName: patientName || req.user.fullName || 'Patient',
      doctorName: doctorName || 'N/A',
      items: orderItems,
      supplier: null,
      amount: totalAmount,
      status: 'Pending',
      orderDate: new Date(),
    };

    // Use create() instead of new + save() to avoid pre-save issues
    const order = await Order.create(orderData);
    // console.log('Order created successfully:', order.orderId);

    // Create notification
    try {
      await Notification.create({
        user: userId,
        type: 'Order Placed',
        text: `Your order for medicines has been placed successfully. Order ID: ${order.orderId}`,
      });
      // console.log('Notification created');
    } catch (notifError) {
      // console.log('Notification error:', notifError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Error in createOrderFromPrescription:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
      stack: error.stack
    });
  }
};