import React, { useState, useEffect } from "react";
import { getAllPlacements, approvePlacement } from "../../api";
import { toast } from "react-toastify";

const statusColors = {
  Applied: "badge-yellow", Shortlisted: "badge-purple", Interviewed: "badge-blue",
  Selected: "badge-green", Rejected: "badge-red"
};

export default function AdminPlacements() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getAllPlacements()
      .then(({ data }) => setPlacements(data))
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await approvePlacement(id);
      setPlacements(prev => prev.map(p => p._id === id ? { ...p, isApproved: true } : p));
      toast.success("Placement approved!");
    } catch {
      toast.error("Approval failed");
    }
  };

  const STATUSES = ["Applied", "Shortlisted", "Interviewed", "Selected", "Rejected"];

  const filtered = placements.filter(p => {
    const matchStatus = filter === "All" || p.status === filter;
    const matchSearch = p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.student?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const selectedTotal = placements.filter(p => p.status === "Selected");
  const avgPkg = selectedTotal.reduce((s, p) => s + (p.package || 0), 0) / (selectedTotal.length || 1);

  return (
    <div>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h1 className="page-title">All Placements 🚀</h1>
            <p className="page-subtitle">
              {placements.length} applications · {selectedTotal.length} placed · Avg: ₹{avgPkg.toFixed(1)} LPA
            </p>
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
              <th>Package</th>
              <th>Location</th>
              <th>Status</th>
              <th>Approval</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                <div className="spinner" style={{ margin: "0 auto" }}></div>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No records</td></tr>
            ) : filtered.map(p => (
              <tr key={p._id}>
                <td>
                  <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>{p.student?.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{p.student?.department}</div>
                </td>
                <td style={{ fontWeight: "500", color: "var(--text-primary)" }}>{p.company}</td>
                <td>{p.role}</td>
                <td style={{ color: "var(--accent-success)", fontWeight: "600" }}>
                  {p.package > 0 ? `₹${p.package} LPA` : "—"}
                </td>
                <td>{p.location || "—"}</td>
                <td><span className={`badge ${statusColors[p.status]}`}>{p.status}</span></td>
                <td>
                  {p.isApproved
                    ? <span className="badge badge-green">✓ Approved</span>
                    : <button className="btn btn-sm btn-success" onClick={() => handleApprove(p._id)}>Approve</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
