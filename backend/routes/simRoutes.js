const express = require("express");
const router = express.Router();
const Sim = require("../models/Sim");

const summarizeSims = (sims) => {
  const activeCount = sims.filter((sim) => sim.status === "active").length;
  const total = sims.length;
  const averageThroughput = total
    ? sims.reduce((sum, sim) => sum + sim.throughput, 0) / total
    : 0;
  const criticalCount = sims.filter((sim) => sim.alertLevel === "critical").length;

  const providerCounts = sims.reduce((acc, sim) => {
    const provider = sim.provider || "Nexa";
    acc[provider] = (acc[provider] || 0) + 1;
    return acc;
  }, {});

  const topProvider = Object.entries(providerCounts)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0])[0] || "Nexa";

  return {
    total,
    activeCount,
    averageThroughput: Number(averageThroughput.toFixed(1)),
    criticalCount,
    topProvider,
  };
};

// ➤ Add SIM data
router.post("/add", async (req, res) => {
  try {
    const sim = new Sim(req.body);
    await sim.save();
    res.json(sim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Get all SIM data
router.get("/", async (req, res) => {
  try {
    const sims = await Sim.find();
    res.json(sims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Telecom summary metrics
router.get("/summary", async (req, res) => {
  try {
    const sims = await Sim.find();
    res.json(summarizeSims(sims));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// � Get SIMs by provider
router.get("/provider/:provider", async (req, res) => {
  try {
    const sims = await Sim.find({ provider: req.params.provider });
    res.json(sims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔍 Get SIM by phone number
router.get("/:phoneNumber", async (req, res) => {
  try {
    const sim = await Sim.findOne({ phoneNumber: req.params.phoneNumber });

    if (!sim) {
      return res.status(404).json({ message: "SIM not found" });
    }

    res.json(sim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update SIM status
router.put("/update/:number", async (req, res) => {
  try {
    const sim = await Sim.findOneAndUpdate(
      { phoneNumber: req.params.number },
      { status: req.body.status },
      { new: true }
    );

    res.json(sim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;