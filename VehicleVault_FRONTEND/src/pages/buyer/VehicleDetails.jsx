import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaGasPump,
  FaCogs,
  FaCalendarAlt,
  FaShieldAlt,
  FaTools,
  FaCarSide,
  FaExclamationTriangle,
  FaEnvelope,
  FaPhone,
  FaHandHoldingUsd,
  FaQuestionCircle,
} from "react-icons/fa";

import SendOffer from "../offer/SendOffer";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // Helper function to format image URLs correctly
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/800x500?text=No+Image+Available";
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.replace(/\\/g, '/');
    return `${API_URL}/${cleanPath}`;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [vRes, rRes] = await Promise.allSettled([
          axios.get(`${API_URL}/vehicle/getvehicle/${id}`),
          axios.get(`${API_URL}/inspection/getreport/${id}`),
        ]);

        if (vRes.status === "fulfilled") {
          const data = vRes.value.data.data;
          setVehicle(data);
          if (data.images && data.images.length > 0) {
            setActiveImage(getImageUrl(data.images[0]));
          }
        }
        if (rRes.status === "fulfilled") setReport(rRes.value.data.data);
      } catch (err) {
        console.error("Data sync failure", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id, API_URL]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black text-slate-400 uppercase tracking-widest">
      Loading Vault...
    </div>
  );

  if (!vehicle) return (
    <div className="min-h-screen flex items-center justify-center text-slate-900 bg-slate-50 font-bold">
      Vehicle Asset Not Found
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 pb-20">
      {showOfferModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button 
              onClick={() => setShowOfferModal(false)} 
              className="absolute -top-12 right-0 text-white font-bold hover:text-blue-400 transition-colors"
            >
              CLOSE [X]
            </button>
            <SendOffer 
              vehicleId={vehicle._id} 
              vehiclePrice={vehicle.price} 
              onClose={() => setShowOfferModal(false)} 
            />
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 py-10 px-6 mb-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-5xl font-black text-slate-950 uppercase tracking-tight select-none">
              {vehicle.make} <span className="text-blue-600">{vehicle.model}</span>
            </h1>
            <div className="mt-4 flex gap-3">
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                Available Now
              </span>
              {report && (
                <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  Inspection Verified
                </span>
              )}
            </div>
          </div>
          <div className="text-right w-full md:w-auto">
            <p className="text-4xl font-black text-slate-900 leading-none">
              ₹{vehicle.price?.toLocaleString('en-IN')}
            </p>
            <button 
              onClick={() => setShowOfferModal(true)} 
              className="mt-4 w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg"
            >
              <FaHandHoldingUsd size={18} /> Make Offer
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-[12px] border-white">
              <img 
                src={activeImage} 
                className="w-full h-[300px] md:h-[450px] object-cover transition-all duration-500" 
                alt={`${vehicle.make} ${vehicle.model}`} 
                onError={(e) => { e.target.src = "https://via.placeholder.com/800x500?text=Image+Not+Found" }}
              />
            </div>

            {vehicle.images && vehicle.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
                {vehicle.images.map((img, index) => {
                  const thumbUrl = getImageUrl(img);
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveImage(thumbUrl)}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all ${
                        activeImage === thumbUrl 
                          ? "border-blue-600 scale-105 shadow-lg" 
                          : "border-white shadow-sm hover:border-slate-200"
                      }`}
                    >
                      <img src={thumbUrl} className="w-full h-full object-cover" alt={`View ${index + 1}`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Certified Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SpecItem icon={<FaCalendarAlt />} label="Year" value={vehicle.year} />
              <SpecItem icon={<FaGasPump />} label="Fuel" value={vehicle.fuel_type} />
              <SpecItem icon={<FaCogs />} label="Gearbox" value={vehicle.transmission} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-black uppercase text-slate-900">Technical Audit</h2>
              <FaShieldAlt className="text-blue-600" size={28} />
            </div>
            {report ? (
              <div className="space-y-6">
                <ReportLine icon={<FaTools />} label="Engine" value={report.engine_condition} />
                <ReportLine icon={<FaCarSide />} label="Tyres" value={report.tyre_condition} />
                <ReportLine icon={<FaShieldAlt />} label="Body" value={report.body_condition} />
                <ReportLine icon={<FaExclamationTriangle />} label="Incidents" value={report.accident_history} />
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400 font-bold">Pending Official Inspection</p>
              </div>
            )}
          </div>

          {/* ASSET OWNERSHIP */}
          <div className="bg-slate-950 p-10 rounded-[2.5rem] text-white shadow-2xl">
            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">Asset Ownership</h3>
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center font-black text-2xl uppercase shadow-inner">
                {vehicle.seller_id?.firstName?.charAt(0) || "S"}
              </div>
              <div>
                <p className="font-black text-xl">
                  {vehicle.seller_id?.firstName} {vehicle.seller_id?.lastName}
                </p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Verified Member</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {showContact ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <FaPhone className="text-blue-400" size={14} />
                    <p className="font-bold text-sm tracking-wider">
                      {vehicle.seller_id?.phone || "Phone Not Provided"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <FaEnvelope className="text-blue-400" size={14} />
                    <p className="font-bold text-sm break-all">
                      {vehicle.seller_id?.email || "Email Not Provided"}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowContact(false)} 
                    className="w-full text-[10px] text-slate-500 uppercase font-black tracking-widest mt-2 hover:text-slate-300 transition-colors"
                  >
                    Hide Details
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowContact(true)} 
                  className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all active:scale-95"
                >
                  Connect Seller
                </button>
              )}

              <button 
                onClick={() => navigate(`/user/book-testdrive/${id}`)}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/20 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <FaCarSide className="text-blue-400" /> Book Test Drive
              </button>

              <button 
                onClick={() => navigate(`/user/send-inquiry/${id}`)}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/20 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <FaQuestionCircle className="text-blue-400" /> Ask a Question
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SpecItem = ({ icon, label, value }) => (
  <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-colors hover:bg-white">
    <div className="text-blue-600 mb-3 text-xl">{icon}</div>
    <span className="text-[9px] font-black text-slate-400 uppercase mb-1">{label}</span>
    <span className="text-sm font-black text-slate-900 uppercase">{value || "N/A"}</span>
  </div>
);

const ReportLine = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0">
    <div className="text-blue-500/30 mt-1">{icon}</div>
    <div className="flex-1">
      <span className="text-[10px] font-black text-slate-400 uppercase block">{label}</span>
      <p className="text-sm font-bold text-slate-800">{value || "Verified Condition"}</p>
    </div>
  </div>
);

export default VehicleDetails;