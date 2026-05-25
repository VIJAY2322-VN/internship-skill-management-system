const express = require("express");
const router = express.Router();
const {
  addSkill, getMySkills, getStudentSkills, getAllSkills,
  updateSkill, deleteSkill, endorseSkill, verifySkill
} = require("../controllers/skillController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, addSkill);
router.get("/my", protect, getMySkills);
router.get("/all", protect, adminOnly, getAllSkills);
router.get("/student/:studentId", protect, getStudentSkills);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);
router.post("/:id/endorse", protect, endorseSkill);
router.post("/:id/verify", protect, adminOnly, verifySkill);

module.exports = router;
