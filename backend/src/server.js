const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const dns = require('dns'); // ADD THIS
 
// Force Node.js to use Google DNS to bypass company DNS blocking
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('✅ DNS servers set to:', dns.getServers());
 
// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
 
// Import routes
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes"); // FIXED TYPO (was tiacketRoutes)
 
const app = express();
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
 
// Middleware
app.use(cors({
  origin: frontendOrigin,
  credentials: true,
}));
app.use(express.json());
 
// MongoDB URI
const mongoURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
 
if (!mongoURI) {
  console.error("❌ MONGODB_URI is not set. Please add it to your .env file.");
  process.exit(1);
}
 
// Routes
app.get("/", (req, res) => {
  res.send("SupportSync API is running");
});
 
app.get("/test-db", async (req, res) => {
  try {
    const database = mongoose.connection.db;
    if (!database) {
      return res.status(500).json({ error: "Database not ready" });
    }
    const collections = await database.listCollections().toArray();
    res.json({ collections: collections.map((c) => c.name) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
 
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
 
// Connect to MongoDB and start server
mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    connectTimeoutMS: 30000,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Auth routes: http://localhost:${PORT}/api/auth`);
      console.log(`🎫 Ticket routes: http://localhost:${PORT}/api/tickets`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    if (err.name === 'MongooseServerSelectionError') {
      console.error("🔍 This is usually a network or DNS issue. The DNS override should help.");
    }
    process.exit(1);
  });