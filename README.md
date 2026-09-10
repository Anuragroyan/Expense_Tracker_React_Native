💰 Expense Tracker

Expense Tracker is a React Native CLI (Non-Expo) application designed to help users manage personal and shared bills and expenses. The application includes secure authentication, complete CRUD operations, group expense management, and flexible bill-splitting options using equal and percentage-based calculations.

The mobile application communicates with a Node.js and Express.js REST API, while MongoDB is used for persistent data storage.

⸻

✨ Key Features

🔐 Authentication

* User registration
* User login
* User logout
* JWT-based authentication
* Password hashing with bcryptjs
* Protected API routes

💰 Bill & Expense Management

* Add new bills and expenses
* View expense records
* View bill details
* Update existing bills and expenses
* Delete bills and expenses
* Track expense amount, title, date, and other details
* Manage personal financial records

👥 Group Management

* Create expense groups
* Add members to groups
* Manage group members
* Track shared expenses within groups

➗ Bill Splitting

* Split bills equally among members
* Split bills using custom percentages
* Calculate individual member contributions
* Track who paid the bill
* Track how expenses are distributed among members

📊 Expense Tracking

* View personal expenses
* View shared/group expenses
* Track recent transactions
* Manage financial records from a centralized application

⸻

🎯 Project Goals

* Build a practical expense and bill management application using React Native CLI.
* Develop a complete full-stack mobile application.
* Implement secure user authentication using JWT and bcryptjs.
* Implement CRUD operations for bills and expenses.
* Learn REST API integration between React Native and a backend server.
* Practice MongoDB database integration using Mongoose.
* Implement group-based expense management.
* Develop equal and percentage-based bill-splitting logic.
* Use Redux for centralized application state management.
* Practice handling forms and user-entered financial data.
* Build a clean and responsive mobile user interface.
* Create a practical portfolio project demonstrating real-world development skills.

⸻

🛠️ Tech Stack

📱 Mobile Application

React Native CLI • JavaScript • Redux • Axios

🖥️ Backend

Node.js • Express.js • REST API

🍃 Database

MongoDB • Mongoose

🔐 Authentication & Security

JWT • bcryptjs

🔧 Development Tools

Git • GitHub • Android Studio • VS Code

⸻

🏗️ Architecture

The application follows a client-server architecture:

React Native CLI
       │
       │ Axios / REST API
       ▼
Node.js + Express.js
       │
       │ Mongoose
       ▼
    MongoDB

The React Native application handles the user interface and client-side state, while the Express.js backend manages authentication, business logic, API requests, and communication with MongoDB.

⸻

🔗 Application Relationship

USER
 │
 ├──► TRANSACTIONS
 │
 ├──► GROUPS
 │      │
 │      ├──► MEMBERS
 │      │
 │      └──► GROUP EXPENSES
 │               │
 │               ├──► PAID BY
 │               │
 │               └──► SPLIT AMONG
 │
 └──► SETTLEMENTS

This structure allows the application to manage both personal expenses and shared group expenses.

⸻

📊 Bill Splitting

The application supports two primary splitting methods.

Equal Split

The bill amount is divided equally among the selected members.

Total Bill = ₹1,000
Members = 4
₹1,000 ÷ 4 = ₹250 per person

Percentage Split

The bill is divided according to custom percentages.

Total Bill = ₹1,000
Member A → 50% → ₹500
Member B → 30% → ₹300
Member C → 20% → ₹200

This provides flexibility when group members have different spending responsibilities.

⸻

🔄 CRUD Operations

The application implements complete CRUD functionality:

Operation	Description
Create	Add bills and expenses
Read	View bills and expenses
Update	Modify existing records
Delete	Remove bills and expenses

⸻

🌐 API Communication

The React Native application communicates with the backend through REST APIs using Axios.

React Native
     │
     ▼
   Axios
     │
     ▼
Express REST API
     │
     ▼
Controllers
     │
     ▼
Mongoose
     │
     ▼
MongoDB

Authentication tokens are used to access protected resources.

⸻

🔐 Authentication Flow

Register
   ↓
User Account Created
   ↓
Password Hashed
   ↓
Login
   ↓
JWT Generated
   ↓
Token Stored on Client
   ↓
Protected API Requests

JWT authentication ensures that protected resources can only be accessed by authenticated users.

⸻

💼 Portfolio Highlights

This project demonstrates practical experience in:

* React Native CLI: Building a cross-platform mobile application without Expo.
* JavaScript: Developing application logic and reusable components.
* Redux: Managing application state across multiple screens.
* Axios: Communicating with REST APIs.
* Node.js: Building the backend runtime environment.
* Express.js: Creating REST API endpoints and backend routes.
* MongoDB: Storing application and user data.
* Mongoose: Creating schemas, relationships, and database queries.
* JWT: Implementing token-based authentication.
* bcryptjs: Securing user passwords through hashing.
* CRUD: Managing bills and expense records.
* Group Management: Handling groups, members, and shared expenses.
* Bill Splitting: Implementing equal and percentage-based calculations.
* REST API Integration: Connecting mobile and backend applications.
* Full-Stack Development: Combining mobile, backend, authentication, and database technologies.

⸻

🚀 How to Run

Prerequisites

Make sure the following are installed:

* Node.js
* npm
* React Native CLI environment
* Android Studio
* Android SDK
* MongoDB
* JDK

For iOS development, macOS with Xcode is required.

1. Clone the Repository

git clone <repository-url>
cd ExpenseTracker

2. Install Mobile Dependencies

npm install

3. Install Backend Dependencies

cd backend
npm install

4. Configure Environment Variables

Create a .env file inside the backend directory:

PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

5. Start the Backend

npm run dev

The API will run on the configured backend port.

6. Start Metro

Open another terminal and return to the React Native project root:

cd ..
npm start

7. Run Android

Open another terminal:

npm run android

Or:

npx react-native run-android

8. Run iOS

For macOS:

cd ios
pod install
cd ..
npm run ios

Or:

npx react-native run-ios

Note: This project uses React Native CLI and does not use Expo.

⸻

📁 Project Structure

ExpenseTracker/
│
├── android/
├── ios/
├── src/
│   ├── components/
│   ├── navigation/
│   ├── screens/
│   ├── redux/
│   ├── services/
│   └── utils/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── .env
│
├── package.json
└── README.md

⸻

📱 Application Modules

Authentication
      │
      ▼
Dashboard
      │
 ┌────┼─────────────┐
 ▼    ▼             ▼
Bills Expenses    Groups
                    │
                    ▼
              Group Members
                    │
                    ▼
              Group Expenses
                    │
             ┌──────┴──────┐
             ▼             ▼
         Equal Split   Percentage Split

⸻

📄 Project Purpose

This project demonstrates how to develop a full-stack expense and bill management application using React Native CLI, Node.js, Express.js, MongoDB, and Mongoose.

It provides practical experience with authentication, CRUD operations, REST APIs, database management, Redux state management, group expenses, and bill-splitting logic.

The project is built as a portfolio application to demonstrate real-world mobile and backend development skills through a practical financial management use case.

⸻

🔮 Future Improvements

* 💳 Payment integration
* 🔔 Expense notifications
* 📈 Expense analytics and charts
* 📅 Monthly and yearly reports
* 💱 Multiple currency support
* 📤 Export expenses as PDF/CSV
* 🔄 Expense settlement tracking
* 🌐 Cloud deployment
* 🌓 Dark mode

⸻

👨‍💻 Project Type

Portfolio Project — Full-Stack Mobile Application

React Native CLI • Redux • Node.js • Express.js • MongoDB • Mongoose • JWT • bcryptjs • Axios
