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

  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm({
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

  return (
    <div className="min-h-screen flex bg-[#FBFCFE] font-sans select-none">
      <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop" className="object-cover w-full h-full" alt="Car" />
        <div className="absolute bottom-16 left-16 text-white z-10">
          <h1 className="text-5xl font-black">Join the Vault</h1>
        </div>
      </div>

      <div className="flex items-center justify-center w-full md:w-1/2 px-10 bg-white overflow-y-auto py-12">
        <div className="w-full max-w-lg">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-8">Create Account</h2>

          <div className="w-full flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleResponse}
              onError={() => toast.error("Google Signup Failed")}
              text="signup_with" // Sets button to "Sign up with Google"
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

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="w-full p-3.5 bg-gray-50 rounded-xl border" {...register("firstName", { required: true })} />
              <input type="text" placeholder="Last Name" className="w-full p-3.5 bg-gray-50 rounded-xl border" {...register("lastName", { required: true })} />
            </div>
            <select className="w-full p-3.5 bg-gray-50 rounded-xl border" {...register("role", { required: true })}>
              <option value="">Select Role</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
            <input type="tel" placeholder="Phone Number" className="w-full p-3.5 bg-gray-50 rounded-xl border" {...register("phone", { required: true })} />
            <input type="email" placeholder="Email" className="w-full p-3.5 bg-gray-50 rounded-xl border" {...register("email", { required: true })} />
            <div className="grid grid-cols-2 gap-4">
              <input type="password" placeholder="Password" className="w-full p-3.5 bg-gray-50 rounded-xl border" {...register("password", { required: true })} />
              <input type="password" placeholder="Confirm" className="w-full p-3.5 bg-gray-50 rounded-xl border" {...register("confirmPassword", { validate: (v) => v === password })} />
            </div>
            <button className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-lg mt-4">Create My Account</button>
          </form>

          <p className="text-center mt-8 text-gray-500 text-sm">
            Already a member? <button onClick={() => navigate("/login")} className="text-blue-600 font-black">Log In</button>
          </p>
        </div>
      </div>
    </div>
  );
}