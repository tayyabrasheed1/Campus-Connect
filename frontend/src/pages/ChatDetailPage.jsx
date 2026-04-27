import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/common/BottomNav";
import TopBar from "../components/common/TopBar";
import { chatRooms } from "../data/mockData";
import AlertMessage from "../components/common/AlertMessage";
import Loader from "../components/common/Loader";
import { chatApi } from "../services/api";

const seedMessages = {
  c1: [
    { id: "m1", sender: "teacher", text: "Don't forget tomorrow's quiz!", time: "2m" },
    { id: "m2", sender: "me", text: "Thanks for the reminder.", time: "1m" },
  ],
  c2: [
    { id: "m1", sender: "member", text: "I shared the new dataset link", time: "15m" },
    { id: "m2", sender: "me", text: "Got it, reviewing now.", time: "12m" },
  ],
  c3: [
    { id: "m1", sender: "member", text: "Sprint review at 4pm today", time: "1h" },
    { id: "m2", sender: "me", text: "Confirmed.", time: "40m" },
  ],
  c4: [
    { id: "m1", sender: "member", text: "Proposal is done", time: "3h" },
    { id: "m2", sender: "me", text: "Perfect, sending it now.", time: "2h" },
  ],
  c5: [
    { id: "m1", sender: "system", text: "Mid exams schedule posted!", time: "5h" },
    { id: "m2", sender: "me", text: "Thanks for sharing.", time: "4h" },
  ],
};

const ChatDetailPage = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [rooms, setRooms] = useState(chatRooms);
  const chat = useMemo(() => rooms.find((room) => room.id === chatId), [chatId, rooms]);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(seedMessages[chatId] || []);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    let isMounted = true;

    const loadChatData = async () => {
      setIsLoading(true);
      try {
        const [roomsResponse, messagesResponse] = await Promise.all([chatApi.rooms(), chatApi.messages(chatId)]);
        if (!isMounted) return;
        setRooms(roomsResponse.data.results || []);
        setMessages(messagesResponse.data.results || []);
      } catch {
        if (!isMounted) return;
        setRooms(chatRooms);
        setMessages(seedMessages[chatId] || []);
        setMessage({ type: "error", text: "Unable to load live chat. Showing demo conversation." });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadChatData();

    return () => {
      isMounted = false;
    };
  }, [chatId]);

  if (!chat) {
    return (
      <main className="mobile-shell">
        <TopBar title="Department Chats" />
        <section className="feed">
          <section className="card chat-detail-card">
            <h3>Chat not found</h3>
            <p>This room does not exist.</p>
            <Link className="primary-link" to="/chats">
              Back to chats
            </Link>
          </section>
        </section>
        <BottomNav />
      </main>
    );
  }

  const handleSend = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    try {
      const { data } = await chatApi.sendMessage(chatId, { text: trimmed });
      setMessages((current) => [...current, data.data]);
      setDraft("");
    } catch {
      setMessages((current) => [...current, { id: `${Date.now()}`, sender: "me", text: trimmed, time: "now" }]);
      setDraft("");
    }
  };

  return (
    <main className="mobile-shell">
      <TopBar title={chat.name} />

      <section className="feed chat-detail-shell">
        <button className="secondary-btn chat-back-btn" type="button" onClick={() => navigate("/chats")}>Back to chats</button>

        <section className="card chat-thread-card">
          <p className="chat-thread-subtitle">{chat.msg}</p>
          <AlertMessage type={message.type} message={message.text} />
          {isLoading ? <Loader label="Loading chat..." /> : null}

          <div className="chat-thread">
            {messages.map((message) => (
              <article key={message.id} className={`chat-bubble chat-bubble-${message.sender}`}>
                <p>{message.text}</p>
                <span>{message.time}</span>
              </article>
            ))}
          </div>

          <div className="chat-compose">
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a message..."
              aria-label="Write a message"
            />
            <button type="button" onClick={handleSend}>
              Send
            </button>
          </div>
        </section>
      </section>

      <BottomNav />
    </main>
  );
};

export default ChatDetailPage;