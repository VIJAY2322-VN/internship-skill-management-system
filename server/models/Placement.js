const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    package: { type: Number, default: 0 }, // in LPA
    location: { type: String, default: "" },
    offerDate: { type: Date },
    joiningDate: { type: Date },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interviewed", "Selected", "Rejected"],
      default: "Applied"
    },
    type: { type: String, enum: ["Full-time", "Part-time", "Contract"], default: "Full-time" },
    description: { type: String, default: "" },
    skills: [{ type: String }],
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Placement", placementSchema);
