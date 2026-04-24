import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUserShield, FaKey, FaSave } from "react-icons/fa";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState(""); 
  const [adminData, setAdminData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
        const res = await axios.get(`${API_URL}/user/profile`, config);
        const { _id, firstName, lastName, email } = res.data.data;
        setAdminId(_id); 
        setAdminData((prev) => ({ ...prev, firstName, lastName, email }));
      } catch (err) {
        toast.error("Failed to load admin profile");
      }
    };
    fetchAdmin();
  }, [API_URL]);

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      await axios.put(`${API_URL}/user/${adminId}`, adminData, config);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg"><FaUserShield size={20}/></span>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Admin Settings</h1>
          </div>
          <p className="text-slate-500 text-sm">Control your account security and profile details.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-72 space-y-2">
            <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} Icon={FaUserShield} label="Profile Details" />
            <TabButton active={activeTab === "security"} onClick={() => setActiveTab("security")} Icon={FaKey} label="Security & Password" />
          </aside>

          <main className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-10">
              {activeTab === "profile" && (
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <SectionHeading title="Identity Information" subtitle="Update your public-facing admin profile." />
                  <div className="grid grid-cols-2 gap-6">
                    <InputGroup label="First Name" name="firstName" value={adminData.firstName} onChange={handleChange} placeholder="Admin" />
                    <InputGroup label="Last Name" name="lastName" value={adminData.lastName} onChange={handleChange} placeholder="User" />
                  </div>
                  <InputGroup label="Login Email" name="email" type="email" value={adminData.email} disabled />
                  <button type="submit" disabled={loading} className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                    <FaSave /> {loading ? "Processing..." : "Save Profile Changes"}
                  </button>
                </form>
              )}

              {activeTab === "security" && (
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <SectionHeading title="Account Security" subtitle="Change your password regularly to stay secure." />
                  <div className="space-y-4">
                    <InputGroup label="New Password" type="password" name="password" onChange={handleChange} placeholder="Leave blank to keep current" />
                  </div>
                  <button type="submit" disabled={loading} className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:bg-rose-700 transition-all">{loading ? "Updating..." : "Update Password"}</button>
                </form>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, Icon, label }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}><Icon size={18} /> {label}</button>
);

const SectionHeading = ({ title, subtitle }) => (
  <div className="border-b border-slate-100 pb-6 mb-6">
    <h3 className="text-xl font-black text-slate-800">{title}</h3>
    <p className="text-sm text-slate-400">{subtitle}</p>
  </div>
);

const InputGroup = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{label}</label>
    <input {...props} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all placeholder:text-slate-300" />
  </div>
);

export default AdminSettings;