import Expense from "../models/Expense.js";

// CREATE
export const createExpense = async (req, res) => {
  try {
    const { description, amount, date } = req.body;

    const expense = await Expense.create({
      description,
      amount,
      date,
      user: req.user,
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// READ ALL
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// READ RECENT
export const getRecentExpenses = async (req, res) => {
  try {
    const today = new Date();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const expenses = await Expense.find({
      user: req.user,
      date: {
        $gte: sevenDaysAgo,
        $lte: today,
      },
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, date } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: req.user },
      {
        description,
        amount,
        date,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOneAndDelete({
      _id: id,
      user: req.user,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};