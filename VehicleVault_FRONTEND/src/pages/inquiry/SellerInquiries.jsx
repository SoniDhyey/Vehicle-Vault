import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [replyText, setReplyText] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/inquiry/getinquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(res.data.data);
    } catch (err) {
      console.error("Error fetching inquiries", err);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [API_URL]);

  const handleReply = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/inquiry/updateinquiry/${id}`, 
        { reply: replyText[id], status: "resolved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Reply sent!");
      fetchInquiries(); 
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-black mb-10 text-slate-900 tracking-tight flex items-center gap-3">
          <span className="w-2 h-10 bg-blue-600 rounded-full"></span> Buyer Inquiries
        </h2>
        <div className="grid gap-8">
          {inquiries.length > 0 ? (
            inquiries.map((iq) => (
              <div key={iq._id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50/80 px-10 py-6 border-b flex justify-between items-center">
                  <h3 className="text-xl font-extrabold">{iq.vehicle_id ? `${iq.vehicle_id.make} ${iq.vehicle_id.model}` : "Unknown"}</h3>
                  <p className="font-bold text-slate-800">From: {iq.buyer_id?.firstName || "Anonymous"}</p>
                </div>
                <div className="p-10">
                  <p className="text-slate-700 text-2xl font-medium mb-6">"{iq.message}"</p>
                  {iq.status === "pending" ? (
                    <div className="space-y-4">
                      <textarea
                        className="w-full p-6 rounded-3xl border-2 bg-slate-50 outline-none focus:border-blue-400"
                        rows="3"
                        placeholder="Type reply..."
                        onChange={(e) => setReplyText({ ...replyText, [iq._id]: e.target.value })}
                      ></textarea>
                      <button onClick={() => handleReply(iq._id)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-600">
                        Send Reply
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-50/40 p-8 rounded-[2rem] border-2 border-emerald-100/50">
                      <p className="text-slate-800 text-lg font-medium">{iq.reply}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed">No inquiries found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerInquiries;