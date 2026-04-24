import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const { register, handleSubmit } = useForm();

  const handleAuthSuccess = (res) => {
    localStorage.setItem("token", res.data.token);
    const role = res.data.role?.toLowerCase() || res.data.data?.role?.toLowerCase();
    if (res.data.data) localStorage.setItem("user", JSON.stringify({ ...res.data.data, role }));
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "seller") navigate("/seller/dashboard");
    else navigate("/user/dashboard");
    setTimeout(() => window.location.reload(), 100);
  };

  const handleGoogleResponse = async (credentialResponse) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/user/google-login`, {
        token: credentialResponse.credential,
      });
      if (res.status === 200) {
        toast.success("Google Login Successful");
        handleAuthSuccess(res);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Google Auth Failed");
    }
  };

  const submitHandler = async (formData) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/user/login`, formData);
      if (res.status === 200) {
        toast.success("Login successful");
        handleAuthSuccess(res);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FBFCFE] font-sans select-none">
      <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop" className="object-cover w-full h-full" alt="Car" />
        <div className="absolute bottom-16 left-16 text-white z-10">
          <h1 className="text-5xl font-black">Vehicle Vault</h1>
        </div>
      </div>

      <div className="flex items-center justify-center w-full md:w-1/2 px-10 bg-white">
        <div className="w-full max-w-md text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-8">Welcome Back</h2>

          <div className="w-full flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleResponse}
              onError={() => toast.error("Google Login Failed")}
              text="continue_with" // Sets button to "Continue with Google"
              shape="pill"
              theme="outline"
              size="large"
              width="380"
            />
          </div>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="mx-4 text-gray-400 text-xs font-black uppercase">or</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 text-left">
            <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50 rounded-2xl border" {...register("email", { required: true })} />
            <div className="relative">
              <input type={showPass ? "text" : "password"} placeholder="Password" className="w-full p-4 bg-gray-50 rounded-2xl border" {...register("password", { required: true })} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-4 text-gray-400">{showPass ? "🙈" : "👁️"}</button>
            </div>
            
            <div className="text-right">
              <button type="button" onClick={() => navigate("/forgot-password")} className="text-blue-600 text-xs font-bold hover:underline">Forgot Password?</button>
            </div>

            <button className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-lg shadow-xl mt-2">Login</button>
          </form>

          <p className="mt-10 text-gray-400 text-sm">
            Don't have an account? <button onClick={() => navigate("/signup")} className="text-blue-600 font-black">Create Account</button>
          </p>
        </div>
      </div>
    </div>
  );
}