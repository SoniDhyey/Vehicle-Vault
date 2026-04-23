import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  // Define your Render URL here for easy maintenance
   const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleAuthSuccess = (res) => {
    localStorage.setItem("token", res.data.token);
    const role = res.data.role?.toLowerCase() || res.data.data?.role?.toLowerCase();

    if (res.data.data) {
      const userData = { ...res.data.data, role: role };
      localStorage.setItem("user", JSON.stringify(userData));
    }

    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "seller") navigate("/seller/dashboard");
    else navigate("/user/dashboard");

    setTimeout(() => window.location.reload(), 100);
  };

  const submitHandler = async (formData) => {
    try {
      // UPDATED: Added full Render URL
      const res = await axios.post(`${BACKEND_URL}/user/login`, formData);
      if (res.status === 200) {
        toast.success("Login successful");
        handleAuthSuccess(res);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        // UPDATED: Added full Render URL
        const res = await axios.post(`${BACKEND_URL}/user/google-login`, {
          email: userInfo.data.email,
        });

        if (res.status === 200) {
          toast.success("Google Login Successful");
          handleAuthSuccess(res);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Google Auth Failed");
      }
    },
  });

  return (
    <div className="min-h-screen flex bg-[#FBFCFE] font-sans select-none">
      <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Car"
          className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-[10s]"
        />
        <div className="absolute inset-0 bg-blue-600/10"></div>
        <div className="absolute bottom-16 left-16 text-white z-10">
          <h1 className="text-5xl font-black tracking-tighter">Vehicle Vault</h1>
          <p className="text-blue-100 mt-3 text-lg font-medium opacity-90">
            The standard for automotive trust and transparency.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center w-full md:w-1/2 px-10 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-8 pt-4">
            Welcome Back
          </h2>

          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 p-3.5 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm mb-6 cursor-pointer"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" className="w-5 h-5"
            />
            Continue with Google
          </button>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="mx-4 text-gray-400 text-xs font-black uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                {...register("email", { required: "Email is required" })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                  {...register("password", { required: "Password is required" })}
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-blue-600"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button 
                type="button" 
                onClick={() => navigate("/forgot-password")}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.02] shadow-xl cursor-pointer">
              Login 
            </button>
          </form>

          <p className="text-center mt-12 text-gray-400 font-medium text-sm">
            Don't have an account?{" "}
            <button onClick={() => navigate("/signup")} className="text-blue-600 font-black hover:underline cursor-pointer">Create Account</button>
          </p>
        </div>
      </div>
    </div>
  );
}