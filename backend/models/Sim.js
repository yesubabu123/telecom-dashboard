const mongoose = require("mongoose");

const simSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Sim", simSchema);