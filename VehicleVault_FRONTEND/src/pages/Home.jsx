import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * StepCard Component
 */
const StepCard = ({ number, title, desc }) => (
  <div className="flex flex-col items-center p-4 text-center group select-none">
    <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl mb-5 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
      {number}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed px-4">{desc}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    /* Added select-none and cursor-default to prevent any text-entry cursors from appearing */
    <div className="min-h-screen bg-[#FBFCFE] text-gray-900 font-sans select-none cursor-default">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 md:px-20 py-6 bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-blue-50">
        <h1
          className="text-2xl font-black tracking-tighter text-blue-600 cursor-pointer select-none"
          onClick={() => navigate("/")}
        >
          Vehicle Vault
        </h1>

        <div className="flex gap-8 items-center">
          <button onClick={() => navigate("/about")} className="hidden md:block text-sm font-bold text-gray-600 hover:text-blue-600 transition">About</button>
          <button onClick={() => navigate("/help")} className="hidden md:block text-sm font-bold text-gray-600 hover:text-blue-600 transition">Support</button>
          <button onClick={() => navigate("/login")} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition">Login</button>
          <button
            onClick={() => navigate("/signup")}
            className="px-7 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition shadow-xl shadow-blue-100"
          >
            SIGN UP
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl"></div>
        </div>

        {/* Applied pointer-events-none to the heading to ensure no cursor can ever trigger on it */}
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-8 pointer-events-none">
          Store. Manage. <span className="text-blue-600">Trust.</span>
        </h1>

        <p className="text-gray-500 max-w-2xl text-xl font-medium leading-relaxed mb-12 pointer-events-none">
          The easiest way to track your car details and check vehicle history. 
          Everything you need for a secure automotive experience in one place.
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="bg-blue-600 px-14 py-5 rounded-2xl text-white text-xl font-black hover:bg-blue-700 transition transform hover:scale-105 shadow-[0_20px_50px_rgba(37,99,235,0.3)] cursor-pointer"
        >
          Get Started Now
        </button>
      </div>

      {/* UNIQUE BOX SECTION */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="relative bg-white border border-blue-100 rounded-[40px] p-10 md:p-16 shadow-[0_15px_70px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
            
            <div className="relative grid md:grid-cols-3 gap-12 items-start">
                <StepCard 
                    number="01" 
                    title="Cloud Storage" 
                    desc="Securely upload documents and photos to your private digital vault with one click." 
                />
                <StepCard 
                    number="02" 
                    title="Verified Audits" 
                    desc="Access real-time technical reports to verify the true condition of any vehicle instantly." 
                />
                <StepCard 
                    number="03" 
                    title="Safe Deals" 
                    desc="Buy or sell with total peace of mind. Every piece of data is checked and 100% reliable." 
                />
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-16 text-center bg-white border-t border-gray-100 select-none">
        <p className="text-lg font-black text-gray-800">Vehicle Vault</p>
        <div className="flex justify-center gap-6 mt-4">
            <span className="text-[10px] font-black uppercase tracking-[3px] text-gray-300">Fast</span>
            <span className="text-[10px] font-black uppercase tracking-[3px] text-gray-300">Secure</span>
            <span className="text-[10px] font-black uppercase tracking-[3px] text-gray-300">Reliable</span>
        </div>
        <p className="text-xs text-gray-400 mt-8">© 2026 Vehicle Vault Project</p>
      </footer>
    </div>
  );
};

export default Home;