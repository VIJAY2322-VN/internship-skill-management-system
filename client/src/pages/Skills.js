import React, { useState, useEffect } from "react";
import { getMySkills, addSkill, updateSkill, deleteSkill } from "../api";
import { toast } from "react-toastify";

const CATEGORIES = ["Programming", "Framework", "Database", "Tool", "Soft Skill", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

const levelColors = {
  Beginner: "badge-blue", Intermediate: "badge-yellow",
  Advanced: "badge-green", Expert: "badge-purple"
};

const categoryIcons = {
  Programming: "💻", Framework: "🏗️", Database: "🗄️",
  Tool: "🔧", "Soft Skill": "🤝", Other: "⭐"
};

function SkillModal({ skill, onClose, onSave }) {
  const [form, setForm] = useState(
    skill || { name: "", category: "Programming", level: "Beginner" }
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (skill) {
        const { data } = await updateSkill(skill._id, form);
        onSave(data.skill, "update");
        toast.success("Skill updated!");
      } else {
        const { data } = await addSkill(form);
        onSave(data.skill, "add");
        toast.success("Skill added!");
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{skill ? "Edit Skill" : "Add New Skill"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Skill Name</label>
            <input className="form-control" placeholder="e.g. React.js, Python, SQL..."
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid-2" style={{ gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Proficiency Level</label>
              <select className="form-control" value={form.level}
                onChange={e => setForm({ ...form, level: e.target.value })}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={loading}>
              {loading ? "Saving..." : skill ? "Update" : "Add Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSkill, setEditSkill] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const { data } = await getMySkills();
      setSkills(data);
    } catch (err) {
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (skill, type) => {
    if (type === "add") setSkills(prev => [...prev, skill]);
    else setSkills(prev => prev.map(s => s._id === skill._id ? skill : s));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await deleteSkill(id);
      setSkills(prev => prev.filter(s => s._id !== id));
      toast.success("Skill deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const categories = ["All", ...new Set(skills.map(s => s.category))];
  const filtered = filter === "All" ? skills : skills.filter(s => s.category === filter);

  return (
    <div>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h1 className="page-title">My Skills ⚡</h1>
            <p className="page-subtitle">{skills.length} skills tracked · {skills.filter(s => s.verified).length} verified by admin</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditSkill(null); setShowModal(true); }}>
            + Add Skill
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {categories.map(cat => (
          <button key={cat} className={`btn btn-sm ${filter === cat ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter(cat)}>
            {cat !== "All" && categoryIcons[cat]} {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">⚡</div>
            <h3>No skills yet</h3>
            <p>Add your first skill to get started!</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {CATEGORIES.filter(cat => filtered.some(s => s.category === cat)).map(cat => (
            <div key={cat} className="card">
              <h3 style={{ fontWeight: "600", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                {categoryIcons[cat]} {cat}
                <span className="badge badge-gray" style={{ marginLeft: "4px" }}>
                  {filtered.filter(s => s.category === cat).length}
                </span>
              </h3>
              <div className="skills-grid">
                {filtered.filter(s => s.category === cat).map(skill => (
                  <div key={skill._id} className="skill-chip">
                    <div className={`skill-level-dot level-${skill.level.toLowerCase()}`}></div>
                    <span style={{ fontWeight: "500" }}>{skill.name}</span>
                    <span className={`badge ${levelColors[skill.level]}`} style={{ fontSize: "0.65rem" }}>{skill.level}</span>
                    {skill.verified && <span title="Verified by Admin">✅</span>}
                    {skill.endorsedBy?.length > 0 && (
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>👍 {skill.endorsedBy.length}</span>
                    )}
                    <div className="chip-actions">
                      <button className="chip-btn" onClick={() => { setEditSkill(skill); setShowModal(true); }}>✏️</button>
                      <button className="chip-btn chip-btn-delete" onClick={() => handleDelete(skill._id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filtered.some(s => s.category === "Other") && !CATEGORIES.includes("Other") && (
            <div className="card">
              <div className="skills-grid">
                {filtered.filter(s => s.category === "Other").map(skill => (
                  <div key={skill._id} className="skill-chip">
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <SkillModal
          skill={editSkill}
          onClose={() => { setShowModal(false); setEditSkill(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
