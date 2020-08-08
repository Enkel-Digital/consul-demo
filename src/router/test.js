const express = require("express");
const router = new express.Router();
const ConsulConfig = require("../utils/consul");
const consul = new ConsulConfig();

router.get("/health", async (req, res) => {
  try {
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const all = await consul.listAllServices();
    res.status(200).json({ success: true, all });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/user/info", async (req, res) => {
  try {
    const user = await consul.getUserConfig();
    res.status(200).json(`name: ${user.name}  age: ${user.age}`);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post("/user", async (req, res) => {
  try {
    await consul.setUserConfig("age", 18);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
