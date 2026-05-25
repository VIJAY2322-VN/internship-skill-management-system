const Placement = require("../models/Placement");

exports.addPlacement = async (req, res) => {
  try {
    const { company, role, package: pkg, location, offerDate, joiningDate, status, type, description, skills } = req.body;
    const placement = await Placement.create({
      student: req.user.id,
      company, role, package: pkg || 0,
      location, offerDate, joiningDate,
      status: status || "Applied",
      type: type || "Full-time",
      description,
      skills: skills || []
    });
    res.status(201).json({ message: "Placement added", placement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyPlacements = async (req, res) => {
  try {
    const placements = await Placement.find({ student: req.user.id }).sort("-createdAt");
    res.json(placements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPlacements = async (req, res) => {
  try {
    const placements = await Placement.find()
      .populate("student", "name email department batch rollNumber")
      .sort("-createdAt");
    res.json(placements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePlacement = async (req, res) => {
  try {
    const placement = await Placement.findOne({ _id: req.params.id, student: req.user.id });
    if (!placement) return res.status(404).json({ message: "Placement not found" });
    Object.assign(placement, req.body);
    await placement.save();
    res.json({ message: "Placement updated", placement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePlacement = async (req, res) => {
  try {
    await Placement.findOneAndDelete({ _id: req.params.id, student: req.user.id });
    res.json({ message: "Placement deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approvePlacement = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });
    const placement = await Placement.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, approvedBy: req.user.id },
      { new: true }
    );
    res.json({ message: "Placement approved", placement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Placement.countDocuments();
    const selected = await Placement.countDocuments({ status: "Selected" });
    const avgPackage = await Placement.aggregate([
      { $match: { status: "Selected" } },
      { $group: { _id: null, avg: { $avg: "$package" } } }
    ]);
    const byStatus = await Placement.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    res.json({
      total, selected,
      avgPackage: avgPackage[0]?.avg || 0,
      byStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
