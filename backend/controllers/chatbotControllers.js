import ChatMessage from "../models/Chatbot.js";

// RULE-BASED CHATBOT
export const chatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const userMessage = message.toLowerCase().trim();

    let reply;

    // =========================
    // GREETING
    // =========================

    if (
      userMessage.includes("hello") ||
      userMessage.includes("hi") ||
      userMessage.includes("hey")
    ) {
      reply =
        "Hello! 👋 I can help you with expenses, bills, splitting, coupons, login, and your profile.";
    }

    // =========================
    // ADD EXPENSE
    // =========================

    else if (
      userMessage.includes("add expense") ||
      userMessage.includes("create expense")
    ) {
      reply =
        "To add an expense, enter the description, amount, and date, then tap Add.";
    }

    // =========================
    // EDIT EXPENSE
    // =========================

    else if (
      userMessage.includes("edit expense") ||
      userMessage.includes("update expense")
    ) {
      reply =
        "Open the expense you want to change, update its details, and tap Update.";
    }

    // =========================
    // DELETE EXPENSE
    // =========================

    else if (
      userMessage.includes("delete expense") ||
      userMessage.includes("remove expense")
    ) {
      reply =
        "Open the expense you want to remove and use the delete option.";
    }

    // =========================
    // RECENT EXPENSES
    // =========================

    else if (
      userMessage.includes("recent expense") ||
      userMessage.includes("recent expenses") ||
      userMessage.includes("last 7 days")
    ) {
      reply =
        "Recent Expenses displays expenses recorded during the last 7 days.";
    }

    // =========================
    // EXPENSE
    // =========================

    else if (
      userMessage.includes("expense") ||
      userMessage.includes("expenses")
    ) {
      reply =
        "You can add, view, edit, and delete your expenses from the Expense Tracker.";
    }

    // =========================
    // SPLIT BILL
    // =========================

    else if (
      userMessage.includes("split bill") ||
      userMessage.includes("split a bill") ||
      userMessage.includes("splitting bill")
    ) {
      reply =
        "You can split a bill equally or assign a different percentage to each participant.";
    }

    // =========================
    // EQUAL SPLIT
    // =========================

    else if (
      userMessage.includes("equal split") ||
      userMessage.includes("split equally") ||
      userMessage.includes("equally")
    ) {
      reply =
        "Equal split divides the final bill amount equally among all participants. Any small rounding difference is automatically adjusted.";
    }

    // =========================
    // PERCENTAGE SPLIT
    // =========================

    else if (
      userMessage.includes("percentage split") ||
      userMessage.includes("percent split") ||
      userMessage.includes("percentage")
    ) {
      reply =
        "Percentage split lets you assign a different percentage to each participant. The total percentage must equal 100%.";
    }

    // =========================
    // COUPON / DISCOUNT
    // =========================

    else if (
      userMessage.includes("coupon") ||
      userMessage.includes("discount")
    ) {
      reply =
        "Discount tiers are: ₹200 or less = 0%, above ₹200 = 10%, above ₹500 = 20%, and above ₹1000 = 30%.";
    }

    // =========================
    // LOGIN
    // =========================

    else if (
      userMessage.includes("login") ||
      userMessage.includes("log in")
    ) {
      reply =
        "Use your registered email and password to log in to your account.";
    }

    // =========================
    // LOGOUT
    // =========================

    else if (
      userMessage.includes("logout") ||
      userMessage.includes("log out")
    ) {
      reply =
        "You can log out from your Profile section. Your authentication token will be removed from the app.";
    }

    // =========================
    // PROFILE
    // =========================

    else if (
      userMessage.includes("profile") ||
      userMessage.includes("account")
    ) {
      reply =
        "You can update your name and email from your Profile section.";
    }

    // =========================
    // BILL
    // =========================

    else if (
      userMessage.includes("bill") ||
      userMessage.includes("bills")
    ) {
      reply =
        "You can create, view, update, and delete bills. Bills support equal and percentage-based splitting.";
    }

    // =========================
    // HELP
    // =========================

    else if (
      userMessage.includes("help") ||
      userMessage.includes("what can you do")
    ) {
      reply =
        "I can help you with expenses, bills, equal splitting, percentage splitting, coupons, login, logout, and profile updates.";
    }

    // =========================
    // DEFAULT RESPONSE
    // =========================

    else {
      reply =
        "I'm not sure about that. Try asking about expenses, bill splitting, coupons, login, logout, or your profile.";
    }

    // Save this exchange to chat history
    await ChatMessage.create({
      user: req.user,
      message: message.trim(),
      reply,
    });

    // Response
    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chatbot Error:", error);

    res.status(500).json({
      success: false,
      message: "Chatbot failed",
      error: error.message,
    });
  }
};