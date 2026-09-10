import express from "express";

import {
  chatbotResponse,
} from "../controllers/chatbotControllers.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, chatbotResponse);

export default router;