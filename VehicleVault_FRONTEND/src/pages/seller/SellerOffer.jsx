import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaHistory, FaCalendarAlt, FaFileContract } from "react-icons/fa";

const SellerOffer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  // ✅ Use dynamic API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // ✅ Ensure correct endpoint and Authorization header
      const res = await axios.get(`${API_URL}/offer/getoffers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOffers(res.data.data || []);
    } catch (err) {
      console.error("Offer Fetch Error:", err);
      toast.error("Failed to load incoming offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [API_URL]);

  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/offer/updateoffer/${id}`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Offer marked as ${status}`);
      fetchOffers(); // Refresh the list
    } catch (err) {
      toast.error("Failed to update offer status");
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-500 font-bold uppercase tracking-widest">Syncing with the Vault...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-10 text-slate-900 italic">Incoming <span className="text-blue-600">Offers</span></h1>

        {offers.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
            <FaHistory className="mx-auto text-slate-300 text-4xl mb-4" />
            <p className="text-slate-400 font-bold">No active offers for your vehicles.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {offers.map((offer) => (
              <div key={offer._id} className="bg-white border-l-8 border-l-blue-600 p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-8 relative overflow-hidden">
                
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <FaCalendarAlt className="text-blue-500" />
                  {new Date(offer.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </div>

                <div className="flex-1">
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Vehicle Unit</span>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">
                    {offer.vehicle_id?.make || "Unknown"} {offer.vehicle_id?.model || "Model"}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase">Ref: {offer.vehicle_id?.year} • {offer.vehicle_id?.fuelType}</p>
                </div>

                <div className="md:px-8 md:text-center flex-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bid Price</p>
                   <p className="text-4xl font-black text-emerald-600 tracking-tighter">₹{offer.offered_price?.toLocaleString('en-IN')}</p>
                   
                   {/* ✅ Correctly display the current state */}
                   {offer.status !== "Pending" && (
                    <div className={`inline-flex items-center gap-1.5 mt-2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${offer.status === "Accepted" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                       {offer.status === "Accepted" ? <FaCheck /> : <FaTimes />} {offer.status}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mb-1">Buyer Details</p>
                    <p className="font-black text-slate-800 text-sm">{offer.buyer_id?.firstName} {offer.buyer_id?.lastName}</p>
                    <p className="text-xs text-slate-500 font-medium">{offer.buyer_id?.email}</p>
                  </div>

                  {offer.status === "Pending" ? (
                    <div className="flex gap-3">
                      <button onClick={() => handleAction(offer._id, "Accepted")} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all active:scale-95">Accept</button>
                      <button onClick={() => handleAction(offer._id, "Rejected")} className="flex-1 bg-white border-2 border-rose-100 text-rose-500 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95">Reject</button>
                    </div>
                  ) : offer.status === "Accepted" && (
                    <button className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition active:scale-95">
                        <FaFileContract /> View Final Contract
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOffer;