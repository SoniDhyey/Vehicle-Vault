import React, { useEffect, useState } from "react";
import axios from "axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/testdrive/gettestdrives`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.data) setBookings(res.data.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [API_URL]);

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading your bookings...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h2 className="text-3xl font-black mb-6 text-slate-900">My Bookings</h2>
      <div className="grid gap-4">
        {bookings.length > 0 ? (
          bookings.map((b) => (
            <div key={b._id} className="bg-white p-6 rounded-3xl border flex justify-between items-center shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{b.vehicle_id?.make} {b.vehicle_id?.model}</h3>
                <p className="text-slate-500 font-medium">{b.preferred_date ? new Date(b.preferred_date).toLocaleDateString() : "Date TBD"} at {b.preferred_time}</p>
                <p className="text-slate-400 text-sm">{b.location}</p>
              </div>
              <span className={`px-6 py-2 rounded-full font-bold text-sm uppercase ${b.status === "Approved" ? "bg-emerald-100 text-emerald-600" : b.status === "Cancelled" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}>{b.status || "Pending"}</span>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200"><p className="text-slate-400 font-medium">No bookings found.</p></div>
        )}
      </div>
    </div>
  );
};
export default MyBookings;