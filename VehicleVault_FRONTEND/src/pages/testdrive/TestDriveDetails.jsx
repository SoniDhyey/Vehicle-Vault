import React, { useEffect, useState } from "react";
import axios from "axios";

const TestDriveDetails = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        // Ensure this endpoint matches your backend route file (e.g., testdriveRoutes.js)
        const res = await axios.get("http://localhost:3000/testdrive/sellerrequests", {
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
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/testdrive/updatetestdrive/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      // Update UI state immediately
      setRequests(requests.map(req => req._id === id ? { ...req, status: newStatus } : req));
    } catch (err) {
      alert("Failed to update status. Please try again.");
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400">Loading requests...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h2 className="text-3xl font-black mb-6 text-slate-900">Incoming Test Drive Requests</h2>
      <div className="grid gap-4">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div key={req._id} className="bg-white p-6 rounded-3xl border shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">
                  {req.vehicle_id?.make} {req.vehicle_id?.model}
                </h3>
                <p className="text-slate-600 font-medium">
                  Buyer: {req.buyer_id?.firstName} {req.buyer_id?.lastName}
                </p>
                <p className="text-slate-500 text-sm italic">
                  Requested Date: {req.preferred_date ? new Date(req.preferred_date).toLocaleDateString() : "Flexible"}
                </p>
              </div>
              <div className="flex gap-2">
                {req.status === "Pending" ? (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(req._id, "Approved")} 
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-600 transition-colors"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(req._id, "Cancelled")} 
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className={`px-4 py-2 rounded-lg font-bold uppercase text-xs ${
                    req.status === "Approved" ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
                  }`}>
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
            <p className="text-slate-400 font-medium">No test drive requests found for your vehicles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDriveDetails;