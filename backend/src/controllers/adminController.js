const Report = require("../models/Report");
const User = require("../models/User");
const Log = require("../models/Log");
const FAQ = require("../models/FAQ");

const listAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("submittedBy", "fullName email role")
      .populate("resolvedBy", "fullName email")
      .sort({ createdAt: -1 });

    return res.json({ count: reports.length, results: reports });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch reports" });
  }
};

const resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { moderationNotes = "" } = req.body;
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "resolved";
    report.moderationNotes = moderationNotes || report.moderationNotes;
    report.resolvedBy = req.user._id;
    report.resolvedByUserId = req.user._id;
    report.resolvedAt = new Date();
    await report.save();

    await Log.create({
      action: "resolved",
      performedBy: req.user._id,
      actor: req.user._id,
      report: report._id,
      targetUser: report.submittedBy,
      details: `${report.title} | notes=${report.moderationNotes || "n/a"}`,
    });

    return res.json({ message: "Report resolved", report });
  } catch (error) {
    return res.status(500).json({ message: "Failed to resolve report" });
  }
};

const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = "Violation of campus community standards", suspensionType = "permanent" } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin cannot be suspended" });
    }

    user.isSuspended = true;
    user.suspensionType = suspensionType === "temporary" ? "temporary" : "permanent";
    user.suspendedReason = reason;
    user.suspendedAt = new Date();
    await user.save();

    await Log.create({
      action: "suspended",
      performedBy: req.user._id,
      actor: req.user._id,
      targetUser: user._id,
      details: `${user.email} | ${user.suspensionType} | ${reason}`,
    });

    return res.json({ message: "User suspended successfully", userId: user._id, suspensionType: user.suspensionType });
  } catch (error) {
    return res.status(500).json({ message: "Failed to suspend user" });
  }
};

const moderationLogs = async (req, res) => {
  try {
    const logs = await Log.find({
      action: { $in: ["submitted", "resolved", "suspended", "PASSWORD_RESET"] },
    })
      .populate("performedBy", "name fullName email role")
      .populate("actor", "name fullName email role")
      .populate("targetUser", "fullName email role")
      .populate("report", "title category severity status")
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json({ count: logs.length, results: logs });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch moderation logs" });
  }
};

const listKnowledgeBase = async (req, res) => {
  try {
    const { search = "", sourceType = "", audience = "" } = req.query;
    const filter = {};

    if (sourceType) {
      filter.sourceType = new RegExp(`^${sourceType}$`, "i");
    }
    if (audience) {
      filter.audience = audience.toLowerCase();
    }
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ question: regex }, { answer: regex }, { keywords: regex }, { policyCode: regex }];
    }

    const entries = await FAQ.find(filter).sort({ updatedAt: -1 });
    return res.json({ count: entries.length, results: entries });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch knowledge base" });
  }
};

const createKnowledgeEntry = async (req, res) => {
  try {
    const { question, answer, category, keywords = [], sourceType = "faq", policyCode = "", audience = ["all"] } = req.body;
    if (!question || !answer || !category) {
      return res.status(400).json({ message: "Question, answer and category are required" });
    }

    const entry = await FAQ.create({
      question: String(question).trim(),
      answer: String(answer).trim(),
      category: String(category).trim().toLowerCase(),
      keywords: Array.isArray(keywords)
        ? keywords.map((item) => String(item).trim().toLowerCase()).filter(Boolean)
        : String(keywords)
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean),
      sourceType,
      policyCode: String(policyCode || "").trim().toUpperCase(),
      audience: Array.isArray(audience) && audience.length ? audience : ["all"],
    });

    await Log.create({
      action: "KNOWLEDGE_ENTRY_CREATED",
      actor: req.user._id,
      details: `${entry.question} | ${entry.sourceType}`,
    });

    return res.status(201).json({ message: "Knowledge entry created", entry });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create knowledge entry" });
  }
};

const updateKnowledgeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, keywords, sourceType, policyCode, audience } = req.body;
    const entry = await FAQ.findById(id);
    if (!entry) {
      return res.status(404).json({ message: "Knowledge entry not found" });
    }

    if (question !== undefined) entry.question = String(question).trim();
    if (answer !== undefined) entry.answer = String(answer).trim();
    if (category !== undefined) entry.category = String(category).trim().toLowerCase();
    if (sourceType !== undefined) entry.sourceType = sourceType;
    if (policyCode !== undefined) entry.policyCode = String(policyCode || "").trim().toUpperCase();
    if (keywords !== undefined) {
      entry.keywords = Array.isArray(keywords)
        ? keywords.map((item) => String(item).trim().toLowerCase()).filter(Boolean)
        : String(keywords)
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);
    }
    if (audience !== undefined) {
      entry.audience = Array.isArray(audience) && audience.length ? audience : ["all"];
    }

    await entry.save();

    await Log.create({
      action: "KNOWLEDGE_ENTRY_UPDATED",
      actor: req.user._id,
      details: `${entry._id} | ${entry.question}`,
    });

    return res.json({ message: "Knowledge entry updated", entry });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update knowledge entry" });
  }
};

const deleteKnowledgeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await FAQ.findByIdAndDelete(id);
    if (!entry) {
      return res.status(404).json({ message: "Knowledge entry not found" });
    }

    await Log.create({
      action: "KNOWLEDGE_ENTRY_DELETED",
      actor: req.user._id,
      details: `${entry._id} | ${entry.question}`,
    });

    return res.json({ message: "Knowledge entry deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete knowledge entry" });
  }
};

module.exports = {
  listAllReports,
  resolveReport,
  suspendUser,
  moderationLogs,
  listKnowledgeBase,
  createKnowledgeEntry,
  updateKnowledgeEntry,
  deleteKnowledgeEntry,
};
