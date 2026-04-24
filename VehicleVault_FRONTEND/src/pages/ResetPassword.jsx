import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();
  const password = watch("password");

  // ADD THIS LINE:
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const onSubmit = async (data) => {
    try {
      // FIX THIS LINE: Added BACKEND_URL
      const res = await axios.post(`${BACKEND_URL}/user/reset-password/${token}`, { password: data.password });
      toast.success(res.data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFCFE] font-sans px-6">
      <form onSubmit={handleSubmit(onSubmit)} className="p-10 bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Set New Password</h2>
        <p className="text-gray-500 mb-8 font-medium">Choose a secure password for your vault.</p>
        
        <div className="space-y-4">
          <input 
            type="password" 
            placeholder="New Password" 
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all"
            {...register("password", { required: true })}
          />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all"
            {...register("confirmPassword", { 
              validate: value => value === password || "Passwords do not match" 
            })}
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black text-lg transition-all shadow-xl mt-2">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}