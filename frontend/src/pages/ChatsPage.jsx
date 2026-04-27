import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/common/TopBar";
import BottomNav from "../components/common/BottomNav";
import { chatRooms } from "../data/mockData";
import Loader from "../components/common/Loader";
import AlertMessage from "../components/common/AlertMessage";
import { chatApi } from "../services/api";

const ChatsPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [rooms, setRooms] = useState(chatRooms);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    let isMounted = true;

    const loadRooms = async () => {
      setIsLoading(true);
      try {
        const { data } = await chatApi.rooms();
        if (!isMounted) return;
        setRooms(data.results || []);
      } catch {
        if (!isMounted) return;
        setRooms(chatRooms);
        setMessage({ type: "error", text: "Unable to load chats from server. Showing demo chats." });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRooms();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleRooms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return rooms;

    return rooms.filter(
      (chat) =>
        chat.name.toLowerCase().includes(normalizedQuery) ||
        String(chat.msg || "").toLowerCase().includes(normalizedQuery)
    );
  }, [query, rooms]);

  const openChat = (chatId) => {
    navigate(`/chats/${chatId}`);
  };

  return (
    <main className="mobile-shell">
      <TopBar title="Department Chats" />

      <section className="feed">
        <section className="card">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search chat rooms..."
            aria-label="Search chat rooms"
          />
          <AlertMessage type={message.type} message={message.text} />
          {isLoading ? <Loader label="Loading chats..." /> : null}

          {visibleRooms.map((chat) => (
            <article
              key={chat.id}
              className="chat-item"
              role="button"
              tabIndex={0}
              onClick={() => openChat(chat.id)}
              onKeyDown={(event) => event.key === "Enter" && openChat(chat.id)}
            >
              <div className={`avatar avatar-${chat.tone || "orange"}`}>{chat.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <h4>{chat.name}</h4>
                <p>{chat.msg}</p>
              </div>
              <div className="chat-meta">
                <span>{chat.time}</span>
                {chat.unread ? <span className="chat-unread">{chat.unread}</span> : null}
              </div>
            </article>
          ))}
        </section>
      </section>

      <BottomNav />
    </main>
  );
};

export default ChatsPage;
