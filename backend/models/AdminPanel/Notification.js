import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient (admin)
    type: {
      type: String,
      enum: ["Approval", "Alert", "Report", "System"],
      required: true,
    },
    text: { type: String, required: true },
    status: {
      type: String,
      enum: ["Unread", "Read"],
      default: "Unread",
    },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, status: 1 });

const AdminNotification = mongoose.model("AdminNotification", notificationSchema);
export default AdminNotification;
