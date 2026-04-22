import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [replyText, setReplyText] = useState({});

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem("token"); // ✅ Get token
      const res = await axios.get("http://localhost:3000/inquiry/getinquiries", {
        headers: { Authorization: `Bearer ${token}` } // ✅ Send token in headers
      });
      setInquiries(res.data.data);
    } catch (err) {
      console.error("Error fetching inquiries", err);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleReply = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/inquiry/updateinquiry/${id}`, 
        {
          reply: replyText[id],
          status: "resolved"
        },
        { headers: { Authorization: `Bearer ${token}` } } // ✅ Added Auth header
      );
      alert("Reply sent!");
      fetchInquiries(); 
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  const formatMessage = (msg) => {
    if (!msg) return "";
    return msg.trim().replace(/^["']+|["']+$/g, '');
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-black mb-10 text-slate-900 tracking-tight flex items-center gap-3">
          <span className="w-2 h-10 bg-blue-600 rounded-full"></span>
          Buyer Inquiries
        </h2>
        
        <div className="grid gap-8">
          {inquiries.length > 0 ? (
            inquiries.map((iq) => (
              <div key={iq._id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-100">
                <div className="bg-slate-50/80 px-10 py-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-6">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                      {iq.vehicle_id?.make?.charAt(0) || "V"}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Vehicle Details</span>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {iq.vehicle_id ? `${iq.vehicle_id.make} ${iq.vehicle_id.model}` : "Unknown Vehicle"}
                      </h3>
                      <p className="text-blue-600 font-bold">₹{iq.vehicle_id?.price?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Inquiry From</span>
                      <p className="font-bold text-slate-800 text-lg">
                        {iq.buyer_id?.firstName ? `${iq.buyer_id.firstName} ${iq.buyer_id.lastName}` : "Anonymous Buyer"}
                      </p>
                    </div>
                    <div className="bg-white border-2 border-slate-100 px-5 py-2 rounded-2xl text-center shadow-sm">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Date</span>
                      <p className="text-sm font-bold text-slate-900">
                        {iq.inquiry_date ? new Date(iq.inquiry_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-10">
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        Question
                      </span>
                    </div>
                    <div className="relative pl-8 pr-8">
                      <span className="absolute left-0 top-[-10px] text-blue-200 text-6xl leading-none font-serif">“</span>
                      <p className="text-slate-700 text-2xl font-medium leading-relaxed inline">
                        {formatMessage(iq.message)}
                      </p>
                      <span className="text-blue-200 text-6xl leading-none font-serif inline-block align-bottom ml-2">”</span>
                    </div>
                  </div>
                  
                  {iq.status === "pending" ? (
                    <div className="space-y-4">
                      <textarea
                        className="w-full p-6 rounded-3xl border-2 border-slate-100 bg-slate-50 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all text-slate-700 text-lg placeholder:text-slate-400"
                        rows="3"
                        placeholder="Type your reply to the buyer..."
                        onChange={(e) => setReplyText({ ...replyText, [iq._id]: e.target.value })}
                      ></textarea>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleReply(iq._id)}
                          className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-600 hover:-translate-y-1 transition-all shadow-xl active:translate-y-0"
                        >
                          Send Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 bg-emerald-50/40 p-8 rounded-[2rem] border-2 border-emerald-100/50 flex gap-5">
                      <div className="bg-emerald-500 h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
                      </div>
                      <div>
                        <span className="text-emerald-600 block text-[10px] uppercase font-black tracking-[0.2em] mb-2">Your Professional Reply</span>
                        <p className="text-slate-800 text-lg font-medium leading-relaxed">{iq.reply}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-300">
              <p className="text-slate-400 font-bold">No inquiries found for your vehicles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerInquiries;