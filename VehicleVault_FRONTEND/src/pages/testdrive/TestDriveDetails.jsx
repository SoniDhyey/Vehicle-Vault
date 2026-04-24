import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaClock, FaCalendarCheck, FaPaperPlane } from "react-icons/fa";

const TestDriveDetails = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/testdrive/sellerrequests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data.data || []);
      } catch (err) {
        console.error("Error fetching seller requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [API_URL]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/testdrive/updatetestdrive/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setRequests(requests.map(req => req._id === id ? { ...req, status: newStatus } : req));
    } catch (err) {
      alert("Failed to update status. Please try again.");
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Loading requests...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-black mb-10 text-slate-900 italic uppercase">Incoming <span className="text-blue-600">Requests</span></h2>
        
        <div className="grid gap-6">
          {requests.length > 0 ? (
            requests.map((req) => (
              <div key={req._id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row justify-between gap-6 transition-all hover:border-blue-200">
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                      {req.vehicle_id?.make} <span className="text-blue-600">{req.vehicle_id?.model}</span>
                    </h3>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mt-1">
                      Buyer: <span className="text-slate-800">{req.buyer_id?.firstName} {req.buyer_id?.lastName}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-slate-600">
                      <FaCalendarCheck className="text-blue-500" />
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 leading-none">Test Drive Date</p>
                        <p className="font-bold">{req.preferred_date ? new Date(req.preferred_date).toLocaleDateString() : "Flexible"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                      <FaClock className="text-blue-500" />
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 leading-none">Preferred Time</p>
                        <p className="font-bold">{req.preferred_time || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600 md:col-span-2">
                      <FaMapMarkerAlt className="text-red-500" />
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 leading-none">Meeting Location</p>
                        <p className="font-bold text-slate-800">{req.location || "Location not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <FaPaperPlane className="text-slate-300 text-xs" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      Request Sent: {req.createdAt ? new Date(req.createdAt).toLocaleString() : "Recently"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center md:items-end gap-3 min-w-[150px]">
                  {req.status === "Pending" ? (
                    <div className="flex flex-col w-full gap-2">
                      <button 
                        onClick={() => handleStatusUpdate(req._id, "Approved")} 
                        className="w-full bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(req._id, "Cancelled")} 
                        className="w-full bg-white text-red-500 border-2 border-red-100 px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-50 transition-all active:scale-95"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Current Status</p>
                       <span className={`px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest inline-block ${
                         req.status === "Approved" 
                         ? "text-emerald-600 bg-emerald-50 border border-emerald-100" 
                         : "text-red-600 bg-red-50 border border-red-100"
                       }`}>
                         {req.status === "Cancelled" ? "Rejected" : req.status}
                       </span>
                    </div>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-black uppercase tracking-widest">No incoming requests in the vault.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestDriveDetails;