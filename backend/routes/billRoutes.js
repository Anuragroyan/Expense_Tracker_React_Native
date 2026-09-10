import express from "express";

import {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
} from "../controllers/billControllers.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================================
// CREATE BILL
// ======================================================

router.post(
  "/",
  authMiddleware,
  createBill
);

// ======================================================
// GET USER'S BILLS
// ======================================================
// Returns bills where:
// - user is creator
// - OR user is participant
// ======================================================

router.get(
  "/",
  authMiddleware,
  getBills
);

// ======================================================
// GET SINGLE BILL
// ======================================================
// Allowed for:
// - creator
// - participant
// ======================================================

router.get(
  "/:id",
  authMiddleware,
  getBillById
);

// ======================================================
// UPDATE BILL
// ======================================================
// Creator only
// ======================================================

router.put(
  "/:id",
  authMiddleware,
  updateBill
);

// ======================================================
// DELETE BILL
// ======================================================
// Creator only
// ======================================================

router.delete(
  "/:id",
  authMiddleware,
  deleteBill
);

export default router;