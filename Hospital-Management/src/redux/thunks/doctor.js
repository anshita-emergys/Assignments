import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@src/api/axios";

export const doctorAppointments = createAsyncThunk(
  "doctor/displayAppointments",
  async (rejectWithValue) => {
    try {
      const response = await instance.get(`/doctor/displayAppointments`);
      return response.data;
    } catch (error) {
      console.error(error);
      rejectWithValue(error.response.data.message);
    }
  }
);

export const getDoctor = createAsyncThunk(
  "doctor/doctor/getDoctorProfile",
  async (rejectWithValue) => {
    try {
      const response = await instance.get(`/doctor/getDoctorProfile`);
      return response.data;
    } catch (error) {
      console.error(error);
      rejectWithValue(error.response.data.message);
    }
  }
);

export const updateDoctor = createAsyncThunk(
  "doctor/updateDoctor",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.put("/doctor/updateDoctor", data);
      return response.data;
    } catch (error) {
      console.error(error);
      rejectWithValue(error.response.data.messagee);
    }
  }
);

export const addPrescription = createAsyncThunk(
  "doctor/addPrescription",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.post("/doctor/addPrescription", data);
      return response.data;
    } catch (error) {
      console.error(error);
      rejectWithValue(error.response.data.message);
    }
  }
);

export const updatePrescription = createAsyncThunk(
  "doctor/updatePrescription",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.put("/doctor/updatePrescription", data);
      return response.data;
    } catch (error) {
      console.error(error);
      rejectWithValue(error.response.data.message);
    }
  }
);
