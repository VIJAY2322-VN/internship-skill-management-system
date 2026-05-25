const express = require("express");
const router = express.Router();
const {
  addInternship, getMyInternships, getAllInternships, getStudentInternships,
  updateInternship, deleteInternship, approveInternship, getStats
} = require("../controllers/internshipController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, addInternship);
router.get("/my", protect, getMyInternships);
router.get("/all", protect, adminOnly, getAllInternships);
router.get("/stats", protect, adminOnly, getStats);
router.get("/student/:studentId", protect, getStudentInternships);
router.put("/:id", protect, updateInternship);
router.delete("/:id", protect, deleteInternship);
router.post("/:id/approve", protect, adminOnly, approveInternship);

module.exports = router;
