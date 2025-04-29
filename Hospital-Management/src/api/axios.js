import axios from "axios";
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {},
});

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

const decryptData = (cryptData) => {
  const bytes = CryptoJS.AES.decrypt(cryptData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const initializeAuthToken = () => {
  try {
    const persistedAuth = localStorage.getItem("persist:auth");
    if (persistedAuth) {
      const authState = JSON.parse(persistedAuth);
      if (authState.token) {
        const encryptedToken = JSON.parse(authState.token);
        const token = decryptData(encryptedToken);
        instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const setAuthToken = (token) => {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

initializeAuthToken();
export { instance, setAuthToken, encryptData, decryptData };
