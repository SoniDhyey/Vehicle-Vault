import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaHistory, FaCalendarAlt } from "react-icons/fa";

const SellerOffer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to access offers.");
        return;
      }

      // Use dynamic API_URL
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
      // Use dynamic API_URL
      await axios.put(`${API_URL}/offer/updateoffer/${id}`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Offer marked as ${status}`);
      fetchOffers(); 
    } catch (err) {
      toast.error("Failed to update offer status");
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-500">Syncing with the Vault...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-10 text-slate-900 leading-tight">Incoming Offers</h1>

        {offers.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center shadow-sm">
            <FaHistory className="mx-auto text-slate-300 text-4xl mb-4" />
            <p className="text-slate-400 font-bold">No active offers for your vehicles.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {offers.map((offer) => (
              <div 
                key={offer._id} 
                className="bg-white border-l-4 border-l-blue-500 p-6 rounded-2xl shadow-md border-y border-r border-slate-100 flex flex-col md:flex-row md:items-center gap-6 relative"
              >
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <FaCalendarAlt className="text-blue-500" />
                  {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }) : "N/A"}
                </div>

                <div className="flex-1 md:border-r md:border-slate-100 md:pr-6">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                    Vehicle
                  </span>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-1">
                    {offer.vehicle_id?.make || "Unknown"} {offer.vehicle_id?.model || "Model"}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    {offer.vehicle_id?.year || "Year"} • {offer.vehicle_id?.fuelType || "Fuel"}
                  </p>
                </div>

                <div className="md:border-r md:border-slate-100 md:px-6 md:text-center flex-1">
                   <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Buyer's Offer</p>
                  <p className="text-3xl font-black text-emerald-600 tracking-tighter">
                    ₹{offer.offered_price?.toLocaleString('en-IN')}
                  </p>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">
                     STATUS: <span className="text-blue-600 uppercase">{offer.status}</span>
                   </p>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="text-sm space-y-1">
                    <p className="text-slate-600 font-medium">Buyer: <span className="font-bold text-slate-900">{offer.buyer_id?.firstName} {offer.buyer_id?.lastName}</span></p>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs text-slate-500">📧 {offer.buyer_id?.email || "N/A"}</p>
                      <p className="text-xs text-slate-500">📞 {offer.buyer_id?.phone || "N/A"}</p>
                    </div>
                  </div>

                  {offer.status === "Pending" && (
                    <div className="flex gap-2.5 pt-1">
                      <button 
                        onClick={() => handleAction(offer._id, "Accepted")}
                        className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition flex items-center gap-2"
                      >
                        <FaCheck /> Accept
                      </button>
                      <button 
                        onClick={() => handleAction(offer._id, "Rejected")}
                        className="bg-white border border-red-200 text-red-500 px-5 py-2.5 rounded-xl font-bold hover:bg-red-50 transition flex items-center gap-2"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
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