import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    dateOfBirth: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["Female", "Male", "Other", ""],
      default: "",
    },
    qualification: { type: String, default: "" },
    experience: { type: String, default: "" },
    nationality: { type: String, default: "" },
    aboutYou: { type: String, maxlength: 300, default: "" },

    specialization: { type: String, default: "" },
    department: { type: String, default: "" },
    licenseNumber: { type: String, default: "" },
    consultationFee: { type: Number, default: 0 },
    joiningDate: { type: String, default: "" },
    university: { type: String, default: "" },
    degree: { type: String, default: "" },
    professionalBio: { type: String, maxlength: 300, default: "" },

    alternatePhone: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pinCode: { type: String, default: "" },

    linkedinUrl: { type: String, default: "" },
    twitterUrl: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const DoctorProfile = mongoose.model("DoctorProfile", doctorProfileSchema);

export default DoctorProfile;
