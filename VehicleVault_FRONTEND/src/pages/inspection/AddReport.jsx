import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaClipboardCheck, FaCarCrash, FaComments, FaTools } from "react-icons/fa";

const AddReport = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportId, setReportId] = useState(null);

  const [report, setReport] = useState({
    vehicle_id: vehicleId,
    engine_condition: "",
    tyre_condition: "",
    body_condition: "",
    accident_history: "",
    remarks: "",
  });

  useEffect(() => {
    const fetchExistingReport = async () => {
      try {
        const token = localStorage.getItem("token");
        // Matches the updated backend prefix /inspection
        const res = await axios.get(`http://localhost:3000/inspection/getreport/${vehicleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data && res.data.data) {
          setReport(res.data.data);
          setReportId(res.data.data._id);
          toast.info("Previous audit details loaded.");
        }
      } catch (err) {
        console.log("No existing report found.");
      } finally {
        setLoading(false);
      }
    };
    fetchExistingReport();
  }, [vehicleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (reportId) {
        await axios.put(`http://localhost:3000/inspection/updatereport/${reportId}`, report, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Audit updated successfully!");
      } else {
        await axios.post("http://localhost:3000/inspection/addreport", report, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Audit saved! Vehicle is now AVAILABLE.");
      }
      navigate("/seller/dashboard");
    } catch (err) {
      toast.error("Error connecting to server.");
    }
  };

  const styles = {
    container: { minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "sans-serif" },
    card: { backgroundColor: "#ffffff", width: "100%", maxWidth: "800px", borderRadius: "24px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", padding: "40px", border: "1px solid #f1f5f9" },
    grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "30px" },
    inputGroup: { display: "flex", flexDirection: "column", gap: "8px", padding: "15px", backgroundColor: "#f8fafc", borderRadius: "12px" },
    label: { fontSize: "14px", fontWeight: "700", color: "#475569", display: "flex", alignItems: "center", gap: "8px" },
    input: { padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" },
    saveBtn: { width: "100%", backgroundColor: "#2563eb", color: "white", padding: "15px", borderRadius: "12px", border: "none", fontWeight: "700", cursor: "pointer", fontSize: "16px" }
  };

  if (loading) return <div style={styles.container}>Loading Audit Data...</div>;

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h1 style={{fontSize: "24px", fontWeight: "800", marginBottom: "20px"}}>{reportId ? "Update Technical Audit" : "New Technical Audit"}</h1>
        
        <div style={styles.grid}>
          <div style={{...styles.inputGroup, gridColumn: "1 / -1"}}>
            <label style={styles.label}><FaTools /> Engine Performance</label>
            <input style={styles.input} placeholder="e.g. Smooth, no leaks" value={report.engine_condition} onChange={(e) => setReport({...report, engine_condition: e.target.value})} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tyre Condition</label>
            <input style={styles.input} placeholder="e.g. 80% life remaining" value={report.tyre_condition} onChange={(e) => setReport({...report, tyre_condition: e.target.value})} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Body & Paint</label>
            <input style={styles.input} placeholder="e.g. Original paint, minor scratches" value={report.body_condition} onChange={(e) => setReport({...report, body_condition: e.target.value})} required />
          </div>
          <div style={{...styles.inputGroup, gridColumn: "1 / -1"}}>
            <label style={styles.label}><FaCarCrash /> Accident History</label>
            <input style={styles.input} placeholder="e.g. Clean history, no accidents" value={report.accident_history} onChange={(e) => setReport({...report, accident_history: e.target.value})} required />
          </div>
          <div style={{...styles.inputGroup, gridColumn: "1 / -1"}}>
            <label style={styles.label}><FaComments /> Final Remarks</label>
            <textarea style={{...styles.input, minHeight: "80px"}} placeholder="Overall vehicle summary..." value={report.remarks} onChange={(e) => setReport({...report, remarks: e.target.value})} />
          </div>
        </div>
        
        <button type="submit" style={styles.saveBtn}>
          {reportId ? "Update Audit Report" : "Save Audit Report"}
        </button>
      </form>
    </div>
  );
};

export default AddReport;