import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCar, FaUsers, FaUserTie, FaShieldAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState({ buyers: 0, sellers: 0, approved: 0, pending: 0 });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Use Environment Variable for Phone/Laptop compatibility
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!token || user?.role !== "admin") {
        toast.error("Unauthorized access!");
        navigate("/login");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [vRes, uRes] = await Promise.all([
        axios.get(`${API_URL}/vehicle/getvehicles`, config),
        axios.get(`${API_URL}/user`, config)
      ]);

      const vList = Array.isArray(vRes.data?.data) ? vRes.data.data : [];
      const uList = Array.isArray(uRes.data?.data) ? uRes.data.data : [];

      setVehicles(vList);

      setStats({
        buyers: uList.filter(u => u.role === "buyer" && u.status !== "blocked").length,
        sellers: uList.filter(u => u.role === "seller" && u.status !== "blocked").length,
        approved: vList.filter(v => v.status === "available" || v.status === "approved").length,
        pending: vList.filter(v => v.status === "pending").length,
      });
    } catch (err) {
      toast.error("Failed to sync dashboard data");
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const displayedVehicles = vehicles.filter(v => {
    if (filter === "pending") return v.status === "pending";
    if (filter === "available") return v.status === "available" || v.status === "approved";
    return true;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold text-slate-500">Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="p-8 bg-[#f1f5f9] min-h-screen space-y-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="pb-2 border-b-2 border-slate-200 select-none cursor-default">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">ADMIN PANEL</h1>
        <p className="text-slate-500 font-medium mt-1">Manage users and vehicle listings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard Icon={FaUsers} title="Total Buyers" value={stats.buyers} gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" onClick={() => navigate("/admin/allusers?role=buyer")} />
        <StatCard Icon={FaUserTie} title="Total Sellers" value={stats.sellers} gradient="linear-gradient(135deg, #6366f1 0%, #4338ca 100%)" onClick={() => navigate("/admin/allusers?role=seller")} />
        <StatCard Icon={FaCar} title="Live Listings" value={stats.approved} gradient="linear-gradient(135deg, #10b981 0%, #047857 100%)" active={filter === 'available'} onClick={() => setFilter(filter === 'available' ? 'all' : 'available')} />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center gap-4 select-none cursor-default">
          <div className="p-3 bg-slate-100 rounded-2xl text-slate-600"><FaShieldAlt /></div>
          <div>
            <h2 className="text-lg font-black text-slate-800 leading-tight">Vehicle Inventory</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                {filter === 'all' ? 'Showing All Records' : `Filtering by: ${filter}`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 uppercase text-[11px] font-black tracking-widest select-none cursor-default">
              <tr>
                <th className="px-8 py-5">Vehicle Name</th>
                <th className="px-8 py-5">Current Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedVehicles.length > 0 ? displayedVehicles.map((v) => (
                <tr key={v._id} className="group hover:bg-slate-50/80 transition-all">
                  <td className="px-8 py-6 select-none cursor-default">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <FaCar size={18} />
                        </div>
                        <div>
                            <p className="font-black text-slate-900 text-base">{v.make} {v.model}</p>
                            <p className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">UID: {v._id.substring(0, 8)}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 select-none cursor-default">
                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 ${
                      v.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => navigate(`/user/vehicle/${v._id}`)} className="bg-white border-2 border-slate-900 px-6 py-2.5 rounded-xl text-[11px] font-black text-slate-900 uppercase hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm">Manage</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="3" className="py-24 text-center select-none cursor-default"><p className="text-slate-300 font-black text-xl uppercase tracking-widest">No vehicles found</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ Icon, title, value, gradient, onClick, active }) => (
  <div onClick={onClick} style={{ background: 'white', boxShadow: active ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : 'none' }} className={`p-1 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 transform hover:-translate-y-2 select-none ${active ? 'border-blue-500 scale-[1.02]' : 'border-transparent'}`}>
    <div className="bg-white p-7 rounded-[1.8rem] flex items-center justify-between overflow-hidden relative">
        <div className="z-10">
            <p className="text-slate-400 text-[11px] uppercase font-black tracking-[0.2em] mb-1">{title}</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
        </div>
        <div style={{ background: gradient }} className="p-5 rounded-2xl text-white shadow-2xl z-10"><Icon size={26} /></div>
    </div>
  </div>
);

export default AdminDashboard;