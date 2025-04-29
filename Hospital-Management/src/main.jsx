import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store, { persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { setAuthToken } from "./api/axios";

// Initialize auth token when store is ready
const onBeforeLift = () => {
  const { token } = store.getState().auth;
  setAuthToken(token);
};

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate 
      loading={null} 
      persistor={persistor}
      onBeforeLift={onBeforeLift}
    >
      <ToastContainer />
      <App />
    </PersistGate>
  </Provider>
);
