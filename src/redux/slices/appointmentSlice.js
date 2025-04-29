import { createSlice } from "@reduxjs/toolkit";
import { fetchAppointments } from "../thunks/admin";

const initialState = {
  appointmentRequests: [],
  status: "idle",
  error: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    updateAppointmentStatus: (state, action) => {
      const { appointment_id, status } = action.payload;
      const appointment = state.appointmentRequests.find(
        (app) => app.appointment_id === appointment_id
      );
      if (appointment) {
        appointment.status = status;
      }
    },
    approveAppointment: (state, action) => {
      const appointment = state.appointmentRequests.find(
        (app) => app.appointment_id === action.payload
      );
      if (appointment) {
        appointment.status = "Scheduled";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = "success";

        state.appointmentRequests = action.payload.data.appointments;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateAppointmentStatus, approveAppointment } =
  appointmentSlice.actions;
export default appointmentSlice.reducer;
