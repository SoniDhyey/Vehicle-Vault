import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BookTestDrive = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [vehicleName, setVehicleName] = useState("Loading details...");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ vehicle_id: vehicleId || "", preferred_date: "", preferred_time: "", location: "" });

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/vehicle/getvehicle/${vehicleId}`);
        setVehicleName(`${res.data.data.make} ${res.data.data.model}`);
      } catch (err) {
        console.error("Error fetching vehicle:", err);
      }
    };
    if (vehicleId) fetchVehicleDetails();
  }, [vehicleId, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/testdrive/booktestdrive`, form, {
          headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message);
      navigate("/user/my-bookings");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error booking test drive");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Book Your Test Drive</h2>
        <div style={styles.vehicleBanner}>
          <span style={styles.label}>Vehicle Selected</span>
          <p style={styles.vehicleDisplayName}>{vehicleName}</p>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}><label style={styles.label}>Date</label><input type="date" name="preferred_date" onChange={(e)=>setForm({...form, preferred_date: e.target.value})} required style={styles.input}/></div>
          <div style={styles.inputGroup}><label style={styles.label}>Time</label><input name="preferred_time" placeholder="10:30 AM" onChange={(e)=>setForm({...form, preferred_time: e.target.value})} required style={styles.input}/></div>
          <div style={styles.inputGroup}><label style={styles.label}>Location</label><input name="location" placeholder="Address" onChange={(e)=>setForm({...form, location: e.target.value})} required style={styles.input}/></div>
          <button type="submit" disabled={isSubmitting} style={{ ...styles.button, opacity: isSubmitting ? 0.7 : 1 }}>{isSubmitting ? "Processing..." : "Confirm Booking"}</button>
        </form>
      </div>
    </div>
  );
};
// Styles omitted for brevity but should remain exactly as in your original file.
export default BookTestDrive;