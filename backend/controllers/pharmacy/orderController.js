import PurchaseOrder from "../../models/PharmacyPanel/PurchaseOrder.js";
import Supplier from "../../models/PharmacyPanel/Supplier.js";

const generateOrderId = async () => {
  const count = await PurchaseOrder.countDocuments();
  return `PO-${3000 + count + 1}`;
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

    const orderId = await generateOrderId();

    const order = await PurchaseOrder.create({
      orderId,
      supplier: supplierDoc ? supplierDoc._id : undefined,
      supplierName: supplierDoc ? supplierDoc.name : supplier,
      items: items || [],
      amount: Number(amount) || 0,
      status: "Pending",
      createdBy: req.user._id,
    });

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

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: "Order status updated", data: shapeOrder(order) });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};