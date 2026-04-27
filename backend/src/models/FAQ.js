const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    keywords: [{ type: String, trim: true, lowercase: true }],
    sourceType: { type: String, enum: ["faq", "policy", "handbook"], default: "faq" },
    policyCode: { type: String, default: "" },
    audience: [{ type: String, enum: ["student", "faculty", "alumni", "all"], default: "all" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("FAQ", faqSchema);
