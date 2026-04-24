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

  // This variable is critical to fix the "Connection Refused" error
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const onSubmit = async (data) => {
    try {
      // Using an absolute URL prevents the browser from guessing the wrong IP
      const res = await axios.post(`${BACKEND_URL}/user/reset-password/${token}`, { 
        password: data.password 
      });
      
      toast.success(res.data.message);
      navigate('/login');
    } catch (err) {
      // This will now catch and show if the server is actually reachable
      toast.error(err.response?.data?.message || "Connection to server failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFCFE] font-sans px-6">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Set New Password</h2>
        <p className="text-gray-500 mb-8 font-medium">Your link is verified. Enter a new password below.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all shadow-sm"
              {...register("password", { required: true })}
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all shadow-sm"
              {...register("confirmPassword", { 
                validate: value => value === password || "Passwords do not match" 
              })}
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black text-lg transition-all shadow-xl mt-4 active:scale-95">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}