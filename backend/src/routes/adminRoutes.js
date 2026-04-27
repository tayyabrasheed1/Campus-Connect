const express = require("express");
const {
  listAllReports,
  resolveReport,
  suspendUser,
  moderationLogs,
  listKnowledgeBase,
  createKnowledgeEntry,
  updateKnowledgeEntry,
  deleteKnowledgeEntry,
} = require("../controllers/adminController");
const { seedFaqs } = require("../controllers/seedController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("admin"));

router.get("/reports", listAllReports);
router.get("/logs", moderationLogs);
router.get("/knowledge", listKnowledgeBase);
router.post("/knowledge", createKnowledgeEntry);
router.patch("/knowledge/:id", updateKnowledgeEntry);
router.delete("/knowledge/:id", deleteKnowledgeEntry);
router.patch("/reports/:id/resolve", resolveReport);
router.patch("/users/:id/suspend", suspendUser);
router.post("/seed/faqs", seedFaqs);

module.exports = router;
