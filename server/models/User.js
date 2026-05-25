const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    department: { type: String, default: "" },
    batch: { type: String, default: "" },
    rollNumber: { type: String, default: "" },
    phone: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    bio: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
