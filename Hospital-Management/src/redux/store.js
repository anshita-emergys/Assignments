import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@redux/slices/authSlice";
import adminReducer from "@redux/slices/adminSlice";
import patientReducer from "@redux/slices/patientsSlice";
import appointmentReducer from '@redux/slices/appointmentSlice'

import { encryptData, decryptData, setAuthToken } from "@src/api/axios";

const authPersistConfig = {
  key: "auth",
  storage,
  transforms: [
    {
      in: (state) => {
        if (state?.token) {
          return {
            ...state,
            token: encryptData(state.token),
          };
        }
        return state;
      },
      out: (state) => {
        if (state?.token) {
          const decryptedToken = decryptData(state.token);
          setAuthToken(decryptedToken);
          return {
            ...state,
            token: decryptedToken,
          };
        }
        return state;
      },
    },
  ],
};

const patientPersistConfig = {
  key: "patient",
  storage,
  blacklist: ["patients"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  admin: adminReducer,
  patient: persistReducer(patientPersistConfig, patientReducer),
  appointment : appointmentReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
