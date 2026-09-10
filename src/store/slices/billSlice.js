import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {
  createBill as createBillApi,
  getBills as getBillsApi,
  getBillById as getBillByIdApi,
  updateBill as updateBillApi,
  deleteBill as deleteBillApi,
} from '../../services/billService';

// ======================================================
// GET ALL BILLS
// ======================================================

export const fetchBills = createAsyncThunk(
  'bills/fetchBills',
  async (_, {rejectWithValue}) => {
    try {
      const data = await getBillsApi();

      return data.bills || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch bills',
      );
    }
  },
);

// ======================================================
// GET SINGLE BILL
// ======================================================

export const fetchBillById = createAsyncThunk(
  'bills/fetchBillById',
  async (id, {rejectWithValue}) => {
    try {
      const data = await getBillByIdApi(id);

      return data.bill || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch bill',
      );
    }
  },
);

// ======================================================
// CREATE BILL
// ======================================================

export const addBill = createAsyncThunk(
  'bills/addBill',
  async (billData, {rejectWithValue}) => {
    try {
      console.log(
        '========== CREATE BILL =========='
      );

      console.log(
        'BILL DATA:',
        JSON.stringify(billData, null, 2),
      );

      const data = await createBillApi(billData);

      console.log(
        'CREATE BILL RESPONSE:',
        JSON.stringify(data, null, 2),
      );

      return data.bill || data;
    } catch (error) {
      console.log(
        '========== CREATE BILL ERROR =========='
      );

      console.log(
        'ERROR:',
        error,
      );

      console.log(
        'ERROR MESSAGE:',
        error.message,
      );

      console.log(
        'ERROR STATUS:',
        error.response?.status,
      );

      console.log(
        'ERROR RESPONSE:',
        error.response?.data,
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Failed to create bill',
      );
    }
  },
);

// ======================================================
// UPDATE BILL
// ======================================================

export const editBill = createAsyncThunk(
  'bills/editBill',
  async (
    {id, billData},
    {rejectWithValue},
  ) => {
    try {
      const data = await updateBillApi(
        id,
        billData,
      );

      return data.bill || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Failed to update bill',
      );
    }
  },
);

// ======================================================
// DELETE BILL
// ======================================================

export const removeBill = createAsyncThunk(
  'bills/removeBill',
  async (id, {rejectWithValue}) => {
    try {
      await deleteBillApi(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Failed to delete bill',
      );
    }
  },
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  bills: [],
  selectedBill: null,
  loading: false,
  error: null,
};

// ======================================================
// SLICE
// ======================================================

const billSlice = createSlice({
  name: 'bills',

  initialState,

  reducers: {
    clearBillError: state => {
      state.error = null;
    },

    clearSelectedBill: state => {
      state.selectedBill = null;
    },
  },

  extraReducers: builder => {
    // ==================================================
    // FETCH BILLS
    // ==================================================

    builder
      .addCase(
        fetchBills.pending,
        state => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchBills.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          state.bills =
            Array.isArray(action.payload)
              ? action.payload
              : [];
        },
      )

      .addCase(
        fetchBills.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            'Failed to fetch bills';
        },
      );

    // ==================================================
    // FETCH SINGLE BILL
    // ==================================================

    builder
      .addCase(
        fetchBillById.pending,
        state => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchBillById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          state.selectedBill =
            action.payload;
        },
      )

      .addCase(
        fetchBillById.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            'Failed to fetch bill';
        },
      );

    // ==================================================
    // ADD BILL
    // ==================================================

    builder
      .addCase(
        addBill.pending,
        state => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        addBill.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          if (action.payload) {
            state.bills.unshift(
              action.payload,
            );
          }
        },
      )

      .addCase(
        addBill.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            'Failed to create bill';
        },
      );

    // ==================================================
    // EDIT BILL
    // ==================================================

    builder
      .addCase(
        editBill.pending,
        state => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        editBill.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          const index =
            state.bills.findIndex(
              bill =>
                bill._id ===
                action.payload?._id,
            );

          if (index !== -1) {
            state.bills[index] =
              action.payload;
          }

          if (
            state.selectedBill?._id ===
            action.payload?._id
          ) {
            state.selectedBill =
              action.payload;
          }
        },
      )

      .addCase(
        editBill.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            'Failed to update bill';
        },
      );

    // ==================================================
    // DELETE BILL
    // ==================================================

    builder
      .addCase(
        removeBill.pending,
        state => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        removeBill.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          state.bills =
            state.bills.filter(
              bill =>
                bill._id !==
                action.payload,
            );

          if (
            state.selectedBill?._id ===
            action.payload
          ) {
            state.selectedBill = null;
          }
        },
      )

      .addCase(
        removeBill.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            'Failed to delete bill';
        },
      );
  },
});

// ======================================================
// ACTIONS
// ======================================================

export const {
  clearBillError,
  clearSelectedBill,
} = billSlice.actions;

// ======================================================
// REDUCER
// ======================================================

export default billSlice.reducer;