import express from 'express';

import {
  getUsers,
  getUserById,
  getUserProfile,
} from '../controllers/userControllers.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all users
router.get('/', authMiddleware, getUsers);

// Get logged-in user's profile
router.get('/profile', authMiddleware, getUserProfile);

// Get user by ID
router.get('/:id', authMiddleware, getUserById);

export default router;