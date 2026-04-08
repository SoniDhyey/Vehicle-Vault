import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPaperPlane, FaMoneyBillWave } from "react-icons/fa";

const SendOffer = ({ vehicleId, vehiclePrice, onClose }) => {
  const [offeredPrice, setOfferedPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOffer = async (e) => {
    e.preventDefault();
    
    // 1. Validate Input
    if (!offeredPrice || Number(offeredPrice) <= 0) {
      return toast.error("Please enter a valid price");
    }

    setLoading(true);
    try {
      // 2. Retrieve Auth Data
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      // Check if user is actually logged in
      if (!token || !userStr) {
        toast.error("Please login to send an offer");
        return;
      }

      const user = JSON.parse(userStr);

      // 3. Prepare Data (Ensuring offered_price is a Number)
      const offerData = {
        buyer_id: user._id,
        vehicle_id: vehicleId,
        offered_price: Number(offeredPrice), 
      };

      // 4. API Call
      const response = await axios.post(
        "http://localhost:3000/offer/makeoffer", 
        offerData, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      // 5. Success Handling
      if (response.data) {
        toast.success("Offer sent to seller!");
        setTimeout(() => {
           if (onClose) onClose();
        }, 1500);
      }
      
    } catch (err) {
      // 6. Detailed Error Logging
      console.error("Offer Error:", err.response?.data);
      const errorMessage = err.response?.data?.message || "Server connection failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl">
      <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2 uppercase tracking-tight">
        <FaMoneyBillWave className="text-emerald-500" /> Make an Offer
      </h3>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
        Listed Price: <span className="text-slate-900">₹{vehiclePrice?.toLocaleString()}</span>
      </p>

      <form onSubmit={handleSendOffer} className="space-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Offer (₹)</label>
          <input
            type="number"
            className="p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-900"
            placeholder="e.g. 1500000"
            value={offeredPrice}
            onChange={(e) => setOfferedPrice(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20 disabled:bg-slate-300 disabled:shadow-none"
        >
          <FaPaperPlane size={14} /> {loading ? "Processing..." : "Send Offer"}
        </button>
      </form>
    </div>
  );
};

export default SendOffer;