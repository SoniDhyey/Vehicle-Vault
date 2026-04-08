import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (formData) => {
    try {
      const res = await axios.post("/user/login", formData);

      if (res.status === 200) {
        toast.success("Login successful");

        // ✅ Store token
        localStorage.setItem("token", res.data.token);

        // ✅ Normalize role from API response
        const role = res.data.role?.toLowerCase() || res.data.data?.role?.toLowerCase();

        // ✅ Save user data with confirmed role
        if (res.data.data) {
          const userData = {
            ...res.data.data,
            role: role,
          };
          localStorage.setItem("user", JSON.stringify(userData));
        }

        // ✅ Navigate based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "seller") {
          navigate("/seller/dashboard");
        } else {
          navigate("/user/dashboard");
        }

        // Force refresh ensures that stale states in the App are cleared
        window.location.reload();
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      toast.error(
        err.response?.data?.message || "Login failed. Please check credentials."
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 font-sans">
      
      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 h-screen relative">
        <img
          src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a"
          alt="parking"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute bottom-10 left-10 text-white z-10">
          <h1 className="text-4xl font-bold">🚗 Vehicle Vault</h1>
          <p className="text-gray-300 mt-2">
            Secure Vehicle Management System
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-6 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-white">
            
            <h2 className="text-3xl font-bold text-center mb-2">
              Welcome Back 👋
            </h2>

            <p className="text-gray-300 text-center mb-6 text-sm">
              Login to access your vault
            </p>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
              
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:border-blue-500"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:border-blue-500"
                  {...register("password", { required: "Password is required" })}
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}

              <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold transition-colors">
                Login
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}