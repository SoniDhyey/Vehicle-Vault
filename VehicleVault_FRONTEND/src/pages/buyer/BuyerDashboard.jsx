import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCarSide, FaChevronRight } from "react-icons/fa";

const BuyerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  // Environment variable for API URL
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchAllVehicles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${BACKEND_URL}/vehicle/getvehicles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setVehicles(res.data.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };
    fetchAllVehicles();
  }, [BACKEND_URL]);

  return (
    <div className="min-h-screen bg-[#FBFCFE] font-sans select-none pt-10 pb-20 px-6 lg:px-16">
      <div className="max-w-4xl mb-12">
        <span className="text-blue-600 font-black text-xs uppercase tracking-[4px] mb-2 block">
          Premium Inventory
        </span>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
          Discover Your <span className="text-blue-600">Next Ride</span>
        </h1>
        <p className="text-md text-gray-500 font-medium mt-2">
          Browse our curated selection of verified, high-performance vehicles.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {vehicles.length > 0 ? (
          vehicles.map((v) => (
            <div
              key={v._id}
              className="group bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-blue-100/30 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={
                    v.images?.[0] ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={v.model}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg shadow-black/5 border border-white/20">
                  <span className="text-blue-600 font-black text-sm">
                    ₹{v.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {v.make} {v.model}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                    <FaCarSide className="text-blue-500" />
                    <span>
                      {v.fuel_type || "Petrol"} •{" "}
                      {v.transmission || "Automatic"}
                    </span>
                  </div>
                </div>

                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3 min-h-[4.2rem]">
                  {v.description ||
                    "Premium quality vehicle with excellent performance and modern safety features."}
                </p>

                <button
                  onClick={() => navigate(`/user/vehicle/${v._id}`)}
                  className="mt-auto w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
                >
                  View Details <FaChevronRight className="text-[10px]" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="text-4xl mb-4">🚗</div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
              No vehicles available in the vault
            </p>
          </div>
        )}
      </div>

      <footer className="mt-20 text-center">
        <p className="text-gray-300 font-bold text-[10px] uppercase tracking-[3px]">
          Vehicle Vault © 2026 • Verified Automotive Market
        </p>
      </footer>
    </div>
  );
};

export default BuyerDashboard;