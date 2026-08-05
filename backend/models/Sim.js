const mongoose = require("mongoose");

const simSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  provider: {
    type: String,
    enum: ["Nexa", "AstraNet", "OrbitTel"],
    default: "Nexa",
  },
  region: {
    type: String,
    default: "Central",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "blocked"],
    default: "active",
  },
  networkSpeed: {
    type: Number,
    default: 0,
  },
  throughput: {
    type: Number,
    default: 0,
  },
  latency: {
    type: Number,
    default: 0,
  },
  ping: {
    type: Number,
    default: 0,
  },
  signalStrength: {
    type: Number,
    default: 0,
  },
  alertLevel: {
    type: String,
    enum: ["normal", "warning", "critical"],
    default: "normal",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Sim", simSchema);