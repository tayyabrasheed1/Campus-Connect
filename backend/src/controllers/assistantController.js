const FAQ = require("../models/FAQ");

const buildFilter = (search, category) => {
  const filter = {};

  if (category) {
    filter.category = new RegExp(`^${category}$`, "i");
  }

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ question: regex }, { answer: regex }, { keywords: regex }];
  }

  return filter;
};

const getQueryText = (input) => String(input || "").trim();

const scoreMatch = (entry, query) => {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return 0;
  let score = 0;
  if (entry.question.toLowerCase().includes(q)) score += 4;
  if (entry.answer.toLowerCase().includes(q)) score += 2;
  if ((entry.keywords || []).some((keyword) => q.includes(keyword) || keyword.includes(q))) score += 3;
  if ((entry.policyCode || "").toLowerCase().includes(q)) score += 1;
  return score;
};

const personalizedGuidance = (role, query) => {
  const q = String(query || "").toLowerCase();
  if (role === "student" && (q.includes("courses") || q.includes("credit") || q.includes("semester"))) {
    return "Student guidance: meet your advisor before add/drop week and keep core course prerequisites in sequence.";
  }
  if (role === "faculty" && q.includes("leave")) {
    return "Faculty guidance: submit leave plans with replacement lecture notes to your department for continuity.";
  }
  if (role === "alumni" && (q.includes("transcript") || q.includes("degree"))) {
    return "Alumni guidance: keep your alumni ID and national ID copy ready for document verification.";
  }
  return "General guidance: use keywords like policy code, office name, or category for more precise answers.";
};

const listFaqs = async (req, res) => {
  try {
    const { search = "", category = "", sourceType = "" } = req.query;
    const filter = buildFilter(search, category);
    if (sourceType) {
      filter.sourceType = new RegExp(`^${sourceType}$`, "i");
    }
    const faqs = await FAQ.find(filter).sort({ createdAt: -1 });

    return res.json({ count: faqs.length, results: faqs });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch FAQs" });
  }
};

const searchFaqs = async (req, res) => {
  try {
    const { q = "", category = "" } = req.query;
    const query = getQueryText(q);
    const filter = buildFilter(query, category);
    const faqs = await FAQ.find(filter).sort({ createdAt: -1 }).limit(50);

    return res.json({ count: faqs.length, results: faqs });
  } catch (error) {
    return res.status(500).json({ message: "Failed to search FAQs" });
  }
};

const queryFaq = async (req, res) => {
  try {
    const { query = "", category = "" } = req.body;
    const q = getQueryText(query);
    const filter = buildFilter(q, category);
    const faqs = await FAQ.find(filter).limit(100);
    const ranked = faqs.map((entry) => ({ entry, score: scoreMatch(entry, q) })).sort((a, b) => b.score - a.score);
    const bestMatch = ranked[0];

    if (!bestMatch || bestMatch.score <= 0) {
      return res.json({
        answer: "No relevant answer found",
        matched: null,
        count: 0,
      });
    }

    return res.json({
      answer: bestMatch.entry.answer,
      matched: bestMatch.entry,
      count: 1,
      results: [bestMatch.entry],
      guidance: personalizedGuidance(req.user?.profileType || req.user?.role || "student", q),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to process query" });
  }
};

module.exports = {
  listFaqs,
  searchFaqs,
  queryFaq,
};
