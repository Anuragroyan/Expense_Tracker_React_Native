import api from './api';

// CREATE EXPENSE
export const createExpense = async expenseData => {
  const response = await api.post(
    '/expenses',
    expenseData,
  );

  return response.data;
};

// GET ALL EXPENSES
export const getExpenses = async () => {
  const response = await api.get('/expenses');

  return response.data;
};

// GET RECENT EXPENSES
export const getRecentExpenses = async () => {
  const response = await api.get('/expenses/recent');

  return response.data;
};

// UPDATE EXPENSE
export const updateExpense = async (id, expenseData) => {
  const response = await api.put(
    `/expenses/${id}`,
    expenseData,
  );

  return response.data;
};

// DELETE EXPENSE
export const deleteExpense = async id => {
  const response = await api.delete(
    `/expenses/${id}`,
  );

  return response.data;
};