const FAQ = require("../models/FAQ");
const faqSeed = require("../data/faqSeed");

const seedFaqs = async (req, res) => {
  try {
    let insertedCount = 0;
    for (const entry of faqSeed) {
      const existing = await FAQ.findOne({ question: entry.question });
      if (!existing) {
        await FAQ.create(entry);
        insertedCount += 1;
      }
    }

    const total = await FAQ.countDocuments();
    return res.status(201).json({
      message: insertedCount > 0 ? "Knowledge base seed updated" : "Knowledge base already up to date",
      inserted: insertedCount,
      total,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to seed FAQs" });
  }
};

module.exports = { seedFaqs };
