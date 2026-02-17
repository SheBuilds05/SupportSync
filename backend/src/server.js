const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const dns = require('dns');

// Force Node.js to use Google DNS to bypass company DNS blocking
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('✅ DNS servers set to:', dns.getServers());

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import routes
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  // Add your Codespace URLs if needed
  'https://shiny-palm-tree-x5746xrp549w36pp-5173.app.github.dev',
  'https://shiny-palm-tree-x5746xrp549w36pp-5175.app.github.dev',
  process.env.FRONTEND_URL // Keep the env variable as well
].filter(Boolean); // Remove any undefined values

// CORS middleware with dynamic origin checking
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('🚫 Blocked origin:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      callback(new Error('CORS policy: This origin is not allowed'), false);
    }
  },
  credentials: true,
}));

// Add this middleware for debugging (optional)
app.use((req, res, next) => {
  console.log(`📡 Request from: ${req.headers.origin || 'unknown origin'} - ${req.method} ${req.path}`);
  next();
});

app.use(express.json());

// MongoDB URI
const mongoURI = process.env.MONGODB_URI;

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
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Auth routes: http://localhost:${PORT}/api/auth`);
      console.log(`🎫 Ticket routes: http://localhost:${PORT}/api/tickets`);
      console.log(`🌐 Allowed CORS origins:`, allowedOrigins);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    if (err.name === 'MongooseServerSelectionError') {
      console.error("🔍 This is usually a network or DNS issue. The DNS override should help.");
    }
    process.exit(1);
  });