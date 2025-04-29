import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@src/api/axios";

export const addAdmin = createAsyncThunk(
  "admin/addAdmin",
  async (addEmail, { rejectWithValue }) => {
    try {
      const response = await instance.put("/user/addAdmin", {
        email: addEmail,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      console.error(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const removeAdmin = createAsyncThunk(
  "admin/removeAdmin",
  async (removeEmail, { rejectWithValue }) => {
    try {
      const response = await instance.put("/admin/removeAdmin", {
        email: removeEmail,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getAgeGroup = createAsyncThunk(
  "admin/getAgeGroup",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/admin/getAgeGroup");
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deletePatientData = createAsyncThunk(
  "admin/deletePatientData",
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await instance.delete(
        `/admin/adminDeletePatientData?patient_id=${patientId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchDoctors = createAsyncThunk(
  "admin/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/user/getDoctors");
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteDoctor = createAsyncThunk(
  "admin/deleteDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await instance.delete(
        `/admin/deleteDoctor?doctor_id=${doctorId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addDoctor = createAsyncThunk(
  "admin/addDoctor",
  async (doctorData, { rejectWithValue }) => {
    try {
      const response = await instance.post(
        `/admin/addDoctor`,doctorData
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAppointments = createAsyncThunk(
  "admin/fetchAppointments",
  async (rejectWithValue) => {
    try {
      const response = await instance.get("/admin/appointments");
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const approveAdminAppointment = createAsyncThunk(
  "admin/approveAdminAppointment",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await instance.put(
        `/admin/approveAppoint?appointment_id=${appointmentId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const changeStatus = createAsyncThunk(
  "admin/changeStatus",
  async ({ appointmentId, status }, { rejectWithValue }) => {
    try {
      const response = await instance.put(
        `/admin/changeStatus?status=${status}&appointment_id=${appointmentId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);
// http://localhost:4000/api/admin/cancelledAppointment?appointment_id=1
export const cancelAppointment = createAsyncThunk(
  "admin/cancelAppointment",
  async ({appointmentId,reason} ,{ rejectWithValue }) => {
    try {
      const response = await instance.put(
        `/admin/cancelledAppointment?appointment_id=${appointmentId}`,{reason : reason}
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getEmailsForAdmin = createAsyncThunk(
  "admin/getEmailsForAdmin",
  async () => {
    try {
      const response = await instance.get("/admin/getEmailsForAdmin");
      return response.data;
    } catch (error) {
      console.error(error);
      return error.response.data.message;
    }
  }
);

export const getAdmin = createAsyncThunk("admin/getAdmin", async () => {
  try {
    const response = await instance.get("/admin/getAdmin");
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data.message;
  }
});

export const getEmailsForDoctor = createAsyncThunk(
  "admin/getEmailsForDoctor",
  async () => {
    try {
      const response = await instance.get("/admin/getEmailsForDoctor");
      return response.data;
    } catch (error) {
      console.error(error);
      return error.response.data.message;
    }
  }
);
