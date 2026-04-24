import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCar, FaArrowLeft } from "react-icons/fa";

const BookTestDrive = () => {
  // CRITICAL: This name must match the :variable in your App.js Route
  const { vehicleId } = useParams(); 
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [vehicleName, setVehicleName] = useState("Loading details...");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ 
    vehicle_id: vehicleId || "", 
    preferred_date: "", 
    preferred_time: "", 
    location: "" 
  });

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/vehicle/getvehicle/${vehicleId}`);
        if (res.data?.data) {
          setVehicleName(`${res.data.data.make} ${res.data.data.model}`);
        }
      } catch (err) {
        console.error("Error fetching vehicle:", err);
        setVehicleName("Vehicle selection confirmed");
      }
    };
    if (vehicleId) fetchVehicleDetails();
  }, [vehicleId, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please login again.");
        return;
      }

      const res = await axios.post(`${API_URL}/testdrive/booktestdrive`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success("Test drive request sent to the Vault!");
      navigate("/user/my-bookings");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error booking test drive");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-950 p-10 text-white relative">
          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors"
          >
            <FaArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <FaCar className="text-blue-500 text-2xl" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Official Protocol</span>
          </div>
          <h2 className="text-4xl font-black italic uppercase leading-tight">
            Book Test <span className="text-blue-600">Drive</span>
          </h2>
        </div>

        <div className="p-10">
          <div className="bg-slate-50 border-l-4 border-l-blue-600 p-5 rounded-r-2xl mb-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Asset in Focus</p>
            <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{vehicleName}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Date Input */}
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-blue-600 transition-colors">
                <FaCalendarAlt /> Preferred Date
              </label>
              <input 
                type="date" 
                required
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
              />
            </div>

            {/* Time Input */}
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-blue-600 transition-colors">
                <FaClock /> Preferred Time
              </label>
              <input 
                type="text" 
                placeholder="e.g. 11:30 AM"
                required
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                onChange={(e) => setForm({ ...form, preferred_time: e.target.value })}
              />
            </div>

            {/* Location Input */}
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-blue-600 transition-colors">
                <FaMapMarkerAlt /> Handover Location
              </label>
              <input 
                type="text" 
                placeholder="Enter full address for meeting"
                required
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Encrypting Request..." : "Secure My Slot"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookTestDrive;