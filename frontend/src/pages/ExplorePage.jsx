import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/common/TopBar";
import BottomNav from "../components/common/BottomNav";
import AssistantSearch from "../components/assistant/AssistantSearch";
import { featuredEvents } from "../data/mockData";
import EventCard from "../components/common/EventCard";
import AlertMessage from "../components/common/AlertMessage";
import Loader from "../components/common/Loader";
import { eventApi } from "../services/api";

const categories = ["All", "Events", "Workshops", "Sports", "Tech"];

const ExplorePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Explore");
  const [activeCategory, setActiveCategory] = useState("All");
  const [events, setEvents] = useState(featuredEvents);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const { data } = await eventApi.list();
        if (!isMounted) return;
        setEvents(data.results || []);
      } catch {
        if (!isMounted) return;
        setEvents(featuredEvents);
      } finally {
        if (isMounted) {
          setIsLoadingEvents(false);
        }
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleEvents = useMemo(() => {
    if (activeCategory === "All") return events;
    if (activeCategory === "Sports") {
      return events.filter((event) => event.tag === "Sports");
    }
    if (activeCategory === "Tech") {
      return events.filter((event) => event.tag === "Tech");
    }
    return events;
  }, [activeCategory, events]);

  const openDetails = (event) => {
    setMessage({ type: "success", text: `Opened ${event.title}. Check Events tab for registration.` });
    navigate("/events");
  };

  return (
    <main className="mobile-shell">
      <TopBar title="Campus Connect" />

      <section className="feed">
        <section className="card">
          <input type="text" placeholder="Search events, people, resources..." readOnly />
          <div className="segment-tabs">
            <button type="button" className={activeTab === "Explore" ? "tab-active" : ""} onClick={() => setActiveTab("Explore")}>
              Explore
            </button>
            <button type="button" className={activeTab === "Feed" ? "tab-active" : ""} onClick={() => setActiveTab("Feed")}>
              Feed
            </button>
          </div>
        </section>

        <article className="hero-card">
          <div className="hero-tag">Campus Originals</div>
          <h2>Apply for your membership and get free access to all SZABIST events</h2>
        </article>

        <section className="chip-row">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`chip chip-btn ${activeCategory === category ? "chip-dark" : "chip-muted"}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </section>

        {activeTab === "Explore" ? <AssistantSearch /> : <section className="card"><p className="muted">Feed updates will appear here.</p></section>}

        <section className="card">
          <h3>Featured Events</h3>
          <AlertMessage type={message.type} message={message.text} />
          {isLoadingEvents ? <Loader label="Loading events..." /> : null}
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} actionMode="details" onAction={openDetails} />
          ))}
        </section>
      </section>

      <BottomNav />
    </main>
  );
};

export default ExplorePage;
