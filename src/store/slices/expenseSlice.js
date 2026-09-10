import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  createExpense as createExpenseApi,
  getExpenses as getExpensesApi,
  getRecentExpenses as getRecentExpensesApi,
  updateExpense as updateExpenseApi,
  deleteExpense as deleteExpenseApi,
} from '../../services/expenseService';

// GET ALL
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getExpensesApi();

      return data.expenses || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to fetch expenses',
      );
    }
  },
);

// GET RECENT
export const fetchRecentExpenses = createAsyncThunk(
  'expenses/fetchRecentExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getRecentExpensesApi();

      return data.expenses || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to fetch recent expenses',
      );
    }
  },
);

// CREATE
export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const data =
        await createExpenseApi(expenseData);

      return data.expense || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to add expense',
      );
    }
  },
);

// UPDATE
export const editExpense = createAsyncThunk(
  'expenses/editExpense',
  async (
    { id, expenseData },
    { rejectWithValue },
  ) => {
    try {
      const data = await updateExpenseApi(
        id,
        expenseData,
      );

      return data.expense || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to update expense',
      );
    }
  },
);

// DELETE
export const removeExpense = createAsyncThunk(
  'expenses/removeExpense',
  async (id, { rejectWithValue }) => {
    try {
      await deleteExpenseApi(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to delete expense',
      );
    }
  },
);

const initialState = {
  expenses: [],
  recentExpenses: [],
  loading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: 'expenses',

  initialState,

  reducers: {
    clearExpenseError: state => {
      state.error = null;
    },
  },

  extraReducers: builder => {
    // FETCH ALL
    builder
      .addCase(fetchExpenses.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })

      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FETCH RECENT
    builder
      .addCase(fetchRecentExpenses.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchRecentExpenses.fulfilled,
        (state, action) => {
          state.loading = false;
          state.recentExpenses = action.payload;
        },
      )

      .addCase(
        fetchRecentExpenses.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );

    // ADD
    builder
      .addCase(addExpense.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;

        state.expenses.unshift(action.payload);

        state.recentExpenses.unshift(
          action.payload,
        );
      })

      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // EDIT
    builder
      .addCase(editExpense.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(editExpense.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.expenses.findIndex(
          expense => expense._id === action.payload._id,
        );

        if (index !== -1) {
          state.expenses[index] = action.payload;
        }

        const recentIndex =
          state.recentExpenses.findIndex(
            expense =>
              expense._id === action.payload._id,
          );

        if (recentIndex !== -1) {
          state.recentExpenses[recentIndex] =
            action.payload;
        }
      })

      .addCase(editExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // DELETE
    builder
      .addCase(removeExpense.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeExpense.fulfilled, (state, action) => {
        state.loading = false;

        state.expenses = state.expenses.filter(
          expense => expense._id !== action.payload,
        );

        state.recentExpenses =
          state.recentExpenses.filter(
            expense => expense._id !== action.payload,
          );
      })

      .addCase(removeExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearExpenseError,
} = expenseSlice.actions;

export default expenseSlice.reducer;