import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import AppRouter from './router/AppRouter';
import { ToastContainer, Zoom } from 'react-toastify';

// ✅ Global Axios Setup
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

// ✅ Interceptor to attach token to every request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  return (
    <GoogleOAuthProvider clientId="306528138144-i4uft8dqokuqgavd8egpafi3on1p259g.apps.googleusercontent.com">
      <>
        <AppRouter />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          transition={Zoom}
          theme="colored"
        />
      </>
    </GoogleOAuthProvider>
  );
}

export default App;