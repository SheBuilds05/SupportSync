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


// This allows your specific Render frontend AND your local machine to talk to the backend
const allowedOrigins = [
  "https://supportsync-frontend.onrender.com", // Your Render URL
  "http://localhost:5173"                       // Your local Vite URL
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: This origin is not allowed'), false);
    }
  },
  credentials: true,
}));

app.use(express.json());

// --- DATABASE CONNECTION ---
// Make sure the key in Render Environment is exactly MONGODB_URI
const mongoURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

if (!mongoURI) {
  console.error("❌ MONGODB_URI is not set in Render Environment Variables.");
  process.exit(1);
}

// Routes
app.get("/", (req, res) => {
  res.send("SupportSync API is running");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use('/api/admin', adminRoutes);

// Connect to MongoDB and start server
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    
app.get('/test-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({ collections: collections.length > 0 });
  } catch (err) {
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
});
    // Important: Use 0.0.0.0 for Render to bind correctly
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
