💰 Expense Tracker

Expense Tracker is a React Native Expo application designed to provide a clean and interactive interface for managing daily expenses and bills. Users can create, view, update, and delete expense records while managing important details such as title, date, and price.

The application also provides a Recent Expenses section that displays expenses from the last 7 days for quick financial tracking. It includes dedicated UI flows for splitting bills equally or by percentage among group members.

✨ Key Features

* 💰 Track daily expenses
* ➕ Add new expense records
* 👁️ View expense details
* ✏️ Edit existing expenses
* 🗑️ Delete expenses
* 📝 Manage expense title and details
* 📅 Track expense dates
* 💵 Record expense amounts
* 🕒 Display expenses from the last 7 days
* 👥 Add and manage group members
* ➗ Split bills equally
* 📊 Split bills by percentage
* 🧾 Manage bill-splitting details
* 📱 Clean and interactive React Native UI
* 🧭 Simple and intuitive navigation

🏗️ Architecture & Workflow

The React Native Expo application provides the user interface for creating and managing expense records, bills, groups, and bill-splitting workflows.

Users can add expenses with details such as title, date, and price, then view, update, or delete their records. The application provides dedicated screens and components for handling different expense-management operations.

Recent expenses are filtered and displayed based on transactions from the last 7 days, allowing users to quickly review their latest spending activity.

The bill-splitting workflow allows users to select group members and divide a bill either equally or according to custom percentage values.

Expense Tracker UI
       │
       ├──► Add Expense
       ├──► View Expense
       ├──► Update Expense
       ├──► Delete Expense
       │
       ├──► Recent Expenses
       │       └──► Last 7 Days
       │
       └──► Bill Splitting
               ├──► Equal Split
               └──► Percentage Split

🛠️ Tech Stack

React Native • Expo • JavaScript • React Hooks • Expo Router/Navigation • Responsive UI • CRUD UI Operations • Form Management

▶️ Run the App

1. Clone the repository

git clone <repository-url>
cd expense-tracker

2. Install dependencies

npm install

3. Start Expo

npx expo start

4. Run on Android

npx expo start --android

Or press a in the Expo terminal.

5. Run on iOS

npx expo start --ios

Or press i in the Expo terminal.

6. Run on Web

npx expo start --web

Note: This version focuses on the frontend UI and user experience and does not require Firebase, MongoDB, or a backend server.

🎯 Project Goals

* Build a practical expense-management interface using React Native and Expo.
* Practice designing reusable and responsive mobile UI components.
* Implement add, view, update, and delete expense workflows.
* Practice handling forms and user-entered expense information.
* Create a recent-expense section based on the previous 7 days.
* Design intuitive bill-splitting workflows.
* Implement equal and percentage-based bill-splitting interfaces.
* Practice mobile navigation, lists, cards, forms, and interactive components.
* Build a clean and responsive cross-platform mobile UI.
* Create a portfolio project demonstrating practical React Native development concepts.

💼 Portfolio Highlights

This project demonstrates:

* React Native Development: Building a functional cross-platform mobile application using React Native.
* Expo: Using Expo for simplified React Native development and testing.
* Expense Management: Designing complete UI flows for adding, viewing, editing, and deleting expenses.
* Recent Expenses: Displaying transactions from the last 7 days for quick expense tracking.
* Bill Management: Creating interfaces for managing bill information.
* Bill Splitting: Supporting equal and percentage-based bill-splitting workflows.
* Group Management: Designing UI for adding and selecting members for shared expenses.
* Form Management: Collecting and validating expense information such as title, price, and date.
* Dynamic UI: Updating the interface based on user interactions and expense changes.
* Navigation: Connecting multiple screens into a consistent application workflow.
* Responsive Design: Creating a user-friendly interface across different mobile screen sizes.
* Cross-Platform Development: Supporting Android, iOS, and Web through the Expo ecosystem.

🚀 Future Improvements

* 🔐 Add user authentication
* ☁️ Integrate a backend database
* 💾 Persist expense records
* 📊 Add expense analytics and charts
* 🗂️ Add expense categories
* 🔍 Add search and filtering
* 📅 Add monthly and yearly expense summaries
* 💰 Add total spending calculations
* 📈 Add spending statistics
* 🔄 Add real-time expense synchronization
* 🌙 Add dark mode
* 📤 Export expense reports
* 💳 Add payment and settlement features

📄 Project Purpose

This project demonstrates how to build a modern expense and bill management interface using React Native and Expo. It provides practical experience with expense CRUD workflows, form management, recent expense tracking, group-based bill splitting, equal and percentage-based calculations, navigation, responsive layouts, and reusable mobile UI components.

The project is created as a portfolio application to demonstrate practical React Native UI development skills through a real-world expense-management use case.
