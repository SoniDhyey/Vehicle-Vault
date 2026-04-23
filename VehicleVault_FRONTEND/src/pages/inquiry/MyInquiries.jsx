import React, { useEffect, useState } from "react";
import axios from "axios";

const MyInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMyInquiries = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/inquiry/getinquiries`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const myData = res.data.data.filter((item) => 
            item.buyer_id?._id === user._id || item.buyer_id === user._id
        );
        setInquiries(myData);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyInquiries();
  }, [API_URL]);

  if (loading) return <div className="p-20 text-center text-slate-400 font-medium">Loading history...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black mb-8 text-slate-900">My Inquiries</h2>
        <div className="grid gap-6">
          {inquiries.length > 0 ? (
            inquiries.map((iq) => (
              <div key={iq._id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-slate-100 p-6 flex flex-col justify-center border-r">
                    {iq.vehicle_id?.images?.[0] && (
                      <img src={iq.vehicle_id.images[0]} alt="car" className="w-full h-32 object-cover rounded-xl mb-3" />
                    )}
                    <h3 className="text-xl font-bold uppercase">{iq.vehicle_id?.make || "Unknown"} {iq.vehicle_id?.model || ""}</h3>
                    <p className="text-blue-600 font-bold">₹{iq.vehicle_id?.price?.toLocaleString()}</p>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${iq.status === "resolved" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                        {iq.status}
                      </span>
                      <span className="text-slate-400 text-xs">{new Date(iq.inquiry_date).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border">
                        <span className="text-blue-600 block text-[10px] font-black">Your Question:</span>
                        <p className="text-slate-800 font-medium">{iq.message}</p>
                      </div>
                      {(iq.reply || iq.response) && (
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                          <span className="text-blue-600 block text-[10px] font-black">Seller Response:</span>
                          <p className="text-slate-700 font-medium">{iq.reply || iq.response}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-center py-20 bg-white rounded-3xl border border-dashed">No inquiries found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyInquiries;