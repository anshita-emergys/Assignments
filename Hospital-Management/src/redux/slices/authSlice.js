import { createSlice} from "@reduxjs/toolkit";
import { setAuthToken } from "@src/api/axios";
import { login } from "../thunks/user";

const initialState = {
  token: null,
  adminMessage: null,
  doctorMessage:null,
  superAdmin:null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateToken(state, action) {
      state.token = action.payload.newToken;
      state.adminMessage = action.payload.adminMessage;
      state.doctorMessage = action.payload.doctorMessage;
      state.superAdmin = action.payload.superAdmin
      setAuthToken(action.payload.newToken);
    },
    clearToken(state) {
      state.token = null;
      state.adminMessage = null;
      state.doctorMessage =null;
      state.superAdmin= null
      setAuthToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.adminMessage = action.payload.adminMessage;
        setAuthToken(action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        console.error("Login failed:", action.payload);
      });
  },
});

export const { updateToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
