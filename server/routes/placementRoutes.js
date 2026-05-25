const express = require("express");
const router = express.Router();
const {
  addPlacement, getMyPlacements, getAllPlacements,
  updatePlacement, deletePlacement, approvePlacement, getStats
} = require("../controllers/placementController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, addPlacement);
router.get("/my", protect, getMyPlacements);
router.get("/all", protect, adminOnly, getAllPlacements);
router.get("/stats", protect, adminOnly, getStats);
router.put("/:id", protect, updatePlacement);
router.delete("/:id", protect, deletePlacement);
router.post("/:id/approve", protect, adminOnly, approvePlacement);

module.exports = router;
