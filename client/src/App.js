import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skills";
import Internships from "./pages/Internships";
import Placements from "./pages/Placements";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminInternships from "./pages/admin/AdminInternships";
import AdminPlacements from "./pages/admin/AdminPlacements";

function ProtectedLayout({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div className="spinner"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" />;
  if (!adminOnly && user.role === "admin") return <Navigate to="/admin" />;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function AdminLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div className="spinner"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/dashboard" />;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} /> : <Register />} />

      {/* Student routes */}
      <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/skills" element={<ProtectedLayout><Skills /></ProtectedLayout>} />
      <Route path="/internships" element={<ProtectedLayout><Internships /></ProtectedLayout>} />
      <Route path="/placements" element={<ProtectedLayout><Placements /></ProtectedLayout>} />
      <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/students" element={<AdminLayout><AdminStudents /></AdminLayout>} />
      <Route path="/admin/skills" element={<AdminLayout><AdminSkills /></AdminLayout>} />
      <Route path="/admin/internships" element={<AdminLayout><AdminInternships /></AdminLayout>} />
      <Route path="/admin/placements" element={<AdminLayout><AdminPlacements /></AdminLayout>} />

      <Route path="*" element={<Navigate to={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/login"} />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
          toastStyle={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)"
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
