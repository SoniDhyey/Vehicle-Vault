import { GoogleOAuthProvider } from '@react-oauth/google'
import axios from 'axios'
import AppRouter from './router/AppRouter'
import { ToastContainer, Zoom } from 'react-toastify'

function App() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  
  axios.defaults.baseURL = API_URL;
  axios.defaults.withCredentials = true;

  return (
    // Ensure Client ID matches exactly with Google Console screenshot
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
  )
}

export default App;