import React from 'react';

import {
  Text,
} from 'react-native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import RecentExpensesScreen from '../screens/Expenses/RecentExpensesScreen';
import AllExpensesScreen from '../screens/Expenses/AllExpensesScreen';
import ManageExpenseScreen from '../screens/Expenses/ManageExpenseScreen';

import BillListScreen from '../screens/Bills/BillListScreen';
import ManageBillScreen from '../screens/Bills/ManageBillScreen';
import BillDetailsScreen from '../screens/Bills/BillDetailsScreen';

import ChatbotScreen from '../screens/Chatbot/ChatbotScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

import colors from '../constants/colors';

const Tab = createBottomTabNavigator();
const ExpenseStack = createNativeStackNavigator();
const BillStack = createNativeStackNavigator();


// --------------------------------------------------
// EMOJI ICON
// --------------------------------------------------

const EmojiIcon = ({emoji}) => {
  return (
    <Text
      style={{
        fontSize: 22,
        lineHeight: 26,
      }}
    >
      {emoji}
    </Text>
  );
};


// --------------------------------------------------
// EXPENSE STACK
// --------------------------------------------------

const ExpenseNavigator = () => {
  return (
    <ExpenseStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <ExpenseStack.Screen
        name="RecentExpenses"
        component={RecentExpensesScreen}
      />

      <ExpenseStack.Screen
        name="AllExpenses"
        component={AllExpensesScreen}
      />

      <ExpenseStack.Screen
        name="ManageExpense"
        component={ManageExpenseScreen}
      />
    </ExpenseStack.Navigator>
  );
};


// --------------------------------------------------
// BILL STACK
// --------------------------------------------------

const BillNavigator = () => {
  return (
    <BillStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <BillStack.Screen
        name="BillList"
        component={BillListScreen}
      />

      <BillStack.Screen
        name="ManageBill"
        component={ManageBillScreen}
      />

      <BillStack.Screen
        name="BillDetails"
        component={BillDetailsScreen}
      />
    </BillStack.Navigator>
  );
};


// --------------------------------------------------
// MAIN APP NAVIGATOR
// --------------------------------------------------

const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Expenses"
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopColor: colors.primaryLight,
          height: 70,
          paddingBottom: 5,
          paddingTop: 5,
        },

        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.placeholder,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >

      {/* 💰 EXPENSES */}
      <Tab.Screen
        name="Expenses"
        component={ExpenseNavigator}
        options={{
          tabBarLabel: 'Expenses',

          tabBarIcon: () => (
            <EmojiIcon emoji="💰" />
          ),
        }}
      />

      {/* 🧾 BILLS */}
      <Tab.Screen
        name="Bills"
        component={BillNavigator}
        options={{
          tabBarLabel: 'Bills',

          tabBarIcon: () => (
            <EmojiIcon emoji="🧾" />
          ),
        }}
      />

      {/* 💡 HELP */}
      <Tab.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          tabBarLabel: 'Help',

          tabBarIcon: () => (
            <EmojiIcon emoji="💡" />
          ),
        }}
      />

      {/* 👤 PROFILE */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',

          tabBarIcon: () => (
            <EmojiIcon emoji="👤" />
          ),
        }}
      />

    </Tab.Navigator>
  );
};

export default AppNavigator;