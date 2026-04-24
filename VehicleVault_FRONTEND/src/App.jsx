import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import AppRouter from './router/AppRouter'
import { ToastContainer, Zoom } from 'react-toastify'
import axios from 'axios'
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  // Use the environment variable for the base URL, fallback to Render if not set
  const API_URL = import.meta.env.VITE_API_URL || "https://vehicle-vault-backend.onrender.com";
  
  axios.defaults.baseURL = API_URL;
  axios.defaults.withCredentials = true;

  return (
    <GoogleOAuthProvider clientId="306528138144-i4uft8dqokuqgavd8egpafi3on1p259g.apps.googleusercontent.com">
      <>
        <AppRouter />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Zoom}
        />
      </>
    </GoogleOAuthProvider>
  )
}

export default App;