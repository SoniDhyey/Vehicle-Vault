import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import AppRouter from './router/AppRouter'
import { ToastContainer, Zoom } from 'react-toastify'
//import './App.css'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)
    axios.defaults.baseURL = "http://localhost:3000"
  return (
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
  )
}

export default App