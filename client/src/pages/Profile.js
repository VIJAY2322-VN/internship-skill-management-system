import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: "", phone: "", department: "", batch: "", rollNumber: "", bio: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile().then(({ data }) => {
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        department: data.department || "",
        batch: data.batch || "",
        rollNumber: data.rollNumber || "",
        bio: data.bio || ""
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateProfile(form);
      updateUser(data.user);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Profile 👤</h1>
        <p className="page-subtitle">Manage your personal information</p>
      </div>

      <div className="grid-2">
        {/* Profile Card */}
        <div className="card" style={{ textAlign: "center", gridRow: "span 1" }}>
          <div style={{
            width: "96px", height: "96px",
            background: "var(--gradient-primary)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2rem", fontWeight: "700", color: "white",
            margin: "0 auto 16px",
            boxShadow: "var(--shadow-glow)"
          }}>
            {initials}
          </div>
          <h2 style={{ fontWeight: "700", marginBottom: "4px" }}>{user?.name}</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{user?.email}</p>
          <div style={{ marginTop: "12px" }}>
            <span className={`badge ${user?.role === "admin" ? "badge-purple" : "badge-blue"}`}>
              {user?.role === "admin" ? "👑 Admin" : "🎓 Student"}
            </span>
          </div>
          {user?.department && (
            <div style={{ marginTop: "16px", padding: "12px", background: "var(--bg-glass)", borderRadius: "8px", textAlign: "left" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px" }}>Academic Info</div>
              {user.department && <div style={{ fontSize: "0.875rem", marginBottom: "4px" }}>🏛️ {user.department}</div>}
              {user.batch && <div style={{ fontSize: "0.875rem", marginBottom: "4px" }}>📅 {user.batch}</div>}
              {user.rollNumber && <div style={{ fontSize: "0.875rem" }}>🎫 {user.rollNumber}</div>}
            </div>
          )}
        </div>

        {/* Edit Form */}
        <div className="card">
          <h3 style={{ fontWeight: "600", marginBottom: "24px" }}>Edit Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-control" placeholder="+91 9999999999" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            {user?.role === "student" && (
              <>
                <div className="grid-2" style={{ gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input className="form-control" placeholder="Computer Science" value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Batch</label>
                    <input className="form-control" placeholder="2021-2025" value={form.batch}
                      onChange={e => setForm({ ...form, batch: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input className="form-control" placeholder="21CS001" value={form.rollNumber}
                    onChange={e => setForm({ ...form, rollNumber: e.target.value })} />
                </div>
              </>
            )}
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-control" rows="4" placeholder="Tell us about yourself..."
                value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                style={{ resize: "vertical" }} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center" }} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
