import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [vehicle, setVehicle] = useState({ make: '', model: '', year: '', price: '', description: '' });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  // ✅ Track if the cover is currently from 'existing' or 'new'
  const [coverSource, setCoverSource] = useState('existing');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/vehicle/getvehicle/${id}`);
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
      if (index === 0) setCoverSource(newImages.length > 0 ? 'new' : 'existing');
    } else {
      setNewImages(newImages.filter((_, i) => i !== index));
      if (index === 0 && coverSource === 'new') setCoverSource('existing');
    }
  };

  // ✅ IMPROVED SET COVER LOGIC
  const setAsCover = (index, isExisting) => {
    if (isExisting) {
      const updated = [...existingImages];
      const [selected] = updated.splice(index, 1);
      setExistingImages([selected, ...updated]);
      setCoverSource('existing'); // Focus back on existing
    } else {
      const updatedNew = [...newImages];
      const [selectedFile] = updatedNew.splice(index, 1);
      setNewImages([selectedFile, ...updatedNew]);
      setCoverSource('new'); // Focus on the new image list
    }
    toast.info("Cover image updated in preview");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(vehicle).forEach(key => formData.append(key, vehicle[key]));

    // If a new image is the cover, it's already at index 0 of the "images" append
    // If an existing image is the cover, it's at index 0 of cleanExisting
    const cleanExisting = existingImages.filter(img => typeof img === 'string' && img.startsWith('http'));
    
    // Logic: If coverSource is 'new', the backend should treat the first file in 'images' as primary
    // We send an extra field so your backend knows which one to prioritize if needed
    formData.append("coverSource", coverSource);
    formData.append("existingImages", JSON.stringify(cleanExisting));

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await axios.put(`/vehicle/updatevehicle/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Vehicle updated successfully");
      navigate("/seller/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  // ✅ UI PREVIEW FIX: correctly shows what is selected
  const getPrimaryImage = () => {
    if (coverSource === 'new' && newImages.length > 0) {
      return URL.createObjectURL(newImages[0]);
    }
    if (existingImages.length > 0) {
      return existingImages[0];
    }
    if (newImages.length > 0) {
        return URL.createObjectURL(newImages[0]);
    }
    return null;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      <nav className="px-8 py-8 max-w-[1600px] mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tight italic uppercase">
          Edit <span className="text-blue-600">Listing</span>
        </h1>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tighter">Media Gallery</h2>
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95">
                + Add Photos
                <input type="file" multiple className="hidden" onChange={handleFileSelect} />
              </label>
            </div>

            <div className="space-y-6">
              {/* BIG PRIMARY PREVIEW */}
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white bg-white">
                {getPrimaryImage() ? (
                  <img src={getPrimaryImage()} className="w-full h-full object-cover transition-all duration-500" alt="Primary" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest">No Images</div>
                )}
                <div className="absolute top-6 left-6 bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                  Primary Cover
                </div>
              </div>

              {/* THUMBNAILS */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {existingImages.map((url, i) => (
                  <GalleryItem 
                    key={`ex-${i}`} 
                    url={url} 
                    isCover={coverSource === 'existing' && i === 0} 
                    onRemove={() => removeImage(i, true)} 
                    onSetCover={() => setAsCover(i, true)} 
                  />
                ))}
                {newImages.map((file, i) => (
                  <GalleryItem 
                    key={`new-${i}`} 
                    url={URL.createObjectURL(file)} 
                    isNew 
                    isCover={coverSource === 'new' && i === 0} 
                    onRemove={() => removeImage(i, false)} 
                    onSetCover={() => setAsCover(i, false)} 
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-10">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
              <h3 className="text-[11px] font-black text-blue-600 mb-8 uppercase tracking-widest">Specifications</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <Input label="Make" value={vehicle.make} onChange={(e) => setVehicle({...vehicle, make: e.target.value})} />
                  <Input label="Model" value={vehicle.model} onChange={(e) => setVehicle({...vehicle, model: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <Input label="Year" type="number" value={vehicle.year} onChange={(e) => setVehicle({...vehicle, year: e.target.value})} />
                  <Input label="Price" type="number" value={vehicle.price} onChange={(e) => setVehicle({...vehicle, price: e.target.value})} />
                </div>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 h-40 outline-none focus:border-blue-500 text-sm font-medium"
                  placeholder="Describe your vehicle..."
                  value={vehicle.description}
                  onChange={(e) => setVehicle({...vehicle, description: e.target.value})}
                />
              </div>
              <button onClick={handleSubmit} className="w-full mt-8 py-5 bg-blue-600 text-white text-sm font-black rounded-2xl shadow-lg uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95">
                Save & Update Vault
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const GalleryItem = ({ url, isNew, onRemove, onSetCover, isCover }) => (
  <div className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${isCover ? 'border-blue-500 ring-4 ring-blue-100 scale-95' : 'border-white shadow-sm'}`}>
    <img src={url} className="w-full h-full object-cover" alt="Thumb" />
    
    {/* Overlay appears on hover */}
    <div className={`absolute inset-0 bg-slate-900/60 transition-opacity flex flex-col items-center justify-center gap-2 p-3 ${isCover ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
      <button type="button" onClick={onSetCover} className="w-full py-2 bg-white text-slate-900 text-[9px] font-black rounded-lg uppercase tracking-tighter hover:bg-blue-50">Set Cover</button>
      <button type="button" onClick={onRemove} className="w-full py-2 bg-red-500 text-white text-[9px] font-black rounded-lg uppercase tracking-tighter hover:bg-red-600">Remove</button>
    </div>

    {/* Indicator Tags */}
    {isCover && <div className="absolute inset-0 border-4 border-blue-500 rounded-2xl pointer-events-none"></div>}
    {isNew && <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded font-black uppercase shadow-md">New</div>}
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-[10px] font-black text-slate-400 mb-2 uppercase pl-1">{label}</label>
    <input className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500 font-bold text-slate-700 text-sm" {...props} />
  </div>
);

export default EditVehicle;