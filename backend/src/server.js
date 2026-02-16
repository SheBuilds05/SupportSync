const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env if present
dotenv.config();

const authRoutes = require("./routes/authRoutes");

const app = express();
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  })
);
app.use(express.json());

// MongoDB URI - MUST come from environment for team use.
// Create a .env file with MONGO_URI=... (not committed to git).
const mongoURI = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;
if (!mongoURI) {
  console.error("MONGO_URI is not set. Please add it to your .env file.");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

// Simple root route so hitting http://localhost:5000 shows something
app.get("/", (req, res) => {
  res.send("SupportSync API is running");
});

// Test route to confirm DB connection and list collections
app.get("/test-db", async (req, res) => {
  try {
    const database = mongoose.connection.db; // Native MongoDB database

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

// Auth routes
app.use("/api/auth", authRoutes);

// Connect to MongoDB and start server after connection
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected ✅");

    // Start Express server only after DB connection (0.0.0.0 so reachable from browser/proxy)
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
