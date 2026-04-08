import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  const [vehicle, setVehicle] = useState({
    make: '', model: '', year: '', price: '', fuel_type: '', transmission: '', description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/vehicle/getvehicle/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehicle(res.data.data);
        setImagePreview(res.data.data.images?.[0]);
        setLoading(false);
      } catch (err) {
        toast.error("Vehicle data not found.");
        navigate("/seller/dashboard");
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/vehicle/updatevehicle/${id}`, vehicle, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Vehicle updated successfully");
      navigate("/seller/dashboard");
    } catch (err) { toast.error("Update failed"); }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading Vehicle...</div>;

  return (
    <div className="min-h-screen p-6 md:p-10 bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Vehicle Details</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <label className="text-sm font-bold text-slate-500 uppercase block mb-3">Vehicle Image</label>
              <img src={imagePreview} alt="Vehicle" className="w-full h-48 object-cover rounded-lg border" />
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Make" value={vehicle.make} onChange={(e) => setVehicle({...vehicle, make: e.target.value})} />
              <Input label="Model" value={vehicle.model} onChange={(e) => setVehicle({...vehicle, model: e.target.value})} />
              <Input label="Year" value={vehicle.year} type="number" onChange={(e) => setVehicle({...vehicle, year: e.target.value})} />
              <Input label="Price (INR)" value={vehicle.price} type="number" onChange={(e) => setVehicle({...vehicle, price: e.target.value})} />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-bold text-slate-600 mb-2">Description</label>
              <textarea 
                className="border border-slate-300 rounded-lg p-3 h-32"
                value={vehicle.description}
                onChange={(e) => setVehicle({...vehicle, description: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-bold text-slate-600 mb-2">{label}</label>
    <input className="border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" {...props} />
  </div>
);

export default EditVehicle;