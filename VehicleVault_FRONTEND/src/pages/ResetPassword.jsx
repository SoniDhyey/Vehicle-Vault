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

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`/user/reset-password/${token}`, { password: data.password });
      toast.success(res.data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-white rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Set New Password</h2>
        <input 
          type="password" 
          placeholder="New Password" 
          className="w-full p-3 border rounded-xl mb-4"
          {...register("password", { required: true })}
        />
        <input 
          type="password" 
          placeholder="Confirm Password" 
          className="w-full p-3 border rounded-xl mb-4"
          {...register("confirmPassword", { 
            validate: value => value === password || "Passwords do not match" 
          })}
        />
        <button className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold">
          Update Password
        </button>
      </form>
    </div>
  );
}