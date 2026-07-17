import Medicine from "../../models/PharmacyPanel/Medicine.js";
import { notifyPharmacists } from "../../utils/pharmacyNotify.js";

const generateMedicineId = (doc) => `MED-${String(doc._id).slice(-6).toUpperCase()}`;

// Fires Low Stock / Expiring Soon notifications when a medicine's computed
// status newly crosses into that state (prevStatus is undefined for new medicines).
const checkStockAndExpiryAlerts = async (medicine, prevStatus) => {
  const status = medicine.status;

  if ((status === "Low Stock" || status === "Out of Stock") && status !== prevStatus) {
    await notifyPharmacists(
      "Low Stock Alert",
      `${medicine.name} is ${status === "Out of Stock" ? "out of stock" : "running low"} (${medicine.stock} units left).`
    );
  }

  if (status === "Expiring Soon" && status !== prevStatus) {
    await notifyPharmacists(
      "Medicine Expiring",
      `${medicine.name} (batch ${medicine.batch}) is expiring soon on ${new Date(medicine.expiry).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}.`
    );
  }
};

const shapeMedicine = (m) => ({
  id: generateMedicineId(m),
  _id: m._id,
  name: m.name,
  genericName: m.genericName,
  brand: m.brand,
  category: m.category,
  manufacturer: m.manufacturer,
  batch: m.batch,
  mfgDate: m.mfgDate,
  expiry: m.expiry,
  purchasePrice: m.purchasePrice,
  price: m.price,
  stock: m.stock,
  lowStockThreshold: m.lowStockThreshold,
  supplierName: m.supplierName,
  supplier: m.supplier,
  description: m.description,
  status: m.status,
  createdAt: m.createdAt,
});

// @desc    Get all medicines (with search/category filter)
// @route   GET /api/pharmacy/medicines
export const getMedicines = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { batch: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "All") {
      filter.category = category;
    }

    const medicines = await Medicine.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: medicines.length, data: medicines.map(shapeMedicine) });
  } catch (error) {
    console.error("Error in getMedicines:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get medicine stats (total, low stock, out of stock, expiring soon)
// @route   GET /api/pharmacy/medicines/stats
export const getMedicineStats = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    const stats = {
      total: medicines.length,
      lowStock: medicines.filter((m) => m.status === "Low Stock").length,
      outOfStock: medicines.filter((m) => m.status === "Out of Stock").length,
      expiringSoon: medicines.filter((m) => m.status === "Expiring Soon").length,
    };
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Error in getMedicineStats:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get single medicine
// @route   GET /api/pharmacy/medicines/:id
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }
    res.status(200).json({ success: true, data: shapeMedicine(medicine) });
  } catch (error) {
    console.error("Error in getMedicineById:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Add medicine
// @route   POST /api/pharmacy/medicines
export const createMedicine = async (req, res) => {
  try {
    const {
      name, genericName, brand, category, manufacturer, batch, mfgDate, expiry,
      purchasePrice, sellingPrice, quantity, minStock, supplier, description,
    } = req.body;

    if (!name || !category || !batch || !expiry) {
      return res.status(400).json({ success: false, message: "Name, category, batch and expiry are required" });
    }

    const medicine = await Medicine.create({
      name,
      genericName,
      brand,
      category,
      manufacturer,
      batch,
      mfgDate: mfgDate || undefined,
      expiry,
      purchasePrice: Number(purchasePrice) || 0,
      price: Number(sellingPrice) || 0,
      stock: Number(quantity) || 0,
      lowStockThreshold: Number(minStock) || 50,
      supplierName: supplier || "",
      description,
      addedBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "Medicine added successfully", data: shapeMedicine(medicine) });

    checkStockAndExpiryAlerts(medicine, undefined);
  } catch (error) {
    console.error("Error in createMedicine:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update medicine
// @route   PUT /api/pharmacy/medicines/:id
export const updateMedicine = async (req, res) => {
  try {
    const {
      name, genericName, brand, category, manufacturer, batch, mfgDate, expiry,
      purchasePrice, sellingPrice, quantity, minStock, supplier, description,
    } = req.body;

    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }

    const prevStatus = medicine.status;

    if (name !== undefined) medicine.name = name;
    if (genericName !== undefined) medicine.genericName = genericName;
    if (brand !== undefined) medicine.brand = brand;
    if (category !== undefined) medicine.category = category;
    if (manufacturer !== undefined) medicine.manufacturer = manufacturer;
    if (batch !== undefined) medicine.batch = batch;
    if (mfgDate !== undefined) medicine.mfgDate = mfgDate;
    if (expiry !== undefined) medicine.expiry = expiry;
    if (purchasePrice !== undefined) medicine.purchasePrice = Number(purchasePrice);
    if (sellingPrice !== undefined) medicine.price = Number(sellingPrice);
    if (quantity !== undefined) medicine.stock = Number(quantity);
    if (minStock !== undefined) medicine.lowStockThreshold = Number(minStock);
    if (supplier !== undefined) medicine.supplierName = supplier;
    if (description !== undefined) medicine.description = description;

    await medicine.save();

    res.status(200).json({ success: true, message: "Medicine updated successfully", data: shapeMedicine(medicine) });

    checkStockAndExpiryAlerts(medicine, prevStatus);
  } catch (error) {
    console.error("Error in updateMedicine:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get inventory-level stats (total units, low/out of stock, inventory value)
// @route   GET /api/pharmacy/medicines/inventory-stats
export const getInventoryStats = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    const stats = {
      totalStock: medicines.reduce((sum, m) => sum + m.stock, 0),
      lowStock: medicines.filter((m) => m.status === "Low Stock").length,
      outOfStock: medicines.filter((m) => m.status === "Out of Stock").length,
      value: medicines.reduce((sum, m) => sum + m.stock * m.price, 0),
    };
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Error in getInventoryStats:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Adjust stock (add/remove units)
// @route   PUT /api/pharmacy/medicines/:id/adjust-stock
export const adjustStock = async (req, res) => {
  try {
    const { type, amount } = req.body; // type: 'add' | 'remove'
    const amt = Number(amount);

    if (!["add", "remove"].includes(type) || !amt || amt <= 0) {
      return res.status(400).json({ success: false, message: "Provide a valid type ('add'/'remove') and a positive amount" });
    }

    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }

    const prevStatus = medicine.status;
    medicine.stock = type === "add" ? medicine.stock + amt : Math.max(0, medicine.stock - amt);
    await medicine.save();

    res.status(200).json({ success: true, message: "Stock adjusted successfully", data: shapeMedicine(medicine) });

    checkStockAndExpiryAlerts(medicine, prevStatus);
  } catch (error) {
    console.error("Error in adjustStock:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete medicine
// @route   DELETE /api/pharmacy/medicines/:id
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }
    res.status(200).json({ success: true, message: "Medicine deleted successfully" });
  } catch (error) {
    console.error("Error in deleteMedicine:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};