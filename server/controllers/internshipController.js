const Internship = require("../models/Internship");

exports.addInternship = async (req, res) => {
  try {
    const { company, role, domain, startDate, endDate, stipend, location, type, description, skills } = req.body;
    const internship = await Internship.create({
      student: req.user.id,
      company, role, domain, startDate, endDate,
      stipend: stipend || 0,
      location, type, description,
      skills: skills || []
    });
    res.status(201).json({ message: "Internship added", internship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ student: req.user.id }).sort("-createdAt");
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate("student", "name email department batch rollNumber")
      .populate("approvedBy", "name")
      .sort("-createdAt");
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ student: req.params.studentId }).sort("-createdAt");
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findOne({ _id: req.params.id, student: req.user.id });
    if (!internship) return res.status(404).json({ message: "Internship not found" });
    Object.assign(internship, req.body);
    await internship.save();
    res.json({ message: "Internship updated", internship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInternship = async (req, res) => {
  try {
    await Internship.findOneAndDelete({ _id: req.params.id, student: req.user.id });
    res.json({ message: "Internship deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveInternship = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });
    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, approvedBy: req.user.id },
      { new: true }
    );
    res.json({ message: "Internship approved", internship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Internship.countDocuments();
    const byStatus = await Internship.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const byType = await Internship.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);
    res.json({ total, byStatus, byType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
