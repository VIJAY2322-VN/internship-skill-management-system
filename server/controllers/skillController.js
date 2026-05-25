const Skill = require("../models/Skill");

exports.addSkill = async (req, res) => {
  try {
    const { name, category, level } = req.body;
    const skill = await Skill.create({
      student: req.user.id,
      name, category, level
    });
    res.status(201).json({ message: "Skill added", skill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({ student: req.user.id });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ student: req.params.studentId }).populate("student", "name email");
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().populate("student", "name email department batch");
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, student: req.user.id });
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    const { name, category, level } = req.body;
    skill.name = name || skill.name;
    skill.category = category || skill.category;
    skill.level = level || skill.level;
    await skill.save();
    res.json({ message: "Skill updated", skill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    await Skill.findOneAndDelete({ _id: req.params.id, student: req.user.id });
    res.json({ message: "Skill deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.endorseSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    if (!skill.endorsedBy.includes(req.user.id)) {
      skill.endorsedBy.push(req.user.id);
    }
    await skill.save();
    res.json({ message: "Skill endorsed", skill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifySkill = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });
    const skill = await Skill.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    res.json({ message: "Skill verified", skill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
