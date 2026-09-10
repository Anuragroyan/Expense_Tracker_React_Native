import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  updateProfile,
} from "../controllers/authControllers.js";

import middleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get logged-in user
router.get("/me", middleware, getMe);

// Update profile
router.put("/profile", middleware, updateProfile);

// Logout
router.post("/logout", middleware, logoutUser);

export default router;