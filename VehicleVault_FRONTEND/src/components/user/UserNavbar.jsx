import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaBell, FaCarSide, FaClipboardList, FaQuestionCircle, FaTag } from "react-icons/fa";

export const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-500 font-bold flex items-center gap-1 border-b-2 border-blue-500 pb-1"
      : "text-white hover:text-blue-400 flex items-center gap-1 transition-colors pb-1";

  return (
    <>
      <nav className="bg-[#020617] shadow-xl px-8 py-4 sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1
            className="text-2xl font-black text-blue-500 cursor-pointer tracking-tighter"
            onClick={() => navigate("/")}
          >
            Vehicle Vault
          </h1>

          <ul className="hidden md:flex gap-8 items-center font-semibold text-sm uppercase">
            <li>
              <NavLink to="/about" className={navLinkClass}>
                About Us
              </NavLink>
            </li>

            {/* SELLER LINKS */}
            {user?.role === "seller" && (
              <>
                <li>
                  <NavLink to="/seller/dashboard" className={navLinkClass}>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/seller/test-drives" className={navLinkClass}>
                    <FaCarSide className="mr-1" /> Test Drives
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/seller/offers" className={navLinkClass}>
                    <FaBell className="mr-1" /> Offers
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/seller/inquiries" className={navLinkClass}>
                    <FaQuestionCircle className="mr-1" /> Inquiries
                  </NavLink>
                </li>
              </>
            )}

            {/* BUYER LINKS */}
            {user && user.role !== "seller" && (
              <>
                <li>
                  <NavLink to="/user/dashboard" className={navLinkClass}>
                    Dashboard
                  </NavLink>
                </li>
                {/* --- ADDED: MY OFFERS LINK --- */}
                <li>
                  <NavLink to="/user/my-offer" className={navLinkClass}>
                    <FaTag className="mr-1 text-[12px]" /> My Offers
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/user/my-bookings" className={navLinkClass}>
                    <FaClipboardList className="mr-1" /> My Bookings
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/user/my-inquiries" className={navLinkClass}>
                    <FaQuestionCircle className="mr-1" /> My Inquiries
                  </NavLink>
                </li>
              </>
            )}

            {user ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-900/20"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <NavLink to="/login" className={navLinkClass}>
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/signup" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
                  >
                    Signup
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <main className="min-h-screen bg-white">
        <Outlet />
      </main>
    </>
  );
};