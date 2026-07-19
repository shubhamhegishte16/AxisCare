import mongoose from "mongoose";

const labProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    empId: { type: String, default: "" },
    designation: { type: String, default: "Lab Technician" },
    department: { type: String, default: "Pathology Lab" },
    notifications: {
      emailNewRequests: { type: Boolean, default: true },
      emailResultUpdates: { type: Boolean, default: true },
      emailSystemAlerts: { type: Boolean, default: true },
      appNewRequests: { type: Boolean, default: true },
      appResultUpdates: { type: Boolean, default: true },
      appSystemAlerts: { type: Boolean, default: true },
    },
    preferences: {
      defaultSampleType: {
        type: String,
        enum: ["Blood", "Urine", "Serum", "Plasma"],
        default: "Blood",
      },
      defaultPriority: {
        type: String,
        enum: ["Normal", "High", "Urgent"],
        default: "Normal",
      },
      resultsAutoApprove: {
        type: String,
        enum: ["After Verification", "Immediate", "Never"],
        default: "After Verification",
      },
      workingTimeStart: { type: String, default: "08:00" },
      workingTimeEnd: { type: String, default: "16:00" },
    },
  },
  { timestamps: true }
);

const LabProfile = mongoose.model("LabProfile", labProfileSchema);
export default LabProfile;
