import express from "express";

import {
  createExpense,
  getExpenses,
  getRecentExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseControllers.js";

import middleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", middleware, createExpense);

router.get("/", middleware, getExpenses);

router.get("/recent", middleware, getRecentExpenses);

router.put("/:id", middleware, updateExpense);

router.delete("/:id", middleware, deleteExpense);

export default router;