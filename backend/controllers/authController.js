import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

import Patient from '../models/Patient.js';

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, role, department } = req.body;

    if (!fullName || !email || !phone || !password || !role) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    // Check if phone exists
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ success: false, message: "User already exists with this phone number" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
      department: department || "",
    });

    if (user) {

      // For Patient Profile Updation
      // If role is patient, create patient profile
      let patientData = null;
      if (role === 'patient' || role === undefined) {
        try {
          const nameParts = fullName.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          const now = new Date();
          const dateOfRegistration = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;

          patientData = await Patient.create({
            userId: user._id,
            firstName,
            lastName,
            dateOfBirth: '01/01/1970',
            gender: 'Prefer not to say',
            address: 'Not provided',
            phoneNumber: phone,
            email: email,
            dateOfRegistration,
            emergencyContacts: [
              {
                name: 'Emergency Contact',
                relationship: 'Not specified',
                phone1: 'Not provided',
                isPrimary: true,
              }
            ],
          });
          console.log('Patient profile created');
        } catch (patientError) {
          console.error('Error creating patient profile:', patientError);
        }
      }

      // Generate Token
      const token = generateToken(user._id);

      // Set cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        token
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate Token
      const token = generateToken(user._id);

      // Set cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        token
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
