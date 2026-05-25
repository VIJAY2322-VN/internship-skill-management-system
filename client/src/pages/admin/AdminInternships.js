import React, { useState, useEffect } from "react";
import { getAllInternships, approveInternship } from "../../api";
import { toast } from "react-toastify";

const statusColors = {
  Applied: "badge-yellow", Selected: "badge-purple", Ongoing: "badge-green",
  Completed: "badge-blue", Rejected: "badge-red"
};

export default function AdminInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getAllInternships()
      .then(({ data }) => setInternships(data))
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveInternship(id);
      setInternships(prev => prev.map(i => i._id === id ? { ...i, isApproved: true } : i));
      toast.success("Internship approved!");
    } catch {
      toast.error("Approval failed");
    }
  };

  const STATUSES = ["Applied", "Selected", "Ongoing", "Completed", "Rejected"];

  const filtered = internships.filter(i => {
    const matchStatus = filter === "All" || i.status === filter;
    const matchSearch = i.company.toLowerCase().includes(search.toLowerCase()) ||
      i.student?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h1 className="page-title">All Internships 💼</h1>
            <p className="page-subtitle">{internships.length} total records</p>
          </div>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input placeholder="Search company or student..." value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {["All", ...STATUSES].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Company</th>
              <th>Role</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Stipend</th>
              <th>Status</th>
              <th>Approval</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px" }}>
                <div className="spinner" style={{ margin: "0 auto" }}></div>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No records</td></tr>
            ) : filtered.map(i => (
              <tr key={i._id}>
                <td>
                  <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>{i.student?.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{i.student?.rollNumber}</div>
                </td>
                <td style={{ fontWeight: "500", color: "var(--text-primary)" }}>{i.company}</td>
                <td>{i.role}</td>
                <td><span className="badge badge-gray">{i.type}</span></td>
                <td style={{ fontSize: "0.8rem" }}>
                  {new Date(i.startDate).toLocaleDateString()}
                  {i.endDate && ` → ${new Date(i.endDate).toLocaleDateString()}`}
                </td>
                <td>{i.stipend > 0 ? `₹${i.stipend?.toLocaleString()}` : "—"}</td>
                <td><span className={`badge ${statusColors[i.status]}`}>{i.status}</span></td>
                <td>
                  {i.isApproved
                    ? <span className="badge badge-green">✓ Approved</span>
                    : <button className="btn btn-sm btn-success" onClick={() => handleApprove(i._id)}>Approve</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
