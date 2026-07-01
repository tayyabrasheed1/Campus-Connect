import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search, Send, Paperclip, Image, ChevronLeft,
  Users, Info, Lock, Megaphone, Pin, FileText,
} from "lucide-react";
import { chatApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

// ─── Types ─────────────────────────────────────────────────────────────────────

type ChatRoom = {
  id: string;
  name: string;
  dept: string;
  batch: string | null;
  lastMsg: string;
  time: string;
  unread: number;
  avatar: string;
  color: string;
  isBroadcast: boolean;
};

type MsgType = "text" | "image" | "file";

type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
  type?: MsgType;
  fileData?: string;
  fileName?: string;
};

// ─── Demo data ─────────────────────────────────────────────────────────────────

const demoChatRooms: ChatRoom[] = [
  { id: "c1", name: "CS 2022 Batch",         dept: "Computer Science",       batch: "CS 2022",  lastMsg: "Don't forget tomorrow's quiz!",  time: "2m",  unread: 5, avatar: "CS", color: "#FF6B2B", isBroadcast: false },
  { id: "c2", name: "AI/ML Study Group",     dept: "Research Group",         batch: null,       lastMsg: "I shared the new dataset link",  time: "15m", unread: 2, avatar: "AI", color: "#8B5CF6", isBroadcast: false },
  { id: "c3", name: "Software Eng. Dept",    dept: "Software Engineering",   batch: null,       lastMsg: "Sprint review at 4pm today",     time: "1h",  unread: 0, avatar: "SE", color: "#3B82F6", isBroadcast: false },
  { id: "c4", name: "FYP Group - Team 12",   dept: "Project Group",          batch: null,       lastMsg: "Proposal is done ✅",             time: "3h",  unread: 1, avatar: "FY", color: "#10B981", isBroadcast: false },
  { id: "c5", name: "Campus Announcements",  dept: "Admin Channel",          batch: null,       lastMsg: "Mid exams schedule posted!",     time: "5h",  unread: 0, avatar: "CA", color: "#F59E0B", isBroadcast: true  },
  { id: "c6", name: "Business Admin",        dept: "Business Administration",batch: "BBA 2022", lastMsg: "Case study uploaded to Hub",     time: "1d",  unread: 0, avatar: "BA", color: "#EC4899", isBroadcast: false },
];

const demoMessages: ChatMessage[] = [
  { id: "d-1", sender: "Ayesha K.",  text: "Hey team! Has anyone finished the prototype demo?",              time: "10:15 AM", isMe: false },
  { id: "d-2", sender: "Me",         text: "Almost done, just fixing the UI for the proposal module",       time: "10:17 AM", isMe: true  },
  { id: "d-3", sender: "Ahmed A.",   text: "I've pushed the Campus Mapper code, check the repo 🚀",         time: "10:20 AM", isMe: false },
  { id: "d-4", sender: "Abdullah",   text: "Campus Assistant is working now! LangChain integration smooth", time: "10:22 AM", isMe: false },
  { id: "d-5", sender: "Me",         text: "Proposal is done ✅ Submitting tonight",                        time: "10:35 AM", isMe: true  },
  { id: "d-6", sender: "Ayesha K.",  text: "Amazing work everyone! Ms. Saira will be impressed 💪",         time: "10:36 AM", isMe: false },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const toneColorMap: Record<string, string> = {
  orange: "#FF6B2B",
  purple: "#8B5CF6",
  blue:   "#3B82F6",
  green:  "#10B981",
  gold:   "#F59E0B",
  pink:   "#EC4899",
};

function toAvatar(name: string): string {
  const tokens = name.split(" ").filter(Boolean);
  if (tokens.length === 0) return "CC";
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase();
  return `${tokens[0][0]}${tokens[1][0]}`.toUpperCase();
}

function toDept(name: string, raw?: string): string {
  if (raw) return raw;
  if (name.toLowerCase().includes("batch")) return "Computer Science";
  if (name.toLowerCase().includes("announcements")) return "Admin Channel";
  if (name.toLowerCase().includes("group")) return "Project Group";
  if (name.toLowerCase().includes("dept")) return "Department Channel";
  return "Campus Community";
}

function toDisplaySender(sender: string): string {
  if (sender === "me") return "Me";
  if (sender === "teacher") return "Teacher";
  if (sender === "system") return "System";
  if (sender === "member") return "Member";
  return sender;
}

function mapMessage(raw: Record<string, unknown>, fallbackId: number): ChatMessage {
  const sender = String(raw.sender ?? "member");
  return {
    id: String(raw.id ?? `m-${fallbackId}`),
    sender: toDisplaySender(sender),
    text: String(raw.text ?? ""),
    time: String(raw.time ?? "now"),
    isMe: sender === "me",
    type: (raw.type as MsgType) ?? "text",
    fileData: raw.fileData ? String(raw.fileData) : undefined,
    fileName: raw.fileName ? String(raw.fileName) : undefined,
  };
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function Chats() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [newMsg, setNewMsg] = useState("");
  const [rooms, setRooms] = useState<ChatRoom[]>(demoChatRooms);
  const [msgs, setMsgs] = useState<ChatMessage[]>(demoMessages);
  const [search, setSearch] = useState("");
  const [messagesByRoom, setMessagesByRoom] = useState<Record<string, ChatMessage[]>>({});
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // ── Secure in-domain check ──────────────────────────────────────────────────
  const isDomainUser = Boolean(user?.email?.endsWith("@szabist-isb.edu.pk"));

  // ── Auto-open room from Marketplace redirect ───────────────────────────────
  useEffect(() => {
    const savedActiveChat = localStorage.getItem("cc_active_chat_id");
    if (savedActiveChat) {
      setActiveChat(savedActiveChat);
      localStorage.removeItem("cc_active_chat_id"); // Clear to prevent sticky opens
    }
  }, []);

  // ── Load rooms ──────────────────────────────────────────────────────────────
  const loadRooms = useCallback(async () => {
    setIsLoadingRooms(true);
    try {
      const payload = (await chatApi.rooms()) as unknown as {
        results?: Array<Record<string, unknown>>;
        rooms?: Array<Record<string, unknown>>;
      };
      const source = Array.isArray(payload.results)
        ? payload.results
        : Array.isArray((payload as Record<string, unknown[]>).rooms)
          ? (payload as { rooms: Array<Record<string, unknown>> }).rooms
          : [];

      const customRaw = localStorage.getItem("cc_custom_chat_rooms");
      const customRooms = customRaw ? JSON.parse(customRaw) : [];

      if (source.length === 0) {
        setRooms([...customRooms, ...demoChatRooms]);
        return;
      }

      const normalized = source.map((room) => {
        const name = String(room.name ?? "Campus Chat");
        const tone = String(room.tone ?? "orange").toLowerCase();
        return {
          id: String(room.id ?? room._id ?? Math.random()),
          name,
          dept: toDept(name, room.dept ? String(room.dept) : undefined),
          batch: room.batch ? String(room.batch) : null,
          lastMsg: String(room.msg ?? room.lastMsg ?? "No messages yet"),
          time: String(room.time ?? "now"),
          unread: Number(room.unread ?? 0),
          avatar: toAvatar(name),
          color: toneColorMap[tone] ?? "#FF6B2B",
          isBroadcast: Boolean(room.isBroadcast ?? false),
        } satisfies ChatRoom;
      });
      setRooms([...customRooms, ...normalized]);
    } catch {
      const customRaw = localStorage.getItem("cc_custom_chat_rooms");
      const customRooms = customRaw ? JSON.parse(customRaw) : [];
      setRooms([...customRooms, ...demoChatRooms]);
    } finally {
      setIsLoadingRooms(false);
    }
  }, []);

  useEffect(() => { loadRooms(); }, [loadRooms]);

  // ── Load messages on room open ───────────────────────────────────────────────
  useEffect(() => {
    if (!activeChat) return;
    if (messagesByRoom[activeChat]) {
      setMsgs(messagesByRoom[activeChat]);
      return;
    }

    if (activeChat.startsWith("m-chat-")) {
      const customMsgsRaw = localStorage.getItem(`cc_msgs_${activeChat}`);
      const customMsgs = customMsgsRaw ? JSON.parse(customMsgsRaw) : [];
      setMessagesByRoom((prev) => ({ ...prev, [activeChat]: customMsgs }));
      setMsgs(customMsgs);
      return;
    }

    (async () => {
      try {
        const payload = (await chatApi.messages(activeChat)) as unknown as {
          results?: Array<Record<string, unknown>>;
          messages?: Array<Record<string, unknown>>;
        };
        const source = Array.isArray(payload.results)
          ? payload.results
          : Array.isArray((payload as Record<string, unknown[]>).messages)
            ? (payload as { messages: Array<Record<string, unknown>> }).messages
            : [];
        const normalized = source.length
          ? source.map((m, i) => mapMessage(m, i + 1))
          : demoMessages;
        setMessagesByRoom((prev) => ({ ...prev, [activeChat]: normalized }));
        setMsgs(normalized);
      } catch {
        setMessagesByRoom((prev) => ({ ...prev, [activeChat]: demoMessages }));
        setMsgs(demoMessages);
      }
    })();
  }, [activeChat]);

  // ── Real-time SSE subscription ───────────────────────────────────────────────
  useEffect(() => {
    if (!activeChat || activeChat.startsWith("m-chat-")) return;
    const token = localStorage.getItem("cc_token");
    const url = `/api/chats/${activeChat}/stream${token ? `?token=${encodeURIComponent(token)}` : ""}`;
    const es = new EventSource(url);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as { type: string; message?: Record<string, unknown> };
        if (data.type === "new_message" && data.message) {
          const msg = mapMessage(data.message, Date.now());
          if (msg.isMe) return; // already added optimistically
          setMsgs((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          setMessagesByRoom((prev) => {
            const existing = prev[activeChat] ?? [];
            if (existing.some((m) => m.id === msg.id)) return prev;
            return { ...prev, [activeChat]: [...existing, msg] };
          });
        }
      } catch { /* ignore parse errors */ }
    };

    return () => es.close();
  }, [activeChat]);

  // ── Auto-scroll ──────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // ── Room list background refresh ─────────────────────────────────────────────
  useEffect(() => {
    const timer = window.setInterval(() => { loadRooms(); }, 15000);
    return () => window.clearInterval(timer);
  }, [loadRooms]);

  // ── Program-based automated grouping ────────────────────────────────────────
  const myRooms = useMemo(() => {
    const userBatch = user?.batch?.toLowerCase() ?? "";
    const userDept  = user?.dept?.toLowerCase()  ?? "";
    return rooms.filter((r) => {
      if (r.id.startsWith("m-chat-")) return true; // Keep marketplace custom rooms pinned
      if (userBatch && r.batch && r.batch.toLowerCase() === userBatch) return true;
      if (userDept  && r.dept  && r.dept.toLowerCase().includes(userDept)) return true;
      if (r.isBroadcast) return true;
      return false;
    });
  }, [rooms, user]);

  const otherRooms = useMemo(
    () => rooms.filter((r) => !myRooms.some((m) => m.id === r.id)),
    [rooms, myRooms]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return null;
    return rooms.filter((r) => r.name.toLowerCase().includes(q) || r.dept.toLowerCase().includes(q));
  }, [rooms, search]);

  const activeRoom = rooms.find((r) => r.id === activeChat);
  const canSend = !activeRoom?.isBroadcast || user?.role === "admin" || user?.role === "faculty";

  // ── Send text message ────────────────────────────────────────────────────────
  const sendMsg = async () => {
    if (!newMsg.trim() || !activeChat) return;
    const outgoing: ChatMessage = {
      id: `m-local-${Date.now()}`,
      sender: "Me",
      text: newMsg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      type: "text",
    };
    setMsgs((prev) => [...prev, outgoing]);
    setMessagesByRoom((prev) => ({ ...prev, [activeChat]: [...(prev[activeChat] ?? []), outgoing] }));
    setNewMsg("");

    // If it's a custom marketplace room, persist to localStorage
    if (activeChat.startsWith("m-chat-")) {
      const customMsgsRaw = localStorage.getItem(`cc_msgs_${activeChat}`);
      const customMsgs = customMsgsRaw ? JSON.parse(customMsgsRaw) : [];
      const updated = [...customMsgs, outgoing];
      localStorage.setItem(`cc_msgs_${activeChat}`, JSON.stringify(updated));

      // Update room lastMsg
      const customRoomsRaw = localStorage.getItem("cc_custom_chat_rooms");
      if (customRoomsRaw) {
        const customRooms = JSON.parse(customRoomsRaw);
        const roomIdx = customRooms.findIndex((r: any) => r.id === activeChat);
        if (roomIdx !== -1) {
          customRooms[roomIdx].lastMsg = outgoing.text;
          customRooms[roomIdx].time = "now";
          localStorage.setItem("cc_custom_chat_rooms", JSON.stringify(customRooms));
        }
      }

      // Simulate instantaneous seller response for premium presentation feel
      setTimeout(() => {
        const sellerName = activeRoom?.dept.split("Seller: ")[1]?.split(" (")[0] || "Seller";
        const reply: ChatMessage = {
          id: `m-reply-${Date.now()}`,
          sender: sellerName,
          text: `Sounds great! Yes, let's meet up at the SZABIST Library / Student Cafeteria tomorrow to trade. What time suits you?`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isMe: false,
          type: "text",
        };

        const currentMsgsRaw = localStorage.getItem(`cc_msgs_${activeChat}`);
        const currentMsgs = currentMsgsRaw ? JSON.parse(currentMsgsRaw) : [];
        const currentUpdated = [...currentMsgs, reply];
        localStorage.setItem(`cc_msgs_${activeChat}`, JSON.stringify(currentUpdated));

        if (activeChat === activeChat) {
          setMsgs(currentUpdated);
          setMessagesByRoom((prev) => ({ ...prev, [activeChat]: currentUpdated }));
        }

        const roomsRaw = localStorage.getItem("cc_custom_chat_rooms");
        if (roomsRaw) {
          const currentRooms = JSON.parse(roomsRaw);
          const roomIdx = currentRooms.findIndex((r: any) => r.id === activeChat);
          if (roomIdx !== -1) {
            currentRooms[roomIdx].lastMsg = reply.text;
            currentRooms[roomIdx].time = "now";
            localStorage.setItem("cc_custom_chat_rooms", JSON.stringify(currentRooms));
          }
        }
        loadRooms();
      }, 1500);
      return;
    }

    try { await chatApi.sendMessage(activeChat, outgoing.text); } catch { /* keep optimistic UI */ }
    loadRooms();
  };

  // ── File / image sharing ─────────────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, kind: "image" | "file") => {
    const file = e.target.files?.[0];
    if (!file || !activeChat) return;
    e.target.value = "";

    if (kind === "image") {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const outgoing: ChatMessage = {
          id: `m-local-${Date.now()}`,
          sender: "Me", text: "",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isMe: true, type: "image", fileData: dataUrl, fileName: file.name,
        };
        setMsgs((prev) => [...prev, outgoing]);
        setMessagesByRoom((prev) => ({ ...prev, [activeChat]: [...(prev[activeChat] ?? []), outgoing] }));
        try { await chatApi.sendMessage(activeChat, "", { type: "image", fileData: dataUrl, fileName: file.name }); } catch { /**/ }
        loadRooms();
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const outgoing: ChatMessage = {
          id: `m-local-${Date.now()}`,
          sender: "Me", text: `📎 ${file.name}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isMe: true, type: "file", fileName: file.name, fileData: dataUrl,
        };
        setMsgs((prev) => [...prev, outgoing]);
        setMessagesByRoom((prev) => ({ ...prev, [activeChat]: [...(prev[activeChat] ?? []), outgoing] }));
        try { await chatApi.sendMessage(activeChat, `📎 ${file.name}`, { type: "file", fileData: dataUrl, fileName: file.name }); } catch { /**/ }
        loadRooms();
      };
      reader.readAsDataURL(file);
    }
  };

  // ─── Secure In-Domain Gate ──────────────────────────────────────────────────
  if (!isDomainUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center">
          <Lock size={28} className="text-gray-400" />
        </div>
        <h3 className="text-gray-700 font-semibold text-base">Secure In-Domain Channel</h3>
        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
          Department Chats are exclusively available to verified{" "}
          <span className="font-medium text-gray-600">@szabist-isb.edu.pk</span>{" "}
          members. Please sign in with your institutional email.
        </p>
      </div>
    );
  }

  // ─── Chat window ────────────────────────────────────────────────────────────
  if (activeChat && activeRoom) {
    return (
      <div className="flex flex-col h-full bg-[#F7F7F9]">
        <input ref={fileInputRef}  type="file" accept="*/*"     className="hidden" onChange={(e) => handleFileSelect(e, "file")} />
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, "image")} />

        {/* Header */}
        <div className="bg-white px-4 pt-3 pb-3 flex items-center gap-3 shadow-sm">
          <button onClick={() => setActiveChat(null)} className="text-gray-600">
            <ChevronLeft size={22} />
          </button>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: activeRoom.color }}>
            {activeRoom.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-gray-900">{activeRoom.name}</p>
              {activeRoom.isBroadcast && (
                <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                  <Megaphone size={8} /> Broadcast
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400">{activeRoom.dept}</p>
          </div>
          <button className="text-gray-400"><Info size={18} /></button>
          <button className="text-gray-400"><Users size={18} /></button>
        </div>

        {/* Broadcast notice */}
        {activeRoom.isBroadcast && !canSend && (
          <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center gap-2">
            <Megaphone size={12} className="text-amber-600" />
            <p className="text-[11px] text-amber-700">Read-only broadcast channel — only admins can post here.</p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {msgs.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] ${msg.isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {!msg.isMe && <span className="text-[10px] text-gray-400 px-1">{msg.sender}</span>}
                {msg.type === "image" && msg.fileData ? (
                  <div className={`rounded-2xl overflow-hidden shadow-sm ${msg.isMe ? "rounded-br-sm" : "rounded-bl-sm"}`}>
                    <img src={msg.fileData} alt={msg.fileName ?? "image"} className="max-w-[200px] max-h-[200px] object-cover" />
                  </div>
                ) : msg.type === "file" ? (
                  // If the message includes fileData (data URL), make it clickable/downloadable.
                  (msg.fileData ? (
                    <a href={msg.fileData} download={msg.fileName} target="_blank" rel="noreferrer" className={`px-4 py-2.5 rounded-2xl text-sm flex items-center gap-2 ${
                      msg.isMe ? "bg-[#FF6B2B] text-white rounded-br-sm" : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                    }`}>
                      <FileText size={14} />
                      <span className="underline">{msg.fileName ?? msg.text}</span>
                    </a>
                  ) : (
                    <div className={`px-4 py-2.5 rounded-2xl text-sm flex items-center gap-2 ${
                      msg.isMe ? "bg-[#FF6B2B] text-white rounded-br-sm" : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                    }`}>
                      <FileText size={14} />
                      <span>{msg.fileName ?? msg.text}</span>
                    </div>
                  ))
                ) : (
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    msg.isMe ? "bg-[#FF6B2B] text-white rounded-br-sm" : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                  }`}>
                    {msg.text}
                  </div>
                )}
                <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input or broadcast lock */}
        {canSend ? (
          <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-inner">
            <button className="text-gray-400" onClick={() => fileInputRef.current?.click()}><Paperclip size={18} /></button>
            <button className="text-gray-400" onClick={() => imageInputRef.current?.click()}><Image size={18} /></button>
            <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                placeholder="Type a message..."
                className="flex-1 outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400"
              />
            </div>
            <button onClick={sendMsg} className="w-10 h-10 bg-[#FF6B2B] rounded-2xl flex items-center justify-center shadow-md">
              <Send size={16} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="bg-amber-50 px-4 py-3 flex items-center justify-center gap-2 border-t border-amber-100">
            <Lock size={14} className="text-amber-500" />
            <p className="text-xs text-amber-600">Broadcast only — listening mode active</p>
          </div>
        )}
      </div>
    );
  }

  // ─── Room list ───────────────────────────────────────────────────────────────

  const RoomRow = ({ room, pinned }: { room: ChatRoom; pinned?: boolean }) => (
    <button
      onClick={() => setActiveChat(room.id)}
      className="w-full bg-white px-4 py-3.5 flex items-center gap-3 border-b border-gray-50 hover:bg-gray-50 transition-colors"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: room.color }}>
          {room.avatar}
        </div>
        {room.isBroadcast && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
            <Megaphone size={8} className="text-white" />
          </div>
        )}
        {pinned && !room.isBroadcast && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B2B] rounded-full flex items-center justify-center">
            <Pin size={8} className="text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">{room.name}</p>
          <span className="text-[10px] text-gray-400">{room.time}</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5">{room.dept}</p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{room.lastMsg}</p>
      </div>
      {room.unread > 0 && (
        <span className="w-5 h-5 bg-[#FF6B2B] text-white text-[10px] rounded-full flex items-center justify-center flex-shrink-0">
          {room.unread}
        </span>
      )}
    </button>
  );

  return (
    <div className="bg-[#F7F7F9] min-h-full pb-6">
      {/* Header */}
      <div className="bg-white px-4 pb-4">
        <h3 className="text-gray-800 font-semibold mb-4">Department Chats</h3>
        <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2.5 gap-2">
          <Search size={15} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chat rooms..."
            className="flex-1 outline-none text-sm text-gray-600 placeholder-gray-300 bg-transparent"
          />
        </div>
      </div>

      {isLoadingRooms && <div className="px-4 py-2 text-xs text-gray-400">Loading chats...</div>}

      <div className="mt-3">
        {filtered ? (
          <>
            {filtered.map((room) => <RoomRow key={room.id} room={room} />)}
            {filtered.length === 0 && <div className="px-4 py-8 text-center text-sm text-gray-400">No chats found</div>}
          </>
        ) : (
          <>
            {/* My Groups – program-based automated grouping */}
            {myRooms.length > 0 && (
              <>
                <div className="px-4 py-2 flex items-center gap-1.5">
                  <Pin size={11} className="text-[#FF6B2B]" />
                  <span className="text-[11px] font-semibold text-[#FF6B2B] uppercase tracking-wide">My Groups</span>
                </div>
                {myRooms.map((room) => <RoomRow key={room.id} room={room} pinned />)}
              </>
            )}
            {/* All other channels */}
            {otherRooms.length > 0 && (
              <>
                <div className="px-4 py-2 mt-2">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">All Channels</span>
                </div>
                {otherRooms.map((room) => <RoomRow key={room.id} room={room} />)}
              </>
            )}
          </>
        )}
      </div>

      <div className="fixed bottom-24 right-6 max-w-[430px]">
        <button className="w-12 h-12 bg-[#FF6B2B] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
          <Users size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
}
