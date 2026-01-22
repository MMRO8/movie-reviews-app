const express = require("express");
const AdminDAO = require("../dao/adminDAO.js");

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const stats = await AdminDAO.getStats();
    res.json(stats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
