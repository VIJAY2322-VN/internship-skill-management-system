import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const studentLinks = [
  { to: "/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/skills", icon: "⚡", label: "My Skills" },
  { to: "/internships", icon: "💼", label: "Internships" },
  { to: "/placements", icon: "🚀", label: "Placements" },
  { to: "/profile", icon: "👤", label: "Profile" },
];

const adminLinks = [
  { to: "/admin", icon: "📊", label: "Overview" },
  { to: "/admin/students", icon: "👥", label: "Students" },
  { to: "/admin/skills", icon: "⚡", label: "All Skills" },
  { to: "/admin/internships", icon: "💼", label: "Internships" },
  { to: "/admin/placements", icon: "🚀", label: "Placements" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === "admin" ? adminLinks : studentLinks;
  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>🎓 SkillTrack</h2>
        <p>Internship & Skill Manager</p>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">
          {user?.role === "admin" ? "Admin Panel" : "My Portal"}
        </div>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin" || link.to === "/dashboard"}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <span className="icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">↪</button>
        </div>
      </div>
    </aside>
  );
}
