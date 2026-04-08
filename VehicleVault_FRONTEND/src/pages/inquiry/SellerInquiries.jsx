import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [replyText, setReplyText] = useState({});

  const fetchInquiries = async () => {
    try {
      const res = await axios.get("http://localhost:3000/inquiry/getinquiries");
      setInquiries(res.data.data);
    } catch (err) {
      console.error("Error fetching inquiries");
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleReply = async (id) => {
    try {
      await axios.put(`http://localhost:3000/inquiry/updateinquiry/${id}`, {
        reply: replyText[id],
        status: "resolved"
      });
      alert("Reply sent!");
      fetchInquiries(); // Refresh list
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h2 className="text-3xl font-black mb-6 text-slate-900">Buyer Inquiries</h2>
      <div className="grid gap-6">
        {inquiries.map((iq) => (
          <div key={iq._id} className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="mb-4">
              <h4 className="text-blue-600 font-bold text-sm uppercase">Message from Buyer:</h4>
              <p className="text-slate-800 text-lg">{iq.message}</p>
            </div>
            
            {iq.status === "pending" ? (
              <div className="mt-4">
                <textarea
                  className="w-full p-3 rounded-xl border bg-slate-50 mb-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your reply..."
                  onChange={(e) => setReplyText({ ...replyText, [iq._id]: e.target.value })}
                ></textarea>
                <button
                  onClick={() => handleReply(iq._id)}
                  className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800"
                >
                  Send Reply
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <span className="text-emerald-600 block text-xs uppercase font-bold mb-1">Your Replied:</span>
                <p className="text-slate-700">{iq.reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerInquiries;