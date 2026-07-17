import User from "../models/user.js";
import Notification from "../models/PharmacyPanel/Notification.js";

// Creates one notification per pharmacist so every pharmacist sees pharmacy-wide
// events (new prescription, low stock, expiring medicine) in their own feed.
export const notifyPharmacists = async (type, text) => {
  try {
    const pharmacists = await User.find({ role: "pharmacist" }).select("_id");
    if (pharmacists.length === 0) return;

    await Notification.insertMany(
      pharmacists.map((p) => ({ user: p._id, type, text }))
    );
  } catch (error) {
    // Notifications are a non-critical side effect — never let a failure here
    // break the primary action (creating a prescription, adjusting stock, etc.)
    console.error("Error in notifyPharmacists:", error);
  }
};

// Creates a single notification for one specific user (e.g. the pharmacist
// who just performed an action, like generating a bill).
export const notifyUser = async (userId, type, text) => {
  try {
    await Notification.create({ user: userId, type, text });
  } catch (error) {
    console.error("Error in notifyUser:", error);
  }
};