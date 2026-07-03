const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const simRoutes = require("./routes/simRoutes");
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/sim", simRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});