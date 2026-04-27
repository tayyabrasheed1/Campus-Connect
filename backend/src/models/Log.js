const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    details: { type: String, default: "" },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    report: { type: mongoose.Schema.Types.ObjectId, ref: "Report", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);
