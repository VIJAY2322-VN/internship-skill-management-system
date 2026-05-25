import React, { useState, useEffect } from "react";
import { getAllSkills, verifySkill } from "../../api";
import { toast } from "react-toastify";

const levelColors = {
  Beginner: "badge-blue", Intermediate: "badge-yellow",
  Advanced: "badge-green", Expert: "badge-purple"
};

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getAllSkills()
      .then(({ data }) => setSkills(data))
      .catch(() => toast.error("Failed to load skills"))
      .finally(() => setLoading(false));
  }, []);

  const handleVerify = async (id) => {
    try {
      const { data } = await verifySkill(id);
      setSkills(prev => prev.map(s => s._id === id ? { ...s, verified: true } : s));
      toast.success("Skill verified!");
    } catch {
      toast.error("Verification failed");
    }
  };

  const filtered = skills.filter(s => {
    const matchFilter = filter === "All" || (filter === "Verified" ? s.verified : !s.verified);
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.student?.name?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h1 className="page-title">All Skills ⚡</h1>
            <p className="page-subtitle">
              {skills.length} total · {skills.filter(s => s.verified).length} verified
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["All", "Verified", "Unverified"].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline"}`}
                onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input placeholder="Search skill or student..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ width: "100%" }} />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Student</th>
              <th>Category</th>
              <th>Level</th>
              <th>Endorsements</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                <div className="spinner" style={{ margin: "0 auto" }}></div>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No skills found</td></tr>
            ) : filtered.map(skill => (
              <tr key={skill._id}>
                <td>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{skill.name}</span>
                </td>
                <td>
                  <div style={{ color: "var(--text-primary)" }}>{skill.student?.name || "—"}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{skill.student?.email}</div>
                </td>
                <td>{skill.category}</td>
                <td><span className={`badge ${levelColors[skill.level]}`}>{skill.level}</span></td>
                <td>
                  <span style={{ color: "var(--accent-primary)" }}>👍 {skill.endorsedBy?.length || 0}</span>
                </td>
                <td>
                  {skill.verified
                    ? <span className="badge badge-green">✅ Verified</span>
                    : <span className="badge badge-yellow">Pending</span>}
                </td>
                <td>
                  {!skill.verified && (
                    <button className="btn btn-sm btn-success" onClick={() => handleVerify(skill._id)}>
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
