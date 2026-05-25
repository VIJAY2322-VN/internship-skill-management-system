const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    domain: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    stipend: { type: Number, default: 0 },
    location: { type: String, default: "" },
    type: { type: String, enum: ["Remote", "On-site", "Hybrid"], default: "Remote" },
    status: {
      type: String,
      enum: ["Applied", "Selected", "Ongoing", "Completed", "Rejected"],
      default: "Applied"
    },
    description: { type: String, default: "" },
    offerLetter: { type: String, default: "" },
    certificate: { type: String, default: "" },
    skills: [{ type: String }],
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isApproved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Internship", internshipSchema);
