const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/supportsync"; // For local


mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on("error", (err) => console.error("MongoDB connection error:", err));
db.once("open", () => console.log("MongoDB connected ✅"));

module.exports = db;
