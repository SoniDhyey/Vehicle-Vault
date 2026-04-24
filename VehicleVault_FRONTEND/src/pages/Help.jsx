import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Help = () => {
  const [form, setForm] = useState({
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Using relative path works because of axios.defaults.baseURL in App.js
      await axios.post("/help", form);
      
      toast.success("Query sent successfully 🚀");

      setForm({
        email: "",
        message: "",
      });
    } catch (err) {
      // Pulling specific error message from backend if available
      const errorMessage = err.response?.data?.message || "Error sending query";
      toast.error(errorMessage);
      console.error("Help form error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-400 select-none">
            Help & Support 🛠
          </h2>
          <p className="text-gray-400 text-xs mt-1 uppercase tracking-tighter">Vehicle Vault Assistance</p>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-black/40 border border-gray-600 focus:border-amber-500 focus:outline-none transition-colors"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Issue Description</label>
          <textarea
            name="message"
            placeholder="Describe your issue or question..."
            value={form.message}
            onChange={handleChange}
            className="w-full p-3 rounded bg-black/40 border border-gray-600 h-32 focus:border-amber-500 focus:outline-none resize-none transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 py-3 rounded-lg font-black uppercase text-xs tracking-[2px] hover:bg-amber-600 transition-all active:scale-95 shadow-lg shadow-amber-900/20"
        >
          Send Query
        </button>
      </form>
    </div>
  );
};

export default Help;