const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, default: "general" },
    evidence: { type: String, default: "" },
    location: { type: String, default: "" },
    violationType: { type: String, default: "general" },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    evidenceLinks: [{ type: String, trim: true }],
    moderationNotes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "in_review", "resolved"],
      default: "pending",
    },
    resolvedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
