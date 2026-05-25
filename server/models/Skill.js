const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Programming", "Framework", "Database", "Tool", "Soft Skill", "Other"],
      default: "Other"
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Beginner"
    },
    endorsedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
