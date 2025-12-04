const mongoose = require("mongoose");
const sessionSchema = new mongoose.Schema({
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  canvasData: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Session", sessionSchema);
