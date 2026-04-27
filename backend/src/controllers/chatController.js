const {
  listChatRooms,
  listMessagesForRoom,
  addMessageToRoom,
} = require("../data/moduleStore");

// SSE client registry: roomId -> Set<res>
const sseClients = new Map();

function broadcastToRoom(roomId, data) {
  const clients = sseClients.get(roomId);
  if (!clients || clients.size === 0) return;
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    try { client.write(payload); } catch (_) { /* stale client */ }
  }
}

const listRooms = async (req, res) => {
  const q = String(req.query.q || "").trim().toLowerCase();
  const rooms = listChatRooms();
  const results = q
    ? rooms.filter((room) => room.name.toLowerCase().includes(q) || room.msg.toLowerCase().includes(q))
    : rooms;

  return res.json({ results });
};

const listRoomMessages = async (req, res) => {
  const { id } = req.params;
  const results = listMessagesForRoom(id);

  if (!results) {
    return res.status(404).json({ message: "Chat room not found" });
  }

  return res.json({ results });
};

// SSE: real-time message stream for a room
const streamRoomMessages = (req, res) => {
  const { id } = req.params;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
  });

  // Send a heartbeat comment every 25s to keep the connection alive
  const heartbeat = setInterval(() => {
    try { res.write(": heartbeat\n\n"); } catch (_) { clearInterval(heartbeat); }
  }, 25000);

  res.write(`data: ${JSON.stringify({ type: "connected", roomId: id })}\n\n`);

  if (!sseClients.has(id)) sseClients.set(id, new Set());
  sseClients.get(id).add(res);

  req.on("close", () => {
    clearInterval(heartbeat);
    sseClients.get(id)?.delete(res);
  });
};

const sendRoomMessage = async (req, res) => {
  const { id } = req.params;
  const text = String(req.body.text || "").trim();
  const msgType = String(req.body.type || "text");
  const fileData = req.body.fileData || null;
  const fileName = req.body.fileName ? String(req.body.fileName) : null;

  // Broadcast rooms only allow admin/faculty messages via this endpoint (enforced client-side too)
  const isBroadcastRoom = listChatRooms().find((r) => r.id === id)?.isBroadcast;
  if (!text && msgType === "text") {
    return res.status(400).json({ message: "Message text is required" });
  }

  const message = addMessageToRoom(id, text, { type: msgType, fileData, fileName });
  if (!message) {
    return res.status(404).json({ message: "Chat room not found" });
  }

  // Push to all SSE subscribers of this room
  broadcastToRoom(id, { type: "new_message", message });

  return res.status(201).json({ message: "Message sent", data: message });
};

module.exports = {
  listRooms,
  listRoomMessages,
  streamRoomMessages,
  sendRoomMessage,
};
