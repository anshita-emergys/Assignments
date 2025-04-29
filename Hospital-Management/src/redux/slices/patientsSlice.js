import { createSlice } from "@reduxjs/toolkit";
import { fetchPatients } from "../thunks/patient";

const initialState = {
  patientId: null,
  patients: [],
  step: 1,
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    setPatientId(state, action) {
      state.patientId = action.payload;
    },
    setStep(state, action) {
      state.step = action.payload;
    },
    resetPatientState(state) {
      state.patientId = null;
      state.step = 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPatients.fulfilled, (state, action) => {
      state.patients = action.payload.data;
    });
  },
});
export const { setPatientId, setStep, resetPatientState } =
  patientSlice.actions;
export default patientSlice.reducer;
