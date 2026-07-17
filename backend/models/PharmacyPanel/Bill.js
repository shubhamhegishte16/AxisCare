import mongoose from "mongoose";

const billItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
});

const billSchema = new mongoose.Schema(
  {
    billId: { type: String, unique: true, required: true }, // e.g. BILL-9001
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    patientName: { type: String, required: true },
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
    items: [billItemSchema],
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
    },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

billSchema.index({ status: 1 });

const Bill = mongoose.model("Bill", billSchema);
export default Bill;