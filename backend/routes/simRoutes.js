const express = require("express");
const router = express.Router();
const Sim = require("../models/Sim");

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
// 🔍 Get SIM by phone number
router.get("/:phoneNumber", async (req, res) => {
  try {
    const sim = await Sim.findOne({
      phoneNumber: req.params.phoneNumber
    });

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