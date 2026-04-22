import { useState, useRef } from "react";
import axios from "axios";
import { FaCar, FaImage, FaCloudUploadAlt, FaCalendarAlt, FaGasPump, FaCogs } from "react-icons/fa";

const AddVehicle = () => {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    make: "", model: "", year: "", price: "", mileage: "",
    fuel_type: "", transmission: "", color: "", location: "",
    description: "", image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (file) {
        setForm({ ...form, image: file });
        setPreview(URL.createObjectURL(file));
      }
      e.target.value = null; 
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
   Object.keys(form).forEach((key) => {
    if (key === "image") {
      // ✅ CHANGE THIS: Backend expects "images" (plural)
      data.append("images", form[key]); 
    } else {
      data.append(key, form[key]);
    }
  });

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/vehicle/addvehicle", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Vehicle Added 🚀");
    } catch (err) {
      console.error("Upload Error:", err.response?.data || err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFCFE] font-sans select-none pt-24 pb-20 px-6 flex flex-col items-center">
      
      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <span className="text-blue-600 font-black text-xs uppercase tracking-[4px] mb-2 block">Inventory Management</span>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">
          Add New <span className="text-blue-600">Vehicle</span>
        </h1>
        
      </div>

      <div className="w-full max-w-5xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-blue-100/40 p-10 relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            
            {/* LEFT COLUMN: Basic Info */}
            <div className="space-y-5">
              <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-4">
                <FaCar className="text-blue-600" /> General Specifications
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "make", placeholder: "Make (e.g. BMW)", type: "text" },
                  { name: "model", placeholder: "Model (e.g. M4)", type: "text" },
                  { name: "year", placeholder: "Year", type: "number" },
                  { name: "price", placeholder: "Price (₹)", type: "number" },
                  { name: "mileage", placeholder: "Mileage (km)", type: "number" },
                  { name: "color", placeholder: "Color", type: "text" },
                ].map((field, i) => (
                  <input
                    key={i}
                    required
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 placeholder-gray-400 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                ))}
              </div>

              <input
                required
                name="location"
                placeholder="Location (City, State)"
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 placeholder-gray-400 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />

              <div className="grid grid-cols-2 gap-4">
                <select name="fuel_type" onChange={handleChange} required className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-700 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 outline-none">
                  <option value="">Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                </select>

                <select name="transmission" onChange={handleChange} required className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-700 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 outline-none">
                  <option value="">Transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>

            {/* RIGHT COLUMN: Media & Description */}
            <div className="space-y-5">
              <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-4">
                <FaImage className="text-blue-600" /> Media & Details
              </h3>

              <textarea 
                name="description" 
                placeholder="Share the history, condition, and special features of the vehicle..." 
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 placeholder-gray-400 font-bold text-sm h-32 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
              />

              <div 
                onClick={() => fileInputRef.current.click()} 
                className={`group relative border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${preview ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-white'}`}
              >
                <input 
                  type="file" 
                  name="image" 
                  ref={fileInputRef} 
                  onChange={handleChange} 
                  className="hidden" 
                  accept="image/*" 
                />
                
                {preview ? (
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden shadow-md">
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold text-xs uppercase tracking-widest">Change Photo</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <FaCloudUploadAlt className="text-blue-500 text-4xl mb-3" />
                    <span className="text-gray-900 font-black text-sm">Upload High-Res Photo</span>
                    <span className="text-gray-400 text-xs font-medium mt-1">PNG, JPG or WEBP (Max 5MB)</span>
                  </div>
                )}
              </div>

              <button type="submit" className="w-full py-4 mt-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95">
                Add Vehicle 
              </button>
            </div>
          </div>
        </form>
      </div>

      <footer className="mt-12 text-center">
        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[3px]">
          Vehicle Vault © 2026 • Secure Management
        </p>
      </footer>
    </div>
  );
};

export default AddVehicle;