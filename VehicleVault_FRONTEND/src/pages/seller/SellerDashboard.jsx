import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaFileAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const SellerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Environment variable for API URL
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BACKEND_URL}/vehicle/myvehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(res.data.data || []);
    } catch (err) {
      toast.error("Session expired. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`${BACKEND_URL}/vehicle/deletevehicle/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200 || res.status === 204) {
          toast.success("Vehicle deleted successfully");
          setVehicles(vehicles.filter((v) => v._id !== id));
        }
      } catch (err) {
        toast.error("Failed to delete vehicle. Please try again.");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [BACKEND_URL]);

  const getImageUrl = (v) => {
    if (!v) return null;
    return v.images && v.images.length > 0 ? v.images[0] : null;
  };

  if (loading) return <div className="text-center p-20 font-bold text-slate-400">Loading Garage...</div>;

  return (
    <div className="min-h-screen bg-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-end mb-12 border-b border-slate-100 pb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight select-none cursor-default">
              Seller Dashboard
            </h1>
            <p className="text-slate-500 font-medium mt-2 select-none cursor-default">
              Manage your inventory and technical audits
            </p>
          </div>

          <Link
            to="/seller/addvehicle"
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100"
          >
            <FaPlus /> Add New Vehicle
          </Link>
        </div>

        <div className="space-y-6">
          {vehicles.length > 0 ? (
            vehicles.map((v) => {
              const imageUrl = getImageUrl(v);
              return (
                <div key={v._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-8 hover:shadow-md transition">
                  
                  <div className="w-48 h-32 bg-slate-100 rounded-[1.5rem] overflow-hidden flex items-center justify-center border border-slate-200">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={v.model} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/200x150?text=No+Image"; }}
                      />
                    ) : (
                      <span className="text-slate-300 font-bold">No Image</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter select-none cursor-default">
                      {v.make} {v.model}
                    </h3>
                    <p className="text-slate-400 text-sm font-bold uppercase select-none cursor-default">
                      {v.year} • {v.fuel_type || "Petrol"}
                    </p>
                    <p className="text-3xl font-black text-blue-600 mt-1 select-none cursor-default">
                      ₹{v.price?.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate(`/seller/report/${v._id}`)} 
                      className="p-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-100"
                    >
                      <FaFileAlt />
                    </button>
                    <button 
                      onClick={() => navigate(`/seller/edit/${v._id}`)} 
                      className="p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition"
                    >
                      <FaEdit />
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(v._id)}
                      className="p-4 bg-white border border-slate-200 text-red-500 rounded-2xl hover:bg-red-50 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 select-none cursor-default">
              <p className="text-slate-400 font-bold text-lg">Your garage is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;