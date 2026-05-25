import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/profile");
export const updateProfile = (data) => API.put("/auth/profile", data);
export const getAllStudents = () => API.get("/auth/students");

// Skills
export const addSkill = (data) => API.post("/skills", data);
export const getMySkills = () => API.get("/skills/my");
export const getAllSkills = () => API.get("/skills/all");
export const getStudentSkills = (id) => API.get(`/skills/student/${id}`);
export const updateSkill = (id, data) => API.put(`/skills/${id}`, data);
export const deleteSkill = (id) => API.delete(`/skills/${id}`);
export const endorseSkill = (id) => API.post(`/skills/${id}/endorse`);
export const verifySkill = (id) => API.post(`/skills/${id}/verify`);

// Internships
export const addInternship = (data) => API.post("/internships", data);
export const getMyInternships = () => API.get("/internships/my");
export const getAllInternships = () => API.get("/internships/all");
export const getInternshipStats = () => API.get("/internships/stats");
export const updateInternship = (id, data) => API.put(`/internships/${id}`, data);
export const deleteInternship = (id) => API.delete(`/internships/${id}`);
export const approveInternship = (id) => API.post(`/internships/${id}/approve`);

// Placements
export const addPlacement = (data) => API.post("/placements", data);
export const getMyPlacements = () => API.get("/placements/my");
export const getAllPlacements = () => API.get("/placements/all");
export const getPlacementStats = () => API.get("/placements/stats");
export const updatePlacement = (id, data) => API.put(`/placements/${id}`, data);
export const deletePlacement = (id) => API.delete(`/placements/${id}`);
export const approvePlacement = (id) => API.post(`/placements/${id}/approve`);

export default API;
