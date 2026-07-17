import PurchaseOrder from "../../models/PharmacyPanel/PurchaseOrder.js";
import Supplier from "../../models/PharmacyPanel/Supplier.js";
import Medicine from "../../models/PharmacyPanel/Medicine.js";
import Notification from "../../models/PharmacyPanel/Notification.js";

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