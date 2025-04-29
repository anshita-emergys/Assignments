import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@src/api/axios";

const initialState = {
  adminPatients: [],
  pagination: { currentPage: 1, limit: 4, totalPages: 1 },
};

export const fetchAdminPatients = createAsyncThunk(
  "adminPatients/fetchAdminPatients",
  async (page, { rejectWithValue }) => {
    try {
      const response = await instance.get(
        `/admin/getAllInfo/?page=${page}&limit=4`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminPatientSlice = createSlice({
  name: "adminPatients",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminPatients.fulfilled, (state, action) => {
        state.adminPatients = action.payload.data;
        state.pagination.totalPages = Math.ceil(
          action.payload.pagination.totalPatients / 4
        );
      })
  },
});
export const { setCurrentPage } = adminPatientSlice.actions;
export default adminPatientSlice.reducer;
