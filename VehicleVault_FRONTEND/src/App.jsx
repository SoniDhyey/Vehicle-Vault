import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import AppRouter from './router/AppRouter'
import { ToastContainer, Zoom } from 'react-toastify'
//import './App.css'
import axios from 'axios'
// 1. Import the Google Provider
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  const [count, setCount] = useState(0)
  axios.defaults.baseURL = "http://localhost:3000"

  return (
    // 2. Wrap everything in the Provider
    // PASTE YOUR CLIENT ID FROM GOOGLE CLOUD CONSOLE HERE
    <GoogleOAuthProvider clientId="306528138144-i4uft8dqokuqgavd8egpafi3on1p259g.apps.googleusercontent.com">
      <>
        <AppRouter></AppRouter>
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

export default App