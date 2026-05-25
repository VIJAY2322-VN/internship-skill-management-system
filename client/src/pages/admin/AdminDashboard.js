import React, { useState, useEffect } from "react";
import { getAllStudents, getAllSkills, getInternshipStats, getPlacementStats, getAllInternships, getAllPlacements } from "../../api";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [skills, setSkills] = useState([]);
  const [internshipStats, setInternshipStats] = useState(null);
  const [placementStats, setPlacementStats] = useState(null);
  const [recentInternships, setRecentInternships] = useState([]);
  const [recentPlacements, setRecentPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllStudents(), getAllSkills(), getInternshipStats(),
      getPlacementStats(), getAllInternships(), getAllPlacements()
    ]).then(([s, sk, is_, ps, i, p]) => {
      setStudents(s.data);
      setSkills(sk.data);
      setInternshipStats(is_.data);
      setPlacementStats(ps.data);
      setRecentInternships(i.data.slice(0, 5));
      setRecentPlacements(p.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  const skillsByCategory = skills.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});

  const skillChartData = Object.entries(skillsByCategory).map(([name, value]) => ({ name, value }));
  const internshipByStatus = internshipStats?.byStatus?.map(s => ({ name: s._id, value: s.count })) || [];
  const placementByStatus = placementStats?.byStatus?.map(s => ({ name: s._id, value: s.count })) || [];

  const getStatusColor = (status) => {
    const map = { Ongoing: "badge-green", Completed: "badge-blue", Selected: "badge-green", Applied: "badge-yellow", Rejected: "badge-red" };
    return map[status] || "badge-gray";
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Overview 📊</h1>
        <p className="page-subtitle">System-wide analytics and management</p>
      </div>

      {/* Summary Stats */}
      <div className="grid-4" style={{ marginBottom: "28px" }}>
        <div className="stat-card purple">
          <div className="stat-icon">👥</div>
          <div className="stat-value" style={{ color: "var(--accent-primary)" }}>{students.length}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">⚡</div>
          <div className="stat-value" style={{ color: "var(--accent-success)" }}>{skills.length}</div>
          <div className="stat-label">Skills Tracked</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">💼</div>
          <div className="stat-value" style={{ color: "var(--accent-warning)" }}>{internshipStats?.total || 0}</div>
          <div className="stat-label">Internships</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">🚀</div>
          <div className="stat-value" style={{ color: "var(--accent-info)" }}>{placementStats?.selected || 0}</div>
          <div className="stat-label">Students Placed</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: "24px" }}>
        {/* Skills by Category */}
        <div className="card">
          <h3 style={{ fontWeight: "600", marginBottom: "20px" }}>Skills Distribution</h3>
          {skillChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={skillChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                  dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}>
                  {skillChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="empty-state" style={{ padding: "40px" }}><p>No skill data yet</p></div>}
        </div>

        {/* Internship Status */}
        <div className="card">
          <h3 style={{ fontWeight: "600", marginBottom: "20px" }}>Internship Status</h3>
          {internshipByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={internshipByStatus} barSize={32}>
                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state" style={{ padding: "40px" }}><p>No internship data yet</p></div>}
        </div>
      </div>

      <div className="grid-2">
        {/* Recent Internships */}
        <div className="table-container">
          <div className="table-header">
            <span className="table-title">Recent Internships</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Company</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInternships.length > 0 ? recentInternships.map(i => (
                <tr key={i._id}>
                  <td>
                    <div style={{ fontWeight: "500", color: "var(--text-primary)" }}>{i.student?.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{i.student?.department}</div>
                  </td>
                  <td>
                    <div style={{ color: "var(--text-primary)" }}>{i.company}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{i.role}</div>
                  </td>
                  <td><span className={`badge ${getStatusColor(i.status)}`}>{i.status}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={3} style={{ textAlign: "center" }}>No data</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Placement Stats */}
        <div className="card">
          <h3 style={{ fontWeight: "600", marginBottom: "20px" }}>Placement Overview</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="flex-between" style={{ padding: "14px", background: "var(--bg-glass)", borderRadius: "8px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Total Applications</span>
              <span style={{ fontWeight: "700", color: "var(--accent-primary)", fontSize: "1.2rem" }}>{placementStats?.total || 0}</span>
            </div>
            <div className="flex-between" style={{ padding: "14px", background: "var(--bg-glass)", borderRadius: "8px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Students Placed</span>
              <span style={{ fontWeight: "700", color: "var(--accent-success)", fontSize: "1.2rem" }}>{placementStats?.selected || 0}</span>
            </div>
            <div className="flex-between" style={{ padding: "14px", background: "var(--bg-glass)", borderRadius: "8px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Avg. Package</span>
              <span style={{ fontWeight: "700", color: "var(--accent-warning)", fontSize: "1.2rem" }}>
                ₹{Number(placementStats?.avgPackage || 0).toFixed(1)} LPA
              </span>
            </div>
            <div className="flex-between" style={{ padding: "14px", background: "var(--bg-glass)", borderRadius: "8px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Placement Rate</span>
              <span style={{ fontWeight: "700", color: "var(--accent-info)", fontSize: "1.2rem" }}>
                {students.length > 0 ? ((placementStats?.selected || 0) / students.length * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
