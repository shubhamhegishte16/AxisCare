import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    genericName: { type: String, default: "", trim: true },
    brand: { type: String, default: "", trim: true },
    category: { type: String, required: true, trim: true },
    manufacturer: { type: String, default: "", trim: true },
    batch: { type: String, required: true, trim: true },
    mfgDate: { type: Date },
    expiry: { type: Date, required: true },
    purchasePrice: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 }, // selling price
    stock: { type: Number, required: true, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 50 },
    supplierName: { type: String, default: "", trim: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    description: { type: String, default: "" },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

medicineSchema.virtual("status").get(function () {
  const now = new Date();
  const soon = new Date();
  soon.setDate(soon.getDate() + 60);

  if (this.stock === 0) return "Out of Stock";
  if (this.expiry <= soon) return "Expiring Soon";
  if (this.stock <= this.lowStockThreshold) return "Low Stock";
  return "In Stock";
});

medicineSchema.set("toJSON", { virtuals: true });
medicineSchema.set("toObject", { virtuals: true });

medicineSchema.index({ name: 1 });
medicineSchema.index({ category: 1 });

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;