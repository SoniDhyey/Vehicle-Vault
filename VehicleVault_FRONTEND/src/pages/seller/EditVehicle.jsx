import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [vehicle, setVehicle] = useState({
    make: '', model: '', year: '', price: '', description: '',
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/vehicle/getvehicle/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehicle(res.data.data);
        setExistingImages(res.data.data.images || []);
        setLoading(false);
      } catch (err) {
        toast.error("Vehicle data not found.");
        navigate("/seller/dashboard");
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      setNewImages(newImages.filter((_, i) => i !== index));
    }
  };

  const setAsCover = (index, isExisting) => {
    if (isExisting) {
      const updated = [...existingImages];
      const selected = updated.splice(index, 1);
      setExistingImages([...selected, ...updated]);
    } else {
      const updated = [...newImages];
      const selected = updated.splice(index, 1);
      setNewImages([...selected, ...updated]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("make", vehicle.make);
    formData.append("model", vehicle.model);
    formData.append("year", vehicle.year);
    formData.append("price", vehicle.price);
    formData.append("description", vehicle.description);
    formData.append("existingImages", JSON.stringify(existingImages));
    newImages.forEach((file) => formData.append("images", file));

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/vehicle/updatevehicle/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      toast.success("Vehicle updated successfully");
      navigate("/seller/dashboard");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen p-6 md:p-12 bg-[#f8fafc] text-[#0f172a]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="select-none cursor-default px-2">
          <h1 className="text-[42px] font-black tracking-tight leading-tight">
            Edit Vehicle
          </h1>
          <p className="text-slate-400 font-medium text-lg mt-1">Manage your vehicle details and media gallery</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* MEDIA GALLERY - Full width with premium card styling */}
          <section className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100">
            <div className="flex justify-between items-center mb-10 select-none">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Media Gallery</h2>
                <p className="text-sm text-slate-400 mt-1 italic font-medium">Drag-and-drop behavior is simulated by "Set as Cover"</p>
              </div>
              <label className="bg-[#0f172a] text-white px-8 py-4 rounded-2xl text-sm font-black cursor-pointer hover:bg-blue-600 transition-all shadow-xl active:scale-95 uppercase tracking-widest">
                + Add Photos
                <input type="file" multiple className="hidden" onChange={handleFileSelect} />
              </label>
            </div>

            {/* Premium Grid: Larger, HD Aspect Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {existingImages.map((url, index) => (
                <PremiumImageCard 
                  key={`exist-${index}`}
                  url={url} 
                  isCover={index === 0} 
                  onRemove={() => removeImage(index, true)} 
                  onSetCover={() => setAsCover(index, true)}
                />
              ))}
              {newImages.map((file, index) => (
                <PremiumImageCard 
                  key={`new-${index}`}
                  url={URL.createObjectURL(file)} 
                  isNew 
                  onRemove={() => removeImage(index, false)} 
                  onSetCover={() => setAsCover(index, false)}
                />
              ))}
            </div>
          </section>

          {/* SPECIFICATIONS SECTION */}
          <section className="bg-white p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 mb-10 select-none uppercase tracking-widest">Vehicle Specifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <Input label="Vehicle Make" value={vehicle.make} onChange={(e) => setVehicle({...vehicle, make: e.target.value})} />
              <Input label="Vehicle Model" value={vehicle.model} onChange={(e) => setVehicle({...vehicle, model: e.target.value})} />
              <Input label="Manufacturing Year" value={vehicle.year} type="number" onChange={(e) => setVehicle({...vehicle, year: e.target.value})} />
              <Input label="Price (INR)" value={vehicle.price} type="number" onChange={(e) => setVehicle({...vehicle, price: e.target.value})} />
            </div>
            
            <div className="mt-10 flex flex-col">
              <label className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.3em] select-none pl-1">
                Full Description
              </label>
              <textarea 
                className="border-2 border-slate-50 bg-[#fbfcfd] rounded-[2rem] p-8 h-64 outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 leading-relaxed text-lg shadow-sm"
                value={vehicle.description}
                onChange={(e) => setVehicle({...vehicle, description: e.target.value})}
                placeholder="Describe the condition, history, and features of the vehicle..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mt-14">
              <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-slate-50 border border-slate-100 text-slate-400 font-bold py-6 rounded-[2rem] hover:bg-slate-100 hover:text-slate-600 transition-all uppercase tracking-widest text-xs">
                Discard Changes
              </button>
              <button type="submit" className="flex-[2] bg-blue-600 text-white font-black py-6 rounded-[2rem] hover:bg-blue-700 shadow-[0_20px_40px_rgba(37,99,235,0.2)] transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs">
                Save & Update Vehicle
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

// Premium Image Component
const PremiumImageCard = ({ url, isCover, isNew, onRemove, onSetCover }) => (
  <div className={`relative group aspect-[16/10] rounded-[2.5rem] overflow-hidden border-[6px] transition-all duration-700 ${isCover ? 'border-blue-500 shadow-2xl scale-[1.03] z-10' : 'border-white shadow-lg hover:shadow-2xl hover:border-slate-100'}`}>
    <img 
      src={url} 
      alt="Vehicle Asset" 
      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 image-render-auto" 
      style={{ imageRendering: 'auto' }}
    />
    
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    {isCover && (
      <div className="absolute top-6 left-6 bg-blue-500 text-white text-[10px] px-4 py-2 rounded-xl font-black uppercase tracking-widest shadow-lg select-none">
        Primary Cover
      </div>
    )}
    
    {isNew && (
      <div className="absolute top-6 right-6 bg-emerald-500 text-white text-[10px] px-4 py-2 rounded-xl font-black uppercase tracking-widest shadow-lg select-none">
        New
      </div>
    )}

    {/* Controls */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 px-6">
      {!isCover && (
        <button type="button" onClick={onSetCover} className="flex-1 bg-white hover:bg-blue-600 hover:text-white text-slate-900 font-black px-4 py-4 rounded-2xl transition-all shadow-xl text-[10px] uppercase tracking-widest">
          Set as Cover
        </button>
      )}
      <button type="button" onClick={onRemove} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black px-4 py-4 rounded-2xl transition-all shadow-xl text-[10px] uppercase tracking-widest">
        Remove
      </button>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.3em] select-none pl-1">{label}</label>
    <input className="border-2 border-slate-50 bg-[#fbfcfd] rounded-[2rem] p-6 outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-bold text-lg shadow-sm" {...props} />
  </div>
);

export default EditVehicle;