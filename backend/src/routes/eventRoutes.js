const express = require("express");
const {
  listEvents,
  listMyEvents,
  createEventEntry,
  registerEvent,
} = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", listEvents);
router.get("/my", listMyEvents);
router.post("/", createEventEntry);
router.post("/:id/register", registerEvent);

module.exports = router;
