import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@src/api/axios";

export const fetchPatients = createAsyncThunk("patients/fetchPatients", async () => {
  try {
    const response = await instance.get("/patient/getPatientInfo");    
    return response.data;
  } catch (error) {
    console.error(error);
  }
});

export const getDiseaseInfo = createAsyncThunk(
  "patient/getDiseaseInfo",
  async (fetchId, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/patient/getDiseaseInfo/${fetchId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateDiseaseInfo = createAsyncThunk(
  "patient/updateDiseaseInfo",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await instance.put(
        "/patient/updateDiseaseInfo",
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addDiseaseInfo = createAsyncThunk(
  "patient/addDiseaseInfo",
  async (addPayload, { rejectWithValue }) => {
    try {
      const response = await instance.post(
        "/patient/addDiseaseInfo",
        addPayload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const uploadFile = createAsyncThunk(
  "patient/uploadFile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await instance.post("/patient/upload", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateDocument = createAsyncThunk(
  "patient/updateDocument",
  async (updatePayload, { rejectWithValue }) => {
    try {
      const response = await instance.put(
        "/patient/updateDocument",
        updatePayload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getFamilyInfo = createAsyncThunk(
  "patient/getFamilyInfo",
  async (fetchId, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/patient/getFamilyInfo/${fetchId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateFamilyInfo = createAsyncThunk(
  "patient/updateFamilyInfo",
  async (updatePayload, { rejectWithValue }) => {
    try {
      const response = await instance.put(
        "/patient/updateFamilyInfo",
        updatePayload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addFamilyInfo = createAsyncThunk(
  "patient/addFamilyInfo",
  async (addPayload, { rejectWithValue }) => {
    try {
      const response = await instance.post(
        "/patient/addFamilyInfo",
        addPayload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getPersonalInfo = createAsyncThunk(
  "patient/getPersonalInfo",
  async (fetchId, { rejectWithValue }) => {
    try {
      const response = await instance.get(
        `/patient/getPersonalInfo/${fetchId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updatePersonalInfo = createAsyncThunk(
  "patient/updatePersonalInfo",
  async (updatePayload, { rejectWithValue }) => {
    try {
      const response = await instance.put(
        "/patient/updatePersonalInfo",
        updatePayload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addPersonalInfo = createAsyncThunk(
  "patient/addPersonalInfo",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.post("/patient/addPersonalInfo", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getTimeSlots = createAsyncThunk(
  "patient/getTimeSlots",
  async ({ doctor_id, date }, { rejectWithValue }) => {
    try {
      const response = await instance.post(
        `/user/showAvailability?doctor_id=${doctor_id}`, {date: date}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const bookAppointment = createAsyncThunk(
  "patient/bookAppointment",
  async ({ patient_id, doctor_id, date, time }, { rejectWithValue }) => {
    try {
      const response = await instance.post("/user/bookAppointment", {
        patient_id,
        doctor_id,
        date,
        time: time + ':00'
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
