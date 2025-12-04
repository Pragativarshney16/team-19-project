const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const auth = require("../middleware/auth");
router.post("/", auth, async (req, res) => {
  const session = await Session.create({ name: req.body.name || "Untitled", owner: req.user._id, canvasData: "" });
  res.json(session);
});
router.get("/:id", auth, async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ msg: "Not found" });
  res.json(session);
});
router.put("/:id", auth, async (req, res) => {
  const session = await Session.findByIdAndUpdate(req.params.id, { canvasData: req.body.canvasData }, { new: true });
  res.json(session);
});
router.get("/", auth, async (req, res) => {
  const sessions = await Session.find().sort({ createdAt: -1 }).limit(50);
  res.json(sessions);
});
module.exports = router;