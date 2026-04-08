import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BookTestDrive = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicleName, setVehicleName] = useState("Loading details...");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    vehicle_id: vehicleId || "",
    preferred_date: "",
    preferred_time: "",
    location: "",
  });

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        // FIXED: Using absolute URL to match backend
        const res = await axios.get(
          `http://localhost:3000/vehicle/getvehicle/${vehicleId}`,
        );
        const fullName = `${res.data.data.make} ${res.data.data.model}`;
        setVehicleName(fullName);
        setForm((prev) => ({ ...prev, vehicle_id: vehicleId }));
      } catch (err) {
        console.error("Error fetching vehicle:", err);
        setVehicleName("Vehicle Selected");
      }
    };

    if (vehicleId) fetchVehicleDetails();
  }, [vehicleId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      // FIXED: Using full URL to resolve the 404 error seen in your console
      const res = await axios.post(
        "http://localhost:3000/testdrive/booktestdrive",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(res.data.message);
      // Change: Navigating directly to bookings so user sees the new entry immediately
      navigate("/user/my-bookings");
    } catch (err) {
      console.error("Booking Error:", err.response?.data);
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
          <div style={styles.inputGroup}>
            <label style={styles.label}>Preferred Date</label>
            <input
              type="date"
              name="preferred_date"
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Preferred Time</label>
            <input
              name="preferred_time"
              placeholder="e.g. 10:30 AM"
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Meeting Location</label>
            <input
              name="location"
              placeholder="Ahmedabad, Gujarat"
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{ ...styles.button, opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles remain unchanged as per your request
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#020617",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "28px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    width: "100%",
    maxWidth: "450px",
  },
  title: {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "900",
    marginBottom: "25px",
    textAlign: "center",
  },
  vehicleBanner: {
    backgroundColor: "rgba(37, 99, 235, 0.15)",
    padding: "16px 20px",
    borderRadius: "16px",
    marginBottom: "30px",
    border: "1px solid rgba(37, 99, 235, 0.3)",
  },
  vehicleDisplayName: {
    color: "#60a5fa",
    fontSize: "18px",
    fontWeight: "bold",
    margin: "4px 0 0 0",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: {
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase",
  },
  input: {
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "white",
  },
  button: {
    padding: "16px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default BookTestDrive;
