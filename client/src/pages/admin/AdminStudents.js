import React, { useState, useEffect } from "react";
import { getAllStudents, getStudentSkills } from "../../api";
import { toast } from "react-toastify";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [studentData, setStudentData] = useState({ skills: [], internships: [] });
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    getAllStudents()
      .then(({ data }) => setStudents(data))
      .catch(() => toast.error("Failed to load students"))
      .finally(() => setLoading(false));
  }, []);

  const openStudent = async (student) => {
    setSelected(student);
    setLoadingDetail(true);
    try {
      const [skills, internships] = await Promise.all([
        getStudentSkills(student._id),
        Promise.resolve({ data: [] })
      ]);
      setStudentData({ skills: skills.data, internships: internships.data });
    } catch {
      setStudentData({ skills: [], internships: [] });
    } finally {
      setLoadingDetail(false);
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h1 className="page-title">Students 👥</h1>
            <p className="page-subtitle">{students.length} registered students</p>
          </div>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input placeholder="Search students..." value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll No.</th>
              <th>Department</th>
              <th>Batch</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                <div className="spinner" style={{ margin: "0 auto" }}></div>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No students found</td></tr>
            ) : filtered.map(student => (
              <tr key={student._id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "32px", height: "32px",
                      background: "var(--gradient-primary)",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", fontWeight: "700", color: "white", flexShrink: 0
                    }}>
                      {student.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>{student.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{student.email}</div>
                    </div>
                  </div>
                </td>
                <td>{student.rollNumber || "—"}</td>
                <td>{student.department || "—"}</td>
                <td>{student.batch || "—"}</td>
                <td>{student.phone || "—"}</td>
                <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-sm btn-outline" onClick={() => openStudent(student)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: "620px" }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selected.name}</h2>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>

            <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
              <div style={{
                width: "72px", height: "72px",
                background: "var(--gradient-primary)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem", fontWeight: "700", color: "white", flexShrink: 0
              }}>
                {selected.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>{selected.name}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{selected.email}</div>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                  {selected.department && <span className="badge badge-purple">{selected.department}</span>}
                  {selected.batch && <span className="badge badge-blue">{selected.batch}</span>}
                  {selected.rollNumber && <span className="badge badge-gray">{selected.rollNumber}</span>}
                </div>
              </div>
            </div>

            {selected.bio && (
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "20px", fontStyle: "italic" }}>
                "{selected.bio}"
              </p>
            )}

            {loadingDetail ? (
              <div className="loading-spinner"><div className="spinner"></div></div>
            ) : (
              <>
                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{ fontWeight: "600", marginBottom: "10px", color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Skills ({studentData.skills.length})
                  </h4>
                  {studentData.skills.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {studentData.skills.map(s => (
                        <span key={s._id} style={{
                          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                          color: "#a5b4fc", padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem",
                          display: "flex", alignItems: "center", gap: "4px"
                        }}>
                          {s.name}
                          {s.verified && " ✅"}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No skills added</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
