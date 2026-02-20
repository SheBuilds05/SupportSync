const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const adminRoutes = require('./routes/adminRoutes'); 

const app = express();

// --- 1. FIXED CORS SETUP ---
const allowedOrigins = [
  "https://supportsync-frontend.onrender.com", 
  "http://localhost:5173"
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error('CORS policy: This origin is not allowed'), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// --- 2. MIDDLEWARE ---
app.use(express.json());

// --- 3. DATABASE CONNECTION ---
const mongoURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

if (!mongoURI) {
  console.error("❌ MONGODB_URI is not set in Render Environment Variables.");
  process.exit(1);
}

// --- 4. ROUTES (Moved outside the .then to ensure they are registered) ---
app.get("/", (req, res) => {
  res.send("SupportSync API is running");
});

app.get('/test-db', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({ collections: collections.length >= 0 });
  } catch (err) {
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use('/api/admin', adminRoutes);

// --- 5. START SERVER ---
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
