import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screean">
      {/* SIDEBAR */}
      <div
        className={`bg-gray-900 text-white p-5 shadow-lg transition-all duration-300 
        ${isOpen ? "w-64" : "w-16"}`}
      >
        <button
          className="mb-6 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        <ul className="space-y-4 font-medium text-xs uppercase tracking-widest">
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive ? "text-blue-400 font-bold" : "hover:text-blue-400 transition"
              }
            >
              {isOpen ? "Dashboard" : "D"}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/allusers"
              className={({ isActive }) =>
                isActive ? "text-blue-400 font-bold" : "hover:text-blue-400 transition"
              }
            >
              {isOpen ? "Users" : "U"}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                isActive ? "text-blue-400 font-bold" : "hover:text-blue-400 transition"
              }
            >
              {isOpen ? "Settings" : "S"}
            </NavLink>
          </li>

          <li className="pt-10">
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-2 rounded-xl hover:bg-red-500 transition w-full text-left font-black"
            >
              {isOpen ? "Logout" : "X"}
            </button>
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};