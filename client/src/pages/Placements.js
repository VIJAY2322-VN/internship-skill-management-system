import React, { useState, useEffect } from "react";
import { getMyPlacements, addPlacement, updatePlacement, deletePlacement } from "../api";
import { toast } from "react-toastify";

const STATUSES = ["Applied", "Shortlisted", "Interviewed", "Selected", "Rejected"];
const TYPES = ["Full-time", "Part-time", "Contract"];

const statusColors = {
  Applied: "badge-yellow", Shortlisted: "badge-purple", Interviewed: "badge-blue",
  Selected: "badge-green", Rejected: "badge-red"
};

function PlacementModal({ placement, onClose, onSave }) {
  const [form, setForm] = useState(placement || {
    company: "", role: "", package: "", location: "",
    offerDate: "", joiningDate: "", status: "Applied",
    type: "Full-time", description: "", skills: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      package: Number(form.package) || 0,
      skills: typeof form.skills === "string"
        ? form.skills.split(",").map(s => s.trim()).filter(Boolean)
        : form.skills
    };
    try {
      if (placement) {
        const { data } = await updatePlacement(placement._id, payload);
        onSave(data.placement, "update");
        toast.success("Updated!");
      } else {
        const { data } = await addPlacement(payload);
        onSave(data.placement, "add");
        toast.success("Placement added!");
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const skillsStr = Array.isArray(form.skills) ? form.skills.join(", ") : form.skills;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: "600px" }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{placement ? "Edit Application" : "Add Placement"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">Company</label>
              <input className="form-control" placeholder="Amazon, Infosys..." value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <input className="form-control" placeholder="Software Engineer..." value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Package (LPA)</label>
              <input className="form-control" type="number" step="0.1" placeholder="12.5" value={form.package}
                onChange={e => setForm({ ...form, package: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-control" placeholder="Hyderabad, Remote..." value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Offer Date</label>
              <input className="form-control" type="date" value={form.offerDate?.split("T")[0] || ""}
                onChange={e => setForm({ ...form, offerDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Joining Date</label>
              <input className="form-control" type="date" value={form.joiningDate?.split("T")[0] || ""}
                onChange={e => setForm({ ...form, joiningDate: e.target.value })} />
            </div>
          </div>
          <div className="grid-2" style={{ gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
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
            <label className="form-label">Skills Required (comma separated)</label>
            <input className="form-control" placeholder="Java, Spring Boot, SQL..." value={skillsStr}
              onChange={e => setForm({ ...form, skills: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-control" rows="3" placeholder="Interview rounds, notes..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={loading}>
              {loading ? "Saving..." : placement ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Placements() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => { loadPlacements(); }, []);

  const loadPlacements = async () => {
    setLoading(true);
    try {
      const { data } = await getMyPlacements();
      setPlacements(data);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  const handleSave = (item, type) => {
    if (type === "add") setPlacements(prev => [item, ...prev]);
    else setPlacements(prev => prev.map(p => p._id === item._id ? item : p));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this placement?")) return;
    try {
      await deletePlacement(id);
      setPlacements(prev => prev.filter(p => p._id !== id));
      toast.success("Deleted!");
    } catch { toast.error("Delete failed"); }
  };

  const filtered = placements.filter(p => {
    const matchStatus = filter === "All" || p.status === filter;
    const matchSearch = p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const selectedCount = placements.filter(p => p.status === "Selected").length;
  const avgPkg = placements.filter(p => p.package > 0).reduce((s, p) => s + p.package, 0) /
    (placements.filter(p => p.package > 0).length || 1);

  return (
    <div>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h1 className="page-title">Placements 🚀</h1>
            <p className="page-subtitle">{placements.length} applications · {selectedCount} selected · Avg pkg: ₹{avgPkg.toFixed(1)} LPA</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowModal(true); }}>
            + Add Application
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
            <div className="empty-state-icon">🚀</div>
            <h3>No placement records</h3>
            <p>Track your job applications here!</p>
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

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "8px 0" }}>
                <span className={`badge ${statusColors[item.status]}`}>{item.status}</span>
                <span className="badge badge-gray">{item.type}</span>
              </div>

              <div className="item-meta">
                {item.location && <span className="item-meta-tag">📍 {item.location}</span>}
                {item.package > 0 && <span className="item-meta-tag">💰 ₹{item.package} LPA</span>}
                {item.offerDate && <span className="item-meta-tag">📅 {new Date(item.offerDate).toLocaleDateString()}</span>}
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
        <PlacementModal
          placement={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
