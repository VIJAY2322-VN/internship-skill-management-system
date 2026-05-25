const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.log("⚠️  Server running without DB. Please check your MONGO_URI.");
    // Don't exit - allows server to start for testing
  }
};

module.exports = connectDB;
