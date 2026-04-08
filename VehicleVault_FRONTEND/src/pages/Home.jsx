import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * MiniCard Component
 * Renders a simple feature card for the landing page.
 */
const MiniCard = ({ text }) => (
  <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-xl text-center hover:scale-105 transition">
    <p className="text-lg font-semibold text-gray-200">{text}</p>
  </div>
);

/**
 * Home Component
 * Fixed static landing page matching the original design.
 */
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-sans">
      
      {/* NAVBAR - Static buttons as per screenshot */}
      <nav className="flex justify-between items-center px-8 py-4 bg-black/30 backdrop-blur-md sticky top-0 z-50">
        <h1
          className="text-2xl font-extrabold tracking-wide text-amber-400 cursor-pointer flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          🚗 Vehicle Vault
        </h1>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate("/about")}
            className="px-4 py-1 border border-gray-500 rounded text-sm hover:bg-white hover:text-black transition"
          >
            About Us
          </button>

          <button
            onClick={() => navigate("/help")}
            className="px-4 py-1 border border-gray-500 rounded text-sm hover:bg-white hover:text-black transition"
          >
            Help
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-4 py-1 border border-gray-500 rounded text-sm hover:bg-white hover:text-black transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-1 bg-amber-500 text-white rounded text-sm font-bold hover:bg-amber-600 transition shadow-lg"
          >
            Signup
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-28">
        <h1 className="text-5xl md:text-6xl font-extrabold text-amber-400 leading-tight mb-6">
          Store. Manage. Trust.
        </h1>

        <p className="text-gray-300 max-w-2xl text-lg mb-10">
          A modern platform to securely manage and organize vehicle data with complete reliability and control.
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="bg-amber-500 px-10 py-3 rounded-lg text-lg font-bold hover:bg-amber-600 transition transform hover:scale-105 shadow-xl"
        >
          Get Started
        </button>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-8 px-12 pb-24 max-w-7xl mx-auto">
        <MiniCard text="Secure Platform 🔐" />
        <MiniCard text="Fast Performance ⚡" />
        <MiniCard text="Modern Experience 🎯" />
      </div>

      {/* FOOTER */}
      <footer className="text-center py-8 text-gray-500 border-t border-gray-800/50">
        © 2026 Vehicle Vault
      </footer>
    </div>
  );
};

export default Home;