import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    role: "student", department: "", batch: "", rollNumber: "", phone: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data.user, data.token);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const isStudent = form.role === "student";

  return (
    <div className="auth-container">
      <div className="auth-bg-glow auth-bg-glow-1"></div>
      <div className="auth-bg-glow auth-bg-glow-2"></div>

      <div className="auth-card" style={{ maxWidth: "500px" }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">🎓</div>
          <h1>SkillTrack</h1>
          <p>Internship & Skill Management System</p>
        </div>

        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Join as a student or administrator</p>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: "12px", marginBottom: "0" }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" placeholder="Vijay Kumar" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-control" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-control" type="email" placeholder="you@university.edu" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" placeholder="Min. 6 characters" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>

          {isStudent && (
            <>
              <div className="grid-2" style={{ gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input className="form-control" placeholder="Computer Science" value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Batch / Year</label>
                  <input className="form-control" placeholder="2021-2025" value={form.batch}
                    onChange={(e) => setForm({ ...form, batch: e.target.value })} />
                </div>
              </div>
              <div className="grid-2" style={{ gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input className="form-control" placeholder="21CS001" value={form.rollNumber}
                    onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-control" placeholder="+91 9999999999" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
            </>
          )}

          <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
