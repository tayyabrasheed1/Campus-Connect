const Report = require("../models/Report");
const Log = require("../models/Log");

const severityByCategory = {
  harassment: "critical",
  assault: "critical",
  bullying: "high",
  discrimination: "high",
  theft: "high",
  safety: "medium",
  misconduct: "medium",
  general: "low",
};

const submitReport = async (req, res) => {
  try {
    const { title, description, category, location, violationType, evidenceLinks, evidence } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const normalizedCategory = String(category || "general").toLowerCase();
    const normalizedViolation = String(violationType || normalizedCategory || "general").toLowerCase();
    const severity = severityByCategory[normalizedViolation] || severityByCategory[normalizedCategory] || "medium";
    const safeEvidence = Array.isArray(evidenceLinks)
      ? evidenceLinks.filter((item) => typeof item === "string" && item.trim()).slice(0, 5)
      : [];

    const report = await Report.create({
      userId: req.user._id,
      title,
      description,
      category: normalizedCategory,
      evidence: String(evidence || evidenceLinks?.[0] || "").trim(),
      violationType: normalizedViolation,
      severity,
      evidenceLinks: safeEvidence,
      location: location || "",
      submittedBy: req.user._id,
    });

    await Log.create({
      action: "submitted",
      performedBy: req.user._id,
      actor: req.user._id,
      report: report._id,
      details: `${title} | severity=${severity} | violation=${normalizedViolation}`,
    });

    return res.status(201).json({ message: "Report submitted successfully", report });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit report" });
  }
};

const listMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ submittedBy: req.user._id }).sort({ createdAt: -1 });
    return res.json({ count: reports.length, results: reports });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch reports" });
  }
};

module.exports = {
  submitReport,
  listMyReports,
};
