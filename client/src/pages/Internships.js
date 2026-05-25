import React, { useState, useEffect } from "react";
import { getMyInternships, addInternship, updateInternship, deleteInternship } from "../api";
import { toast } from "react-toastify";

const STATUSES = ["Applied", "Selected", "Ongoing", "Completed", "Rejected"];
const TYPES = ["Remote", "On-site", "Hybrid"];

const statusColors = {
  Applied: "badge-yellow", Selected: "badge-purple", Ongoing: "badge-green",
  Completed: "badge-blue", Rejected: "badge-red"
};

function InternshipModal({ internship, onClose, onSave }) {
  const [form, setForm] = useState(internship || {
    company: "", role: "", domain: "", startDate: "", endDate: "",
    stipend: "", location: "", type: "Remote", status: "Applied",
    description: "", skills: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      stipend: Number(form.stipend) || 0,
      skills: typeof form.skills === "string"
        ? form.skills.split(",").map(s => s.trim()).filter(Boolean)
        : form.skills
    };
    try {
      if (internship) {
        const { data } = await updateInternship(internship._id, payload);
        onSave(data.internship, "update");
        toast.success("Internship updated!");
      } else {
        const { data } = await addInternship(payload);
        onSave(data.internship, "add");
        toast.success("Internship added!");
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving");
    } finally {
      setLoading(false);
    }
  };

  const skillsStr = Array.isArray(form.skills) ? form.skills.join(", ") : form.skills;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: "600px" }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{internship ? "Edit Internship" : "Add Internship"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">Company</label>
              <input className="form-control" placeholder="Google, TCS..." value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Role / Position</label>
              <input className="form-control" placeholder="Software Engineer Intern..." value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Domain</label>
              <input className="form-control" placeholder="Full Stack, AI/ML..." value={form.domain}
                onChange={e => setForm({ ...form, domain: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-control" placeholder="Bangalore, Remote..." value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="form-control" type="date" value={form.startDate?.split("T")[0] || ""}
                onChange={e => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input className="form-control" type="date" value={form.endDate?.split("T")[0] || ""}
                onChange={e => setForm({ ...form, endDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Stipend (₹/month)</label>
              <input className="form-control" type="number" placeholder="0" value={form.stipend}
                onChange={e => setForm({ ...form, stipend: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-control" value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-control" value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Skills Used (comma separated)</label>
            <input className="form-control" placeholder="React, Node.js, MongoDB..." value={skillsStr}
              onChange={e => setForm({ ...form, skills: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" placeholder="Describe your role and responsibilities..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={loading}>
              {loading ? "Saving..." : internship ? "Update" : "Add Internship"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => { loadInternships(); }, []);

  const loadInternships = async () => {
    setLoading(true);
    try {
      const { data } = await getMyInternships();
      setInternships(data);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  const handleSave = (item, type) => {
    if (type === "add") setInternships(prev => [item, ...prev]);
    else setInternships(prev => prev.map(i => i._id === item._id ? item : i));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this internship?")) return;
    try {
      await deleteInternship(id);
      setInternships(prev => prev.filter(i => i._id !== id));
      toast.success("Deleted!");
    } catch { toast.error("Delete failed"); }
  };

  const filtered = internships.filter(i => {
    const matchStatus = filter === "All" || i.status === filter;
    const matchSearch = i.company.toLowerCase().includes(search.toLowerCase()) ||
      i.role.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h1 className="page-title">Internships 💼</h1>
            <p className="page-subtitle">{internships.length} internship records</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowModal(true); }}>
            + Add Internship
          </button>
        </div>
      </div>

      <div className="flex-between" style={{ marginBottom: "24px", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["All", ...STATUSES].map(s => (
            <button key={s} className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-outline"}`}
              onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input placeholder="Search company or role..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">💼</div>
            <h3>No internships found</h3>
            <p>Add your first internship record!</p>
          </div>
        </div>
      ) : (
        <div className="items-grid">
          {filtered.map(item => (
            <div key={item._id} className="item-card">
              {item.isApproved && <div className="approved-stamp">✓ Approved</div>}
              <div className="item-card-header">
                <div>
                  <div className="item-company">{item.company}</div>
                  <div className="item-role">{item.role}</div>
                </div>
                <div className="item-card-actions">
                  <button className="btn btn-sm btn-outline" onClick={() => { setEditItem(item); setShowModal(true); }}>✏️</button>
                  <button className="btn btn-sm btn-outline" onClick={() => handleDelete(item._id)}>🗑️</button>
                </div>
              </div>

              <span className={`badge ${statusColors[item.status]}`}>{item.status}</span>

              <div className="item-meta">
                {item.location && <span className="item-meta-tag">📍 {item.location}</span>}
                {item.type && <span className="item-meta-tag">🏢 {item.type}</span>}
                {item.stipend > 0 && <span className="item-meta-tag">💰 ₹{item.stipend?.toLocaleString()}/mo</span>}
                {item.domain && <span className="item-meta-tag">🎯 {item.domain}</span>}
              </div>

              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "10px" }}>
                📅 {new Date(item.startDate).toLocaleDateString()}
                {item.endDate && ` → ${new Date(item.endDate).toLocaleDateString()}`}
              </div>

              {item.skills?.length > 0 && (
                <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {item.skills.map((s, i) => <span key={i} className="badge badge-purple">{s}</span>)}
                </div>
              )}

              {item.description && (
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "10px", lineHeight: "1.5" }}>
                  {item.description.slice(0, 100)}{item.description.length > 100 ? "..." : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <InternshipModal
          internship={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
