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
      // ✅ Use relative path. axios.defaults.baseURL from App.js handles the domain.
      await axios.post("/help", form);
      
      toast.success("Query sent successfully 🚀");

      setForm({
        email: "",
        message: "",
      });
    } catch (err) {
      // Check if there is a specific message from backend
      const errMsg = err.response?.data?.message || "Error sending query";
      toast.error(errMsg);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-amber-400 text-center select-none">
          Help & Support 🛠
        </h2>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
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
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Message</label>
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
          className="w-full bg-amber-500 py-3 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-amber-600 transition-all active:scale-95 shadow-lg shadow-amber-900/20"
        >
          Send Query
        </button>
      </form>
    </div>
  );
};

export default Help;