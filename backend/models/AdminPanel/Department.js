import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    head: { type: String, default: "Unassigned", trim: true }, // doctor's name, free text for now
    headDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

departmentSchema.index({ status: 1 });

const Department = mongoose.model("Department", departmentSchema);
export default Department;
