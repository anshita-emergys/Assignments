import { createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '@src/api/axios';

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await instance.post("/user/login", credentials);
      return {
        token: response.data.token,
        adminMessage: response.data.admin_message,
        doctorMessage: response.data.doctor_message,
        superAdmin: response.data.superAdmin_message
      };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.post('user/register', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (data, { rejectWithValue }) => {
      try {
        const response = await instance.put('/user/updateUser', data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await instance.delete(`/user/deleteUser/${userId}`);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async ( rejectWithValue ) => {
    try {
      const response = await instance.get(`/user/getUser`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response=  await instance.post('/user/forgotPassword', { email });
      return response.data.data.hashOtp;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      await instance.put('/user/resetPassword', { email, newPassword });
    
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
