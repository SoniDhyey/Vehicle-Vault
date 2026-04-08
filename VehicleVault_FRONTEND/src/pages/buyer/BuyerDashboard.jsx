import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BuyerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllVehicles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3000/vehicle/getvehicles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVehicles(res.data.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };
    fetchAllVehicles();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Discover Your Next Ride</h1>

      <div style={styles.grid}>
        {vehicles.length > 0 ? (
          vehicles.map((v) => (
            <div key={v._id} style={styles.card}>
              {/* Image Container */}
              <div style={styles.imageContainer}>
                <img
                  src={v.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"}
                  alt={v.model}
                  style={styles.image}
                />
                <div style={styles.priceBadge}>
                  ₹{v.price.toLocaleString()}
                </div>
              </div>

              {/* Content Section */}
              <div style={styles.content}>
                <div style={{ flexGrow: 1 }}>
                  <h3 style={styles.vehicleName}>
                    {v.make} {v.model}
                  </h3>
                  <p style={styles.description}>
                    {v.description || "Premium quality vehicle with excellent performance and modern safety features."}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/user/vehicle/${v._id}`)}
                  style={styles.button}
                  onMouseOver={(e) => (e.target.style.opacity = "0.9")}
                  onMouseOut={(e) => (e.target.style.opacity = "1")}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noData}>No vehicles available 🚗</div>
        )}
      </div>
    </div>
  );
};

// PROFESSIONAL INLINE STYLES
const styles = {
  container: {
    backgroundColor: "#020617",
    minHeight: "100vh",
    padding: "40px 5%",
    color: "#ffffff",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "900",
    marginBottom: "40px",
    background: "linear-gradient(to right, #60a5fa, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "30px",
    alignItems: "stretch", // Ensures cards in a row have equal height
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "transform 0.3s ease",
  },
  imageContainer: {
    position: "relative",
    height: "220px",
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  priceBadge: {
    position: "absolute",
    bottom: "12px",
    left: "12px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "#60a5fa",
    padding: "6px 14px",
    borderRadius: "12px",
    fontWeight: "800",
    fontSize: "1rem",
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  content: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1, // Forces this section to fill remaining card space
  },
  vehicleName: {
    fontSize: "1.4rem",
    fontWeight: "700",
    margin: "0 0 10px 0",
    color: "#f8fafc",
  },
  description: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    lineHeight: "1.6",
    margin: "0 0 24px 0",
    /* Professional Line Clamping */
    display: "-webkit-box",
    WebkitLineClamp: "3",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    minHeight: "4.8em", // Keeps height consistent even for 1-line descriptions
  },
  button: {
    width: "100%",
    padding: "12px 0",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #9333ea)",
    color: "white",
    fontWeight: "700",
    fontSize: "0.9rem",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: "auto", // Pushes button to the very bottom
  },
  noData: {
    textAlign: "center",
    gridColumn: "1 / -1",
    padding: "50px",
    color: "#475569",
    fontSize: "1.2rem",
  },
};

export default BuyerDashboard;