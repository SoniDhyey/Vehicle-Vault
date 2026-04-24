import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaHistory, FaCalendarAlt } from "react-icons/fa";

const SellerOffer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      // ✅ Uses global axios config
      const res = await axios.get("/offer/getoffers");
      setOffers(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load incoming offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await axios.put(`/offer/updateoffer/${id}`, { status });
      toast.success(`Offer ${status} successfully`);
      fetchOffers(); 
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest">Scanning Offers...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-10 text-slate-900 italic">Incoming <span className="text-blue-600">Offers</span></h1>

        {offers.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center shadow-sm">
            <FaHistory className="mx-auto text-slate-200 text-5xl mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active offers found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {offers.map((offer) => (
              <div key={offer._id} className="bg-white border-l-8 border-l-blue-600 p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-4 py-2 bg-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  ID: {offer._id.slice(-6)}
                </div>

                <div className="flex-1">
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Vehicle Unit</span>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                    {offer.vehicle_id?.make} {offer.vehicle_id?.model}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-1">Ref: {offer.vehicle_id?.year} • {offer.vehicle_id?.fuelType}</p>
                </div>

                <div className="md:px-8 md:text-center border-l border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bid Price</p>
                  <p className="text-4xl font-black text-emerald-600 tracking-tighter">₹{offer.offered_price?.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mb-1">Buyer Details</p>
                    <p className="font-black text-slate-800 text-sm">{offer.buyer_id?.firstName} {offer.buyer_id?.lastName}</p>
                    <p className="text-xs text-slate-500 font-medium">{offer.buyer_id?.email}</p>
                  </div>

                  {offer.status === "Pending" && (
                    <div className="flex gap-3">
                      <button onClick={() => handleAction(offer._id, "Accepted")} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all active:scale-95">Accept</button>
                      <button onClick={() => handleAction(offer._id, "Rejected")} className="flex-1 bg-white border-2 border-rose-100 text-rose-500 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95">Reject</button>
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