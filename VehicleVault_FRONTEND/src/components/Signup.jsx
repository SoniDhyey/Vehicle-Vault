import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google"; // CHANGED: Use standard component

export default function Signup() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm({
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

  // NEW Google Handler: Sends token to your backend to handle verification
  const handleGoogleResponse = async (credentialResponse) => {
    const isRoleValid = await trigger("role");
    const isPhoneValid = await trigger("phone");

    if (!isRoleValid || !isPhoneValid) {
      toast.error("Please select Account Type and enter Phone first!");
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/user/google-signup`, {
        token: credentialResponse.credential, // Send the JWT token
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

  return (
    <div className="min-h-screen flex bg-[#FBFCFE] font-sans select-none">
      <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop"
          alt="Clean Car"
          className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-[12s]"
        />
        <div className="absolute bottom-16 left-16 text-white z-10">
          <h1 className="text-5xl font-black tracking-tighter">Join the Vault</h1>
          <p className="text-blue-50 mt-3 text-lg font-medium opacity-90 max-w-md">
            The unified ecosystem for automotive transparency.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center w-full md:w-1/2 px-10 bg-white overflow-y-auto py-12">
        <div className="w-full max-w-lg">
          <h2 className="text-4xl font-black text-gray-900 mb-8">Create Account</h2>

          {/* UPDATED: Google Login component avoids CORS preflight blocks */}
          <div className="w-full flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleResponse}
              onError={() => toast.error("Google Signup Failed")}
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="mx-4 text-gray-400 text-xs font-black uppercase">or</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500"
                  {...register("firstName", { required: "Required" })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500"
                  {...register("lastName", { required: "Required" })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Account Type</label>
              <select
                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500"
                {...register("role", { required: "Please select a role" })}
              >
                <option value="" disabled>Select Role</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 00000 00000"
                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500"
                {...register("phone", { required: "Phone is required" })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500"
                {...register("email", { required: "Email is required" })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Password</label>
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500"
                  {...register("password", { required: "Required" })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Confirm</label>
                <input
                  type={showConfirmPass ? "text" : "password"}
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500"
                  {...register("confirmPassword", {
                    validate: (v) => v === password || "No match",
                  })}
                />
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black text-lg shadow-xl mt-4">
              Create My Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}