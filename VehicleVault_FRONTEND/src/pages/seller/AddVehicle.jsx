import { useState, useRef } from "react"; // Added useRef
import axios from "axios";

const AddVehicle = () => {
  const fileInputRef = useRef(null); // 1. The "Remote Control" for the input

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
      // 2. This resets the input so you can pick the same image again
      e.target.value = null; 
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
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
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden bg-[#020617]">
      <div className="absolute w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] opacity-30 top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-600 rounded-full blur-[120px] opacity-30 bottom-[-100px] right-[-100px]"></div>

      <div className="relative w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">🚗 Add Vehicle</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "make", placeholder: "Make (e.g. Honda)" },
            { name: "model", placeholder: "Model (e.g. City)" },
            { name: "year", placeholder: "Year", type: "number" },
            { name: "price", placeholder: "Price", type: "number" },
            { name: "mileage", placeholder: "Mileage (km)", type: "number" },
            { name: "color", placeholder: "Color" },
            { name: "location", placeholder: "Location (City)" },
          ].map((field, i) => (
            <input
              key={i}
              required
              type={field.type || "text"}
              name={field.name}
              placeholder={field.placeholder}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition"
            />
          ))}

          <select name="fuel_type" onChange={handleChange} required className="p-3 rounded-xl bg-[#1e293b] border border-white/10 text-white">
            <option value="">Select Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
          </select>

          <select name="transmission" onChange={handleChange} required className="p-3 rounded-xl bg-[#1e293b] border border-white/10 text-white">
            <option value="">Select Transmission</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>

          <textarea 
            name="description" 
            placeholder="Vehicle Description..." 
            onChange={handleChange}
            className="col-span-1 md:col-span-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white h-24"
          />

          <div className="col-span-1 md:col-span-2">
            <label className="text-gray-400 text-sm">Upload Vehicle Image</label>
            {/* 3. Added onClick and cursor-pointer to your original div */}
            <div 
              onClick={() => fileInputRef.current.click()} 
              className="mt-2 border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-purple-500 transition cursor-pointer"
            >
              <input 
                type="file" 
                name="image" 
                ref={fileInputRef} // 4. Attach the ref here
                onChange={handleChange} 
                className="hidden" 
                accept="image/*" 
              />
              <span className="text-gray-400">Click to Upload Image</span>
            </div>
            {preview && <img src={preview} alt="preview" className="mt-4 w-full h-56 object-cover rounded-xl border border-white/10" />}
          </div>

          <button type="submit" className="col-span-1 md:col-span-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition">
            🚀 Add Vehicle
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;