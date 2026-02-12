const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
// MongoDB URI
const mongoURI = "mongodb+srv://nokulungabembe_db_user:UTIGW1vJqoooOpY8@nokulunga.sd4uyzj.mongodb.net/supportsync?retryWrites=true&w=majority";

// Test route
app.get("/test-db", async (req, res) => {
  try {
    const database = mongoose.connection.db; // Native MongoDB database

    if (!database) {
      return res.status(500).json({ error: "Database not ready" });
    }

    const collections = await database.listCollections().toArray();
    res.json({ collections: collections.map(c => c.name) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Connect to MongoDB and start server after connection
mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected ✅");

    // Start Express server only after DB connection
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
