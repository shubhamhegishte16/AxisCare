import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: true,
    trim: true,
  },
  dosage: {
    type: String,
    default: '',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  instructions: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    doctorName: {
      type: String,
      default: '',
    },
    items: [orderItemSchema],
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
    },
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Cancelled"],
      default: "Pending",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    dispensedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    dispensedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1 });
orderSchema.index({ prescriptionId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderDate: -1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;