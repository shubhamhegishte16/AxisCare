import Supplier from "../../models/PharmacyPanel/Supplier.js";
import Medicine from "../../models/PharmacyPanel/Medicine.js";
import PurchaseOrder from "../../models/PharmacyPanel/PurchaseOrder.js";

const generateSupplierId = (doc) => `SUP-${String(doc._id).slice(-6).toUpperCase()}`;

const shapeSupplier = async (s) => {
  const [medicines, orders] = await Promise.all([
    Medicine.countDocuments({ supplier: s._id }),
    PurchaseOrder.countDocuments({ supplier: s._id }),
  ]);

  return {
    id: generateSupplierId(s),
    _id: s._id,
    name: s.name,
    contact: s.contact,
    email: s.email,
    status: s.status,
    medicines,
    orders,
    createdAt: s.createdAt,
  };
};

// @desc    Get all suppliers (with search)
// @route   GET /api/pharmacy/suppliers
export const getSuppliers = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const suppliers = await Supplier.find(filter).sort({ createdAt: -1 });
    const data = await Promise.all(suppliers.map(shapeSupplier));

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error("Error in getSuppliers:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get supplier stats
// @route   GET /api/pharmacy/suppliers/stats
export const getSupplierStats = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    const medicinesSupplied = await Medicine.countDocuments({ supplier: { $ne: null } });

    const stats = {
      total: suppliers.length,
      active: suppliers.filter((s) => s.status === "Active").length,
      pending: suppliers.filter((s) => s.status === "Pending").length,
      medicines: medicinesSupplied,
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Error in getSupplierStats:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get single supplier
// @route   GET /api/pharmacy/suppliers/:id
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: "Supplier not found" });
    }
    res.status(200).json({ success: true, data: await shapeSupplier(supplier) });
  } catch (error) {
    console.error("Error in getSupplierById:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Add supplier
// @route   POST /api/pharmacy/suppliers
export const createSupplier = async (req, res) => {
  try {
    const { name, contact, email } = req.body;

    if (!name || !contact || !email) {
      return res.status(400).json({ success: false, message: "Name, contact and email are required" });
    }

    const supplier = await Supplier.create({
      name,
      contact,
      email,
      status: "Pending",
      addedBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "Supplier added successfully", data: await shapeSupplier(supplier) });
  } catch (error) {
    console.error("Error in createSupplier:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update supplier
// @route   PUT /api/pharmacy/suppliers/:id
export const updateSupplier = async (req, res) => {
  try {
    const { name, contact, email, status } = req.body;

    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: "Supplier not found" });
    }

    if (name !== undefined) supplier.name = name;
    if (contact !== undefined) supplier.contact = contact;
    if (email !== undefined) supplier.email = email;
    if (status !== undefined) supplier.status = status;

    await supplier.save();

    res.status(200).json({ success: true, message: "Supplier updated successfully", data: await shapeSupplier(supplier) });
  } catch (error) {
    console.error("Error in updateSupplier:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete supplier
// @route   DELETE /api/pharmacy/suppliers/:id
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: "Supplier not found" });
    }
    res.status(200).json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSupplier:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};