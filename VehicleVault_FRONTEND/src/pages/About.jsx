import React from "react";
import { FaUser, FaEnvelope, FaPhone, FaLaptopCode } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-6 py-16">

      <h1 className="text-4xl font-bold text-amber-400 text-center mb-8">
        About Vehicle Vault 🚗
      </h1>

      <p className="text-center max-w-2xl mx-auto text-gray-300 mb-10">
        Vehicle Vault is a modern MERN stack application designed to simplify
        vehicle buying, selling, and management with a secure and user-friendly system.
      </p>

      {/* ✅ YOUR ICON SECTION */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 space-y-6 max-w-3xl mx-auto">

        <h2 className="text-xl font-bold text-amber-400">👨‍💻 Developer Team</h2>

        {/* YOUR DETAILS */}
        <div className="bg-black/30 p-4 rounded-xl border border-gray-700 space-y-2">
          <p className="flex items-center gap-2">
            <FaUser className="text-blue-400" />
            <span className="font-semibold">DHYEY SONI</span>
          </p>
          <p className="flex items-center gap-2">
            <FaLaptopCode className="text-purple-400" />
            Full Stack Developer 
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-amber-400" />
            dhyeysoni201@gmail.com
          </p>
          <p className="flex items-center gap-2">
            <FaPhone className="text-green-400" />
            +91 9327099839
          </p>
        </div>

        {/* FRIEND DETAILS */}
        <div className="bg-black/30 p-4 rounded-xl border border-gray-700 space-y-2">
          <p className="flex items-center gap-2">
            <FaUser className="text-blue-400" />
            <span className="font-semibold">JAYMIN RAVAL</span>
          </p>
          <p className="flex items-center gap-2">
            <FaLaptopCode className="text-purple-400" />
            Full Stack Developer 
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-amber-400" />
            ravaljaymin2908@gmail.com
          </p>
          <p className="flex items-center gap-2">
            <FaPhone className="text-green-400" />
            +91 9925396071
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;