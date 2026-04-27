const express = require("express");
const {
  listRooms,
  listRoomMessages,
  streamRoomMessages,
  sendRoomMessage,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", listRooms);
router.get("/:id/messages", listRoomMessages);
router.get("/:id/stream", streamRoomMessages);
router.post("/:id/messages", sendRoomMessage);

module.exports = router;
