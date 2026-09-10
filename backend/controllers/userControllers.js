import User from '../models/User.js';

// ==================================================
// GET ALL USERS
// ==================================================

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('_id name email')
      .sort({name: 1});

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Get users error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

// ==================================================
// GET USER BY ID
// ==================================================

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id,
    ).select('_id name email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      'Get user by ID error:',
      error,
    );

    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
    });
  }
};

// ==================================================
// GET LOGGED-IN USER PROFILE
// ==================================================

export const getUserProfile = async (
  req,
  res,
) => {
  try {
    const user = await User.findById(
      req.user,
    ).select('_id name email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      'Get profile error:',
      error,
    );

    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
};