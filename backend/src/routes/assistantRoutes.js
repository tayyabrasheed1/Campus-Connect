const express = require("express");
const { listFaqs, searchFaqs, queryFaq } = require("../controllers/assistantController");
const { optionalProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", listFaqs);
router.get("/faqs", listFaqs);
router.get("/search", searchFaqs);
router.post("/query", optionalProtect, queryFaq);

module.exports = router;
