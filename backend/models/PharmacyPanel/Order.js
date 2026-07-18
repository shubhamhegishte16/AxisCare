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
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    default: null,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
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
    items: {
      type: [orderItemSchema],
      default: [],
    },
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
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending',
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

// Generate order ID before saving
orderSchema.pre('save', async function (next) {
  try {
    if (this.isNew && !this.orderId) {
      const Order = mongoose.model('Order');
      const count = await Order.countDocuments();
      this.orderId = `ORD-${String(count + 1).padStart(5, '0')}`;
      // console.log(`Generated order ID: ${this.orderId}`);
    }
  } catch (error) {
    console.error('Error generating order ID:', error);
    // Fallback: use timestamp
    this.orderId = `ORD-${Date.now()}`;
  }
});

// Remove duplicate index - only keep one
orderSchema.index({ userId: 1 });
orderSchema.index({ prescriptionId: 1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;