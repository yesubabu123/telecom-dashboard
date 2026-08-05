require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 Telecom Dashboard Backend Running");
});

// Import Routes
// Uncomment these if you have these route files

// const simRoutes = require("./routes/simRoutes");
// app.use("/api/sims", simRoutes);

// const userRoutes = require("./routes/userRoutes");
// app.use("/api/users", userRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});