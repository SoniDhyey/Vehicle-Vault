import React from "react";
import { FaEnvelope, FaPhone, FaLaptopCode } from "react-icons/fa";

const About = () => {
  return (
    // Changed py-20 to pt-32 pb-20 to add more space at the top
    <div className="min-h-screen bg-[#FBFCFE] font-sans select-none cursor-default pt-32 pb-20 px-6 flex flex-col items-center">
      
      {/* HEADER SECTION */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">
          About <span className="text-blue-600">Vehicle Vault</span>
        </h1>
        <p className="text-md text-gray-500 font-medium leading-relaxed max-w-xl mx-auto">
          Simplifying the automotive journey. We provide a transparent, secure, and modern 
          ecosystem for buyers and sellers to connect with confidence.
        </p>
      </div>

      {/* LEAD DEVELOPER CARD */}
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-blue-100/40 p-12 relative overflow-hidden text-center">
          
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-full -z-0 opacity-50"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-200 mb-6">
              D
            </div>

            <span className="text-blue-600 font-black text-xs uppercase tracking-[4px] mb-2">Lead Developer</span>
            <h2 className="text-4xl font-black text-gray-900 mb-10">Dhyey Soni</h2>
            
            <div className="flex flex-wrap justify-center gap-4 w-full">
              <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-white transition-all duration-300">
                <FaLaptopCode className="text-blue-500" />
                <span className="text-sm font-bold text-gray-700 whitespace-nowrap">Full Stack Developer</span>
              </div>
              
              <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-white transition-all duration-300">
                <FaEnvelope className="text-blue-500" />
                <span className="text-sm font-bold text-gray-700 whitespace-nowrap">dhyeysoni201@gmail.com</span>
              </div>
              
              <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-white transition-all duration-300">
                <FaPhone className="text-blue-500" />
                <span className="text-sm font-bold text-gray-700 whitespace-nowrap">+91 9327099839</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-center">
        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[3px]">
          Vehicle Vault © 2026
        </p>
      </footer>
    </div>
  );
};

export default About;