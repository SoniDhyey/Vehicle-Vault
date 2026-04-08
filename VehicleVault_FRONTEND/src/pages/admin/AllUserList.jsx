import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // ✅ To detect query params
import { toast } from "react-toastify";


export const AllUserList = () => {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("active");
  const location = useLocation();

  // ✅ Parse the role from the URL (e.g., /admin/allusers?role=seller)
  const queryParams = new URLSearchParams(location.search);
  const roleFilter = queryParams.get("role"); 

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      const res = await axios.get("http://localhost:3000/user", config);
      setUsers(res.data?.data || []);
    } catch (err) {
      toast.error("Could not fetch user list");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleBlock = async (id, currentStatus) => {
    const newStatus = currentStatus === "blocked" ? "active" : "blocked";
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      await axios.put(`http://localhost:3000/user/${id}`, { status: newStatus }, config);
      toast.success(`User updated to ${newStatus}`);
      fetchUsers(); 
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // ✅ Multi-stage filtering logic
  let filteredData = users.filter(u => view === "active" ? u.status !== "blocked" : u.status === "blocked");

  if (roleFilter && roleFilter !== "all") {
    filteredData = filteredData.filter(u => u.role === roleFilter);
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 capitalize">
            {roleFilter ? `${roleFilter} Directory` : "Global Management"}
          </h2>
          <p className="text-slate-400 text-sm">Managing platform access for {view} members</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button onClick={() => setView("active")} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${view === 'active' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
            Active
          </button>
          <button onClick={() => setView("blocked")} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${view === 'blocked' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}`}>
            Blocked
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-100">
            <tr>
              <th className="p-5">Member Details</th>
              <th className="p-5">System Role</th>
              <th className="p-5">Access Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length > 0 ? filteredData.map(u => (
              <tr key={u._id} className="hover:bg-slate-50/50 transition">
                <td className="p-5">
                  <div className="font-bold text-slate-800">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${
                    u.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                    u.role === 'seller' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-5">
                  <span className={`text-xs font-bold ${u.status === 'blocked' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    ● {u.status || 'active'}
                  </span>
                </td>
                <td className="p-5 text-right">
                  {u.role !== 'admin' && (
                    <button 
                      onClick={() => toggleBlock(u._id, u.status)} 
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                        u.status === 'blocked' ? 'text-emerald-600 border-emerald-200 hover:bg-emerald-50' : 'text-rose-600 border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      {u.status === 'blocked' ? "Restore Account" : "Revoke Access"}
                    </button>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="p-20 text-center text-slate-400 italic font-medium">No results found for {roleFilter || 'this group'}.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUserList;