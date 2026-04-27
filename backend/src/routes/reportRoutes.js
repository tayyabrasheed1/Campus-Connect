const express = require("express");
const { submitReport, listMyReports } = require("../controllers/reportController");
const { listAllReports, resolveReport } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, submitReport);
router.get("/", protect, allowRoles("admin"), listAllReports);
router.get("/my", protect, listMyReports);
router.put("/:id", protect, allowRoles("admin"), resolveReport);

module.exports = router;
