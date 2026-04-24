import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // ADD THIS LINE:
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const submitHandler = async (data) => {
    try {
      // FIX THIS LINE: Added BACKEND_URL
      const res = await axios.post(`${BACKEND_URL}/user/forgot-password`, data);
      if (res.status === 200) {
        toast.success("Reset link sent to your email!");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFCFE] font-sans px-6">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Reset Password</h2>
        <p className="text-gray-500 mb-8 font-medium">Enter your email to receive a reset link.</p>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email.message}</p>}
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black text-lg transition-all shadow-xl">
            Send Reset Link
          </button>
        </form>

        <button 
          onClick={() => navigate("/login")}
          className="w-full mt-6 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}