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

  // FIXED LOGIC: When an image is set as cover, it MUST become the first element 
  // and we must decide if the "Primary" slot belongs to Existing or New.
  const setAsCover = (index, isExisting) => {
    if (isExisting) {
      const updated = [...existingImages];
      const [selected] = updated.splice(index, 1);
      setExistingImages([selected, ...updated]);
      // If an existing image is cover, new images just follow after
    } else {
      const updatedNew = [...newImages];
      const [selectedFile] = updatedNew.splice(index, 1);
      setNewImages([selectedFile, ...updatedNew]);
      
      // CRITICAL: If a NEW image is cover, we move all existing images 
      // to the end so the backend sees the new file at index 0.
      const currentExisting = [...existingImages];
      setExistingImages([]); 
      setExistingImages(currentExisting);
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

    // FIX FOR 500 ERROR: Ensure existingImages ONLY contains valid http URLs
    // and no temporary blob strings.
    const cleanExisting = existingImages.filter(img => 
      typeof img === 'string' && img.startsWith('http')
    );
    formData.append("existingImages", JSON.stringify(cleanExisting));

    // Append files in their specific order
    newImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/vehicle/updatevehicle/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      toast.success("Vehicle updated successfully");
      navigate("/seller/dashboard");
    } catch (err) {
      console.error("Backend Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Upload failed: Server Error (500)");
    }
  };

  // Helper to determine what to show in the big "Primary" box
  const getPrimaryImage = () => {
    // If you want New Images to be able to override the existing cover:
    // Logic: If there are new images and the user specifically moved one to front
    // Or just default to existing if available.
    if (existingImages.length > 0) return existingImages[0];
    if (newImages.length > 0) return URL.createObjectURL(newImages[0]);
    return null;
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      <nav className="px-8 py-8 max-w-[1600px] mx-auto flex justify-between items-center">
         <h1 className="text-2xl font-black tracking-tight">
          Edit Listing: <span className="text-blue-600 ml-1">{vehicle.make} {vehicle.model}</span>
        </h1>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Media Gallery</h2>
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                + Add Photos
                <input type="file" multiple className="hidden" onChange={handleFileSelect} />
              </label>
            </div>

            <div className="space-y-6">
              {/* PRIMARY PREVIEW */}
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white bg-white">
                {getPrimaryImage() ? (
                  <img src={getPrimaryImage()} className="w-full h-full object-cover" alt="Primary" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">No Images</div>
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
                    isCover={i === 0}
                    onRemove={() => removeImage(i, true)} 
                    onSetCover={() => setAsCover(i, true)} 
                  />
                ))}
                {newImages.map((file, i) => (
                  <GalleryItem 
                    key={`new-${i}`} 
                    url={URL.createObjectURL(file)} 
                    isNew 
                    isCover={false} // New images only show as cover if moved to front and existing is empty
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
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 h-40 outline-none focus:border-blue-500 text-sm"
                  value={vehicle.description}
                  onChange={(e) => setVehicle({...vehicle, description: e.target.value})}
                />
              </div>
              <button onClick={handleSubmit} className="w-full mt-8 py-5 bg-blue-600 text-white text-sm font-black rounded-2xl shadow-lg uppercase tracking-widest">
                Save & Update
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

const GalleryItem = ({ url, isNew, onRemove, onSetCover, isCover }) => (
  <div className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${isCover ? 'border-blue-500 ring-2 ring-blue-100' : 'border-white shadow-sm'}`}>
    <img src={url} className="w-full h-full object-cover" alt="Thumb" />
    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
      <button type="button" onClick={onSetCover} className="w-full py-2 bg-white text-slate-900 text-[9px] font-black rounded-lg uppercase">Set Cover</button>
      <button type="button" onClick={onRemove} className="w-full py-2 bg-red-500 text-white text-[9px] font-black rounded-lg uppercase">Delete</button>
    </div>
    {isNew && <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded font-black uppercase">New</div>}
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-[10px] font-black text-slate-400 mb-2 uppercase pl-1">{label}</label>
    <input className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500 font-bold text-slate-700 text-sm" {...props} />
  </div>
);

export default EditVehicle;