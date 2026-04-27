const express = require("express");
const { suspendUser } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.delete("/:id", protect, allowRoles("admin"), suspendUser);

module.exports = router;