import React, { useState, useEffect } from "react";
import { getMySkills, getMyInternships, getMyPlacements } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [internships, setInternships] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMySkills(), getMyInternships(), getMyPlacements()])
      .then(([s, i, p]) => {
        setSkills(s.data);
        setInternships(i.data);
        setPlacements(p.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeInternship = internships.find(i => i.status === "Ongoing");
  const selectedPlacements = placements.filter(p => p.status === "Selected").length;
  const verifiedSkills = skills.filter(s => s.verified).length;

  const getStatusColor = (status) => {
    const map = {
      "Ongoing": "green", "Completed": "blue", "Selected": "green",
      "Applied": "yellow", "Rejected": "red", "Shortlisted": "purple"
    };
    return map[status] || "gray";
  };

  if (loading) return (
    <div className="loading-spinner"><div className="spinner"></div></div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h1 className="page-title">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
            <p className="page-subtitle">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          {user?.department && (
            <div style={{ textAlign: "right" }}>
              <span className="badge badge-purple">{user.department}</span>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{user.batch}</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: "28px" }}>
        <div className="stat-card purple">
          <div className="stat-icon">⚡</div>
          <div className="stat-value" style={{ color: "var(--accent-primary)" }}>{skills.length}</div>
          <div className="stat-label">Total Skills</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>{verifiedSkills} verified</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">💼</div>
          <div className="stat-value" style={{ color: "var(--accent-success)" }}>{internships.length}</div>
          <div className="stat-label">Internships</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
            {internships.filter(i => i.status === "Completed").length} completed
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">🚀</div>
          <div className="stat-value" style={{ color: "var(--accent-warning)" }}>{placements.length}</div>
          <div className="stat-label">Applications</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>{selectedPlacements} selected</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">✅</div>
          <div className="stat-value" style={{ color: "var(--accent-info)" }}>{verifiedSkills}</div>
          <div className="stat-label">Verified Skills</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>by admin</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Active Internship */}
        <div className="card">
          <div className="flex-between" style={{ marginBottom: "16px" }}>
            <h3 style={{ fontWeight: "600" }}>Active Internship</h3>
            <span className="badge badge-green">LIVE</span>
          </div>
          {activeInternship ? (
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-primary)" }}>
                {activeInternship.company}
              </div>
              <div style={{ color: "var(--accent-primary)", fontWeight: "500", fontSize: "0.9rem", marginTop: "4px" }}>
                {activeInternship.role}
              </div>
              <div className="item-meta" style={{ marginTop: "12px" }}>
                <span className="item-meta-tag">📍 {activeInternship.location || "Remote"}</span>
                <span className="item-meta-tag">💰 ₹{activeInternship.stipend?.toLocaleString()}/mo</span>
                <span className="item-meta-tag">🏢 {activeInternship.type}</span>
              </div>
              {activeInternship.skills?.length > 0 && (
                <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {activeInternship.skills.map((s, i) => (
                    <span key={i} className="badge badge-purple">{s}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: "24px" }}>
              <div className="empty-state-icon">💼</div>
              <p>No active internship</p>
            </div>
          )}
        </div>

        {/* Recent placements */}
        <div className="card">
          <div className="flex-between" style={{ marginBottom: "16px" }}>
            <h3 style={{ fontWeight: "600" }}>Recent Applications</h3>
            <span className="badge badge-blue">{placements.length} total</span>
          </div>
          {placements.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {placements.slice(0, 4).map(p => (
                <div key={p._id} className="flex-between" style={{ padding: "10px", background: "var(--bg-glass)", borderRadius: "8px" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.875rem" }}>{p.company}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.role}</div>
                  </div>
                  <span className={`badge badge-${getStatusColor(p.status)}`}>{p.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: "24px" }}>
              <div className="empty-state-icon">🚀</div>
              <p>No placement applications yet</p>
            </div>
          )}
        </div>

        {/* Skills Overview */}
        <div className="card">
          <div className="flex-between" style={{ marginBottom: "16px" }}>
            <h3 style={{ fontWeight: "600" }}>Skills Overview</h3>
            <a href="/skills" style={{ fontSize: "0.8rem", color: "var(--accent-primary)", textDecoration: "none" }}>View all →</a>
          </div>
          {skills.length > 0 ? (
            <>
              {["Expert", "Advanced", "Intermediate", "Beginner"].map(level => {
                const count = skills.filter(s => s.level === level).length;
                if (!count) return null;
                const pct = Math.round((count / skills.length) * 100);
                const colors = { Expert: "#6366f1", Advanced: "#10b981", Intermediate: "#f59e0b", Beginner: "#3b82f6" };
                return (
                  <div key={level} style={{ marginBottom: "10px" }}>
                    <div className="flex-between" style={{ marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{level}</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{count}</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: colors[level] }}></div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="empty-state" style={{ padding: "24px" }}>
              <div className="empty-state-icon">⚡</div>
              <p>Add your first skill!</p>
            </div>
          )}
        </div>

        {/* Internship History */}
        <div className="card">
          <div className="flex-between" style={{ marginBottom: "16px" }}>
            <h3 style={{ fontWeight: "600" }}>Internship History</h3>
            <span className="badge badge-gray">{internships.length} total</span>
          </div>
          {internships.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {internships.slice(0, 4).map(i => (
                <div key={i._id} className="flex-between" style={{ padding: "10px", background: "var(--bg-glass)", borderRadius: "8px" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.875rem" }}>{i.company}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {new Date(i.startDate).toLocaleDateString()} • {i.role}
                    </div>
                  </div>
                  <span className={`badge badge-${getStatusColor(i.status)}`}>{i.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: "24px" }}>
              <div className="empty-state-icon">📋</div>
              <p>No internship history yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
