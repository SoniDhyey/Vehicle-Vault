import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const SendInquiry = () => {
  const { vehicleId } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const inquiryData = {
        buyer_id: user._id,
        vehicle_id: vehicleId,
        message: message,
      };

      const res = await axios.post("http://localhost:3000/inquiry/sendinquiry", inquiryData);
      alert(res.data.message);
      navigate("/user/my-inquiries"); // Redirect to history
    } catch (err) {
      console.error("Inquiry Error:", err);
      alert("Failed to send inquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black mb-6 text-slate-900">Ask the Seller</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border shadow-sm">
        <label className="block text-sm font-bold text-slate-700 mb-2">Your Message</label>
        <textarea
          required
          rows="5"
          className="w-full p-4 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Type your question about the vehicle here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Inquiry"}
        </button>
      </form>
    </div>
  );
};

export default SendInquiry;