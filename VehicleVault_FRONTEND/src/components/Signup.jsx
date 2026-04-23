import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";

export default function Signup() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Environment variable for API URL
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm({
    defaultValues: {
      role: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const password = watch("password");
  const selectedRole = watch("role");
  const phoneValue = watch("phone");

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

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const isRoleValid = await trigger("role");
      const isPhoneValid = await trigger("phone");

      if (!isRoleValid || !isPhoneValid) {
        toast.error("Please fill Phone and Role fields first!");
        return;
      }

      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const { email, given_name, family_name } = userInfo.data;

        const res = await axios.post(`${BACKEND_URL}/user/google-signup`, {
          email,
          firstName: given_name,
          lastName: family_name,
          role: selectedRole,
          phone: phoneValue,
        });

        if (res.status === 201 || res.status === 200) {
          toast.success("Account created successfully!");
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.data));
          
          if (res.data.role === "seller") navigate("/seller/dashboard");
          else navigate("/user/dashboard");
          
          window.location.reload();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Google Signup failed");
      }
    },
    onError: () => toast.error("Google Popup blocked or failed"),
  });

  return (
    <div className="min-h-screen flex bg-[#FBFCFE] font-sans select-none cursor-default">
      <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop"
          alt="Clean Car Aesthetic"
          className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-[12s]"
        />
        <div className="absolute inset-0 bg-blue-50/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        <div className="absolute bottom-16 left-16 text-white z-10">
          <h1 className="text-5xl font-black tracking-tighter">Join the Vault</h1>
          <p className="text-blue-50 mt-3 text-lg font-medium opacity-90 max-w-md">
            The unified ecosystem for automotive transparency and secure management.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center w-full md:w-1/2 px-10 bg-white overflow-y-auto py-12">
        <div className="w-full max-w-lg">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-8">
            Create Account
          </h2>

          <button
            type="button"
            onClick={() => handleGoogleSignup()}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 p-3.5 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm mb-6 cursor-pointer"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign up with Google
          </button>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs font-black uppercase tracking-widest">
              or
            </span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                  {...register("firstName", { required: "Required" })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                  {...register("lastName", { required: "Required" })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                Account Type
              </label>
              <div className="relative">
                <select
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer text-gray-600 font-medium"
                  {...register("role", { required: "Please select a role" })}
                >
                  <option value="" disabled hidden>Select Role</option>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
              </div>
              {errors.role && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.role.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                {...register("email", { required: "Email is required" })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 00000 00000"
                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                {...register("phone", { required: "Phone is required" })}
              />
              {errors.phone && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                    {...register("password", { required: "Password required" })}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-500">
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Confirm</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                    {...register("confirmPassword", {
                      required: "Please confirm",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                  />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-500">
                    {showConfirmPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.01] shadow-xl shadow-blue-100 mt-4 cursor-pointer">
              Create My Account
            </button>
          </form>

          <p className="text-center mt-8 text-gray-400 font-medium text-sm">
            Already a member?{" "}
            <button onClick={() => navigate("/login")} className="text-blue-600 font-black hover:underline cursor-pointer">Log In</button>
          </p>
        </div>
      </div>
    </div>
  );
}