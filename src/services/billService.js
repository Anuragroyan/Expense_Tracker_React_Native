import api from './api';

// ======================================================
// NOTE
// ======================================================
// Assumes your billRoutes.js is mounted like:
//   app.use('/api/bills', billRoutes);
// and that `api` (your common axios instance) already has
// the base URL + auth token header configured.
// If your routes are mounted under a different path,
// change BASE_PATH below to match.
// ======================================================

const BASE_PATH = '/bills';

// ======================================================
// CREATE BILL
// ======================================================

export const createBill = async billData => {
  const response = await api.post(
    BASE_PATH,
    billData,
  );

  return response.data;
};

// ======================================================
// GET ALL BILLS
// ======================================================

export const getBills = async () => {
  const response = await api.get(
    BASE_PATH,
  );

  return response.data;
};

// ======================================================
// GET SINGLE BILL
// ======================================================

export const getBillById = async id => {
  const response = await api.get(
    `${BASE_PATH}/${id}`,
  );

  return response.data;
};

// ======================================================
// UPDATE BILL
// ======================================================

export const updateBill = async (
  id,
  billData,
) => {
  const response = await api.put(
    `${BASE_PATH}/${id}`,
    billData,
  );

  return response.data;
};

// ======================================================
// DELETE BILL
// ======================================================

export const deleteBill = async id => {
  const response = await api.delete(
    `${BASE_PATH}/${id}`,
  );

  return response.data;
};