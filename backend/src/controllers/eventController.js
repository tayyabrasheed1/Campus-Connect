const {
  listEventsForUser,
  listMyEventsForUser,
  createEvent,
  registerForEvent,
} = require("../data/moduleStore");

const listEvents = async (req, res) => {
  const results = listEventsForUser(req.user);
  return res.json({ results });
};

const listMyEvents = async (req, res) => {
  const results = listMyEventsForUser(req.user);
  return res.json({ results });
};

const createEventEntry = async (req, res) => {
  const { title, date, location } = req.body;

  if (!title || !date || !location) {
    return res.status(400).json({ message: "Title, date, and location are required" });
  }

  const created = createEvent(req.user, req.body);
  return res.status(201).json({ message: "Event created", event: { ...created, status: "open" } });
};

const registerEvent = async (req, res) => {
  const { id } = req.params;
  const result = registerForEvent(req.user, id);

  if (!result) {
    return res.status(404).json({ message: "Event not found" });
  }

  return res.json({
    message: result.alreadyRegistered ? "Already registered" : "Registered successfully",
    event: {
      ...result.event,
      status: "registered",
    },
  });
};

module.exports = {
  listEvents,
  listMyEvents,
  createEventEntry,
  registerEvent,
};
