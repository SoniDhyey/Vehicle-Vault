import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const { register, handleSubmit, watch, trigger } = useForm({
    defaultValues: { role: "", firstName: "", lastName: "", email: "", phone: "" },
  });

  const password = watch("password");
  const selectedRole = watch("role");
  const phoneValue = watch("phone");

  const handleAuthSuccess = (res) => {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.data));
    if (res.data.data.role === "seller") navigate("/seller/dashboard");
    else navigate("/user/dashboard");
    window.location.reload();
  };

  const handleGoogleResponse = async (credentialResponse) => {
    const isRoleValid = await trigger("role");
    const isPhoneValid = await trigger("phone");

    if (!isRoleValid || !isPhoneValid) {
      toast.error("Please select Account Type and enter Phone first!");
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/user/google-signup`, {
        token: credentialResponse.credential,
        role: selectedRole,
        phone: phoneValue,
      });
      if (res.status === 201 || res.status === 200) {
        toast.success("Google Signup Successful!");
        handleAuthSuccess(res);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Google Signup failed");
    }
  };

  const submitHandler = async (formData) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/user/register`, formData);
      if (res.status === 201 || res.status === 200) {
        toast.success("Account created successfully!");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FBFCFE] font-sans select-none">
      {/* Left Side Branding */}
      <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop" 
          className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-[12s]" 
          alt="Clean Car" 
        />
        <div className="absolute bottom-16 left-16 text-white z-10">
          <h1 className="text-5xl font-black tracking-tighter">Join the Vault</h1>
          <p className="text-blue-50 mt-3 text-lg font-medium opacity-90 max-w-md">
            The unified ecosystem for automotive transparency.
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-10 bg-white overflow-y-auto py-12">
        <div className="w-full max-w-lg">
          <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">Create Account</h2>

          {/* Google Signup Button */}
          <div className="w-full flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleResponse}
              onError={() => toast.error("Google Signup Failed")}
              text="signup_with"
              shape="pill"
              theme="outline"
              size="large"
              width="380"
            />
          </div>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="mx-4 text-gray-400 text-xs font-black uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">First Name</label>
                <input type="text" placeholder="John" className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500" {...register("firstName", { required: true })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Last Name</label>
                <input type="text" placeholder="Doe" className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500" {...register("lastName", { required: true })} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Account Type</label>
              <select className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500" {...register("role", { required: true })}>
                <option value="">Select Role</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
              <input type="tel" placeholder="+91 00000 00000" className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500" {...register("phone", { required: true })} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
              <input type="email" placeholder="name@example.com" className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500" {...register("email", { required: true })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                <input type="password" placeholder="••••••••" className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500" {...register("password", { required: true })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Confirm</label>
                <input type="password" placeholder="••••••••" className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500" {...register("confirmPassword", { validate: (v) => v === password })} />
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black text-lg shadow-xl mt-4 transition-all">
              Create My Account
            </button>
          </form>

          <p className="text-center mt-10 text-gray-500 text-sm">
            Already a member? <button onClick={() => navigate("/login")} className="text-blue-600 font-black hover:underline">Log In</button>
          </p>
        </div>
      </div>
    </div>
  );
}