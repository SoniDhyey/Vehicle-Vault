import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FaHourglassHalf, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaCar 
} from "react-icons/fa";

const MyOffer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchMyOffers = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user")); 
      
      // Use dynamic API_URL
      const res = await axios.get(`${API_URL}/offer/getoffers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allOffers = Array.isArray(res.data?.data) ? res.data.data : [];
      const mySentOffers = allOffers.filter(
        (o) => (o.buyer_id?._id === user?._id || o.buyer_id === user?._id)
      );

      setOffers(mySentOffers);
    } catch (err) {
      toast.error("Failed to load your offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOffers();
  }, [API_URL]);

  const getStatusBadge = (status) => {
    const style = {
      Accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
      Rejected: "bg-rose-500/10 text-rose-600 border-rose-200/50",
      Pending: "bg-amber-500/10 text-amber-600 border-amber-200/50"
    };
    const icon = {
      Accepted: <FaCheckCircle />,
      Rejected: <FaTimesCircle />,
      Pending: <FaHourglassHalf />
    };
    return (
      <span className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[11px] font-black tracking-widest border shadow-sm uppercase ${style[status] || style.Pending}`}>
        {icon[status] || icon.Pending} {status || "Pending"}
      </span>
    );
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <h1 className="text-4xl font-black text-slate-900 italic uppercase">Offer <span className="text-blue-600">Vault</span></h1>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
             <p className="text-xl font-black text-slate-800">{offers.length} Records</p>
          </div>
        </header>

        <div className="grid gap-6">
          {offers.map((offer) => {
            let finalImageUrl = "";
            const vehicle = offer.vehicle_id;

            if (vehicle?.images && vehicle.images.length > 0) {
              const imagePath = vehicle.images[0];
              if (imagePath.startsWith("http")) {
                finalImageUrl = imagePath;
              } else {
                const cleanPath = imagePath.replace(/\\/g, '/');
                // Use dynamic API_URL for local images
                finalImageUrl = `${API_URL}/${cleanPath}`;
              }
            }

            return (
              <div key={offer._id} className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-xl flex flex-col md:flex-row items-center gap-8">
                
                <div className="flex items-center gap-5 flex-1 w-full">
                  <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
                    {finalImageUrl ? (
                      <img 
                        src={finalImageUrl} 
                        alt="Vehicle" 
                        className="w-full h-full object-cover" 
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = "https://via.placeholder.com/150?text=No+Image"; 
                        }}
                      />
                    ) : (
                      <FaCar size={30} className="text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase">
                      {vehicle?.make} {vehicle?.model}
                    </h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">
                      {vehicle?.year} • {vehicle?.fuel_type}
                    </p>
                  </div>
                </div>

                <div className="flex-1 text-center">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Proposed Price</p>
                  <h2 className="text-3xl font-black text-blue-600">
                    ₹{offer.offered_price?.toLocaleString('en-IN')}
                  </h2>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3 flex-1">
                  {getStatusBadge(offer.status)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOffer;