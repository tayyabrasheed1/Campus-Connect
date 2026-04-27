const clone = (value) => JSON.parse(JSON.stringify(value));

const nowIso = () => new Date().toISOString();

const initialEvents = [
  {
    id: "ev-1",
    title: "AI & ML Summit",
    subtitle: "CS Department",
    date: "Mar 22, 2026 - 10:00 AM",
    location: "CS Block, SZABIST",
    attendees: 145,
    tag: "Tech",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1100&q=80",
    createdBy: "seed",
    createdAt: nowIso(),
  },
  {
    id: "ev-2",
    title: "FYP Showcase 2026",
    subtitle: "Final Year Committee",
    date: "Apr 01, 2026 - 09:00 AM",
    location: "Main Auditorium",
    attendees: 220,
    tag: "Events",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1100&q=80",
    createdBy: "seed",
    createdAt: nowIso(),
  },
  {
    id: "ev-3",
    title: "Basketball Tournament",
    subtitle: "Sports Society",
    date: "Mar 26, 2026 - 03:00 PM",
    location: "Sports Ground",
    attendees: 88,
    tag: "Sports",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1100&q=80",
    createdBy: "seed",
    createdAt: nowIso(),
  },
  {
    id: "ev-4",
    title: "Startup Pitch Night",
    subtitle: "Entrepreneurship Club",
    date: "Apr 05, 2026 - 05:00 PM",
    location: "Via Zoom",
    attendees: 60,
    tag: "Tech",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1100&q=80",
    createdBy: "seed",
    createdAt: nowIso(),
  },
];

const initialChatRooms = [
  { id: "c1", name: "CS 2022 Batch",       tone: "orange", dept: "Computer Science",      batch: "CS 2022",  isBroadcast: false, createdAt: nowIso() },
  { id: "c2", name: "AI/ML Study Group",  tone: "purple", dept: "Research Group",         batch: null,       isBroadcast: false, createdAt: nowIso() },
  { id: "c3", name: "Software Eng. Dept", tone: "blue",   dept: "Software Engineering",   batch: null,       isBroadcast: false, createdAt: nowIso() },
  { id: "c4", name: "FYP Group - Team 12",tone: "green",  dept: "Project Group",           batch: null,       isBroadcast: false, createdAt: nowIso() },
  { id: "c5", name: "Campus Announcements",tone: "gold", dept: "Admin",                   batch: null,       isBroadcast: true,  createdAt: nowIso() },
  { id: "c6", name: "Business Admin",     tone: "pink",   dept: "Business Administration", batch: "BBA 2022", isBroadcast: false, createdAt: nowIso() },
];

const initialChatMessages = {
  c1: [
    { id: "m1", sender: "teacher", text: "Don't forget tomorrow's quiz!", time: "2m", createdAt: nowIso() },
    { id: "m2", sender: "me", text: "Thanks for the reminder.", time: "1m", createdAt: nowIso() },
  ],
  c2: [
    { id: "m3", sender: "member", text: "I shared the new dataset link", time: "15m", createdAt: nowIso() },
    { id: "m4", sender: "me", text: "Got it, reviewing now.", time: "12m", createdAt: nowIso() },
  ],
  c3: [
    { id: "m5", sender: "member", text: "Sprint review at 4pm today", time: "1h", createdAt: nowIso() },
    { id: "m6", sender: "me", text: "Confirmed.", time: "40m", createdAt: nowIso() },
  ],
  c4: [
    { id: "m7", sender: "member", text: "Proposal is done", time: "3h", createdAt: nowIso() },
    { id: "m8", sender: "me", text: "Perfect, sending it now.", time: "2h", createdAt: nowIso() },
  ],
  c5: [
    { id: "m9",  sender: "system", text: "Mid exams schedule posted!",               time: "5h",  createdAt: nowIso() },
    { id: "m11", sender: "system", text: "Library hours extended until 10pm this week.",time: "3h",  createdAt: nowIso() },
    { id: "m12", sender: "system", text: "Reminder: Fee submission deadline is May 5.",  time: "1h",  createdAt: nowIso() },
  ],
  c6: [
    { id: "m13", sender: "member", text: "Case study uploaded to Hub",               time: "1d",  createdAt: nowIso() },
    { id: "m14", sender: "teacher",text: "BBA assignment due Friday, upload on LMS.",time: "6h",  createdAt: nowIso() },
    { id: "m15", sender: "me",     text: "Thanks, will check.",                     time: "5h",  createdAt: nowIso() },
  ],
};

const state = {
  events: clone(initialEvents),
  registeredByUser: {},
  chatRooms: clone(initialChatRooms),
  chatMessages: clone(initialChatMessages),
};

const getUserId = (user) => String(user?._id || user?.id || "guest");

const listEventsForUser = (user) => {
  const userId = getUserId(user);
  const registrations = new Set(state.registeredByUser[userId] || []);
  return state.events.map((event) => ({
    ...event,
    status: registrations.has(event.id) ? "registered" : "open",
  }));
};

const listMyEventsForUser = (user) => listEventsForUser(user).filter((event) => event.status === "registered");

const createEvent = (user, payload) => {
  const userId = getUserId(user);
  const createdEvent = {
    id: `ev-${Date.now()}`,
    title: payload.title,
    subtitle: payload.subtitle || "Created by you",
    description: payload.description || "",
    date: payload.date,
    location: payload.location,
    attendees: 0,
    maxParticipants: Number(payload.maxParticipants) || 0,
    isPublic: Boolean(payload.isPublic),
    tag: payload.tag || "Events",
    image:
      payload.image ||
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1100&q=80",
    createdBy: userId,
    createdAt: nowIso(),
  };

  state.events.unshift(createdEvent);
  return createdEvent;
};

const registerForEvent = (user, eventId) => {
  const userId = getUserId(user);
  const event = state.events.find((item) => item.id === eventId);
  if (!event) return null;

  const currentRegistrations = new Set(state.registeredByUser[userId] || []);
  if (currentRegistrations.has(eventId)) {
    return { event, alreadyRegistered: true };
  }

  currentRegistrations.add(eventId);
  state.registeredByUser[userId] = Array.from(currentRegistrations);
  event.attendees += 1;

  return { event, alreadyRegistered: false };
};

const listChatRooms = () => {
  return state.chatRooms.map((room) => {
    const messages = state.chatMessages[room.id] || [];
    const latest = messages[messages.length - 1] || { text: "No messages yet", time: "" };
    const unread = messages.filter((msg) => msg.sender !== "me").length;
    return {
      ...room,
      msg: latest.text,
      time: latest.time || "now",
      unread,
    };
  });
};

const listMessagesForRoom = (chatId) => {
  if (!state.chatMessages[chatId]) return null;
  return state.chatMessages[chatId];
};

const addMessageToRoom = (chatId, text, extra = {}) => {
  if (!state.chatMessages[chatId]) return null;

  const message = {
    id: `m-${Date.now()}`,
    sender: "me",
    text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    createdAt: nowIso(),
    ...(extra.type && { type: extra.type }),
    ...(extra.fileData && { fileData: extra.fileData }),
    ...(extra.fileName && { fileName: extra.fileName }),
  };

  state.chatMessages[chatId].push(message);
  return message;
};

module.exports = {
  listEventsForUser,
  listMyEventsForUser,
  createEvent,
  registerForEvent,
  listChatRooms,
  listMessagesForRoom,
  addMessageToRoom,
};
