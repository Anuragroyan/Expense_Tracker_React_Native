import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import expenseReducer from './slices/expenseSlice';
import billReducer from './slices/billSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    bills: billReducer,
  },
});

export default store;