import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";

// Patient Panel
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import PatientNotificationRoutes from "./routes/PatientNotificationRoutes.js";
import medicalHistoryRoutes from './routes/medicalHistoryRoutes.js';
import LabAppointmentRoutes from './routes/LabAppointmentRoutes.js';
import orderRoutes from './routes/pharmacy/orderRoutes.js';
<<<<<<< HEAD
import billRoutes from './routes/PatientBillRoutes.js';
=======
>>>>>>> d9195c598e222a22f0a9e962f1e9b84df0a477a9

// Receptionist Panel
import receptionistRoutes from "./routes/receptionistRoutes.js";

// Pharmacy Panel
import pharmacyDashboardRoutes from "./routes/pharmacy/dashboardRoutes.js";
import pharmacyMedicineRoutes from "./routes/pharmacy/medicineRoutes.js";
import pharmacySupplierRoutes from "./routes/pharmacy/supplierRoutes.js";
import pharmacyOrderRoutes from "./routes/pharmacy/orderRoutes.js";
import pharmacyBillingRoutes from "./routes/pharmacy/billingRoutes.js";
import pharmacyPrescriptionRoutes from "./routes/pharmacy/prescriptionRoutes.js";
import pharmacyNotificationRoutes from "./routes/pharmacy/notificationRoutes.js";
import pharmacyReportsRoutes from "./routes/pharmacy/reportsRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AxisCare Backend Running",
  });
});

// ================= Authentication =================
app.use("/api/auth", authRoutes);

// ================= Doctor =================
app.use("/api/doctor", doctorRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

// ================= Patient =================
app.use("/api/patient", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/notifications", PatientNotificationRoutes);
app.use("/api/medical", medicalHistoryRoutes);
app.use('/api/lab-appointments', LabAppointmentRoutes);
app.use('/api/pharmacy', orderRoutes);
<<<<<<< HEAD
app.use('/api/bills', billRoutes);
=======
>>>>>>> d9195c598e222a22f0a9e962f1e9b84df0a477a9

// ================= Receptionist =================
app.use("/api/receptionist", receptionistRoutes);

// ================= Pharmacy =================
app.use("/api/pharmacy/dashboard", pharmacyDashboardRoutes);
app.use("/api/pharmacy/medicines", pharmacyMedicineRoutes);
app.use("/api/pharmacy/suppliers", pharmacySupplierRoutes);
app.use("/api/pharmacy/orders", pharmacyOrderRoutes);
app.use("/api/pharmacy/billing", pharmacyBillingRoutes);
app.use("/api/pharmacy/prescriptions", pharmacyPrescriptionRoutes);
app.use("/api/pharmacy/notifications", pharmacyNotificationRoutes);
app.use("/api/pharmacy/reports", pharmacyReportsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});