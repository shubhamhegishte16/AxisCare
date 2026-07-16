import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Dummy test route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Auth Route Working ✅",
  });
});

export default router;