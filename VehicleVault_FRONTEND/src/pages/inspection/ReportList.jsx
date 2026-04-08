import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrashAlt } from 'react-icons/fa';

const ReportList = () => {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      // Matches your backend GET /getreports route
      const res = await axios.get("http://localhost:3000/inspection/getreports");
      setReports(res.data.data);
    } catch (err) {
      toast.error("Error fetching reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        // Matches your backend DELETE /deletereport/:id route
        await axios.delete(`http://localhost:3000/inspection/deletereport/${id}`);
        toast.success("Report deleted");
        fetchReports(); // Refresh list
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Inspection Reports</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 uppercase text-xs">
              <th className="p-4">Vehicle ID</th>
              <th className="p-4">Engine</th>
              <th className="p-4">Tyres</th>
              <th className="p-4">Body</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id} className="border-b hover:bg-slate-50 text-sm">
                <td className="p-4 font-mono text-xs">{report.vehicle_id}</td>
                <td className="p-4">{report.engine_condition}</td>
                <td className="p-4">{report.tyre_condition}</td>
                <td className="p-4">{report.body_condition}</td>
                <td className="p-4">{new Date(report.inspection_date).toLocaleDateString()}</td>
                <td className="p-4 text-center">
                  <button onClick={() => handleDelete(report._id)} className="text-red-500 hover:text-red-700">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportList;