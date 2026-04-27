import { useEffect, useMemo, useState } from "react";
import TopBar from "../components/common/TopBar";
import BottomNav from "../components/common/BottomNav";
import { featuredEvents } from "../data/mockData";
import EventCard from "../components/common/EventCard";
import AlertMessage from "../components/common/AlertMessage";
import Loader from "../components/common/Loader";
import { eventApi } from "../services/api";

const monthOptions = ["Mar", "Apr", "May"];

const formatEventDateTime = (dateInput, timeInput) => {
  if (!dateInput) return "";

  const safeTime = timeInput || "09:00";
  const baseDate = new Date(`${dateInput}T${safeTime}`);
  if (Number.isNaN(baseDate.getTime())) {
    return `${dateInput} - ${safeTime}`;
  }

  const month = baseDate.toLocaleString("en-US", { month: "short" });
  const day = String(baseDate.getDate()).padStart(2, "0");
  const year = baseDate.getFullYear();
  const formattedTime = baseDate.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${month} ${day}, ${year} - ${formattedTime}`;
};

const monthFromDateLabel = (dateLabel = "") => {
  if (!dateLabel) return "";

  const firstToken = dateLabel.slice(0, 3);
  if (monthOptions.includes(firstToken)) {
    return firstToken;
  }

  const parsed = new Date(dateLabel);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleString("en-US", { month: "short" });
};

const emptyCreateForm = {
  eventName: "",
  location: "",
  eventDate: "",
  startTime: "09:00",
  maxParticipants: "50",
  description: "",
  isPublic: true,
};

const EventsPage = () => {
  const [selectedMonth, setSelectedMonth] = useState("Mar");
  const [events, setEvents] = useState(featuredEvents);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newEvent, setNewEvent] = useState(emptyCreateForm);

  const monthLabel = (monthKey) => `${monthKey} 2026`;

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
        setMessage({ type: "error", text: "Could not load events from server. Showing demo data." });
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

  const filteredEvents = useMemo(() => {
    return events.filter((event) => monthFromDateLabel(event.date) === selectedMonth);
  }, [events, selectedMonth]);

  const myEvents = useMemo(
    () => filteredEvents.filter((event) => event.status === "registered").slice(0, 2),
    [filteredEvents]
  );

  const handleRegister = async (event) => {
    try {
      const { data } = await eventApi.register(event.id);
      setEvents((prev) =>
        prev.map((item) => (item.id === event.id ? { ...item, ...data.event } : item))
      );
      setMessage({ type: "success", text: `${event.title} registration successful.` });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to register for event" });
    }
  };

  const openTicket = (event) => {
    setSelectedTicket(event);
    setMessage({ type: "success", text: `QR ticket opened for ${event.title}.` });
  };

  const onCreateChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateEvent = async (event) => {
    event.preventDefault();

    if (!newEvent.eventName || !newEvent.eventDate || !newEvent.location) {
      setMessage({ type: "error", text: "Event name, date, and location are required" });
      return;
    }

    try {
      const payload = {
        title: newEvent.eventName,
        subtitle: newEvent.description || "Campus event",
        description: newEvent.description,
        date: formatEventDateTime(newEvent.eventDate, newEvent.startTime),
        location: newEvent.location,
        maxParticipants: Number(newEvent.maxParticipants) || 0,
        isPublic: newEvent.isPublic,
        tag: "Events",
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1100&q=80",
      };

      const { data } = await eventApi.create(payload);
      setEvents((prev) => [data.event, ...prev]);
      setMessage({ type: "success", text: `${data.event.title} added to events.` });
      setShowCreateForm(false);
      setNewEvent(emptyCreateForm);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to create event" });
    }
  };

  return (
    <main className="mobile-shell">
      <TopBar title="Campus Events" />

      <section className="feed">
        <section className="events-header">
          <div>
            <h3>Campus Events</h3>
            <p className="muted">Browse, register, and manage your event tickets.</p>
          </div>
          <div className="events-header-actions">
            <button type="button" className="filter-btn" aria-label="Filter events">
              ⏷
            </button>
            <button type="button" className="create-event-btn" onClick={() => setShowCreateForm((prev) => !prev)}>
              + Create
            </button>
          </div>
        </section>

        {showCreateForm ? (
          <section className="card create-event-card">
            <div className="event-row">
              <h3>Create Event</h3>
              <button type="button" className="secondary-btn" onClick={() => setShowCreateForm(false)}>
                Close
              </button>
            </div>

            <form className="create-event-form" onSubmit={handleCreateEvent}>
              <label htmlFor="eventName">Event Name</label>
              <input
                id="eventName"
                name="eventName"
                value={newEvent.eventName}
                onChange={onCreateChange}
                placeholder="Give a name to your event"
              />

              <label htmlFor="location">Location / Platform</label>
              <input
                id="location"
                name="location"
                value={newEvent.location}
                onChange={onCreateChange}
                placeholder="E.g. CS Block or Zoom link"
              />

              <label htmlFor="eventDate">Date</label>
              <input id="eventDate" name="eventDate" type="date" value={newEvent.eventDate} onChange={onCreateChange} />

              <label htmlFor="startTime">Start Time</label>
              <input id="startTime" name="startTime" type="time" value={newEvent.startTime} onChange={onCreateChange} />

              <label htmlFor="maxParticipants">Max Participants</label>
              <input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                min="1"
                value={newEvent.maxParticipants}
                onChange={onCreateChange}
              />

              <label htmlFor="description">Event Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={newEvent.description}
                onChange={onCreateChange}
                placeholder="What is your event about?"
              />

              <div className="create-event-toggle-row">
                <span>Public Event</span>
                <label className="create-event-switch" htmlFor="isPublic">
                  <input id="isPublic" name="isPublic" type="checkbox" checked={newEvent.isPublic} onChange={onCreateChange} />
                  <span className="create-event-switch-track" />
                </label>
              </div>

              <button type="submit" className="create-event-submit">Post Event</button>
            </form>
          </section>
        ) : null}

        <section className="card">
          <div className="month-chips">
            {monthOptions.map((monthKey) => (
              <button
                key={monthKey}
                type="button"
                className={selectedMonth === monthKey ? "tab-active" : ""}
                onClick={() => setSelectedMonth(monthKey)}
              >
                {monthLabel(monthKey)}
              </button>
            ))}
          </div>
          <div className="week-strip">
            <span>MON 17</span>
            <span>TUE 18</span>
            <span>WED 19</span>
            <span>THU 20</span>
            <span>FRI 21</span>
            <span className="day-active">SAT 22</span>
            <span>SUN 23</span>
          </div>
        </section>

        <section className="card">
          <h3>My Events</h3>
          <AlertMessage type={message.type} message={message.text} />
          {isLoadingEvents ? <Loader label="Loading events..." /> : null}
          <div className="grid-two">
            {myEvents.length === 0 ? <p className="muted">No registered events this month.</p> : null}
            {myEvents.map((event) => (
              <EventCard key={event.id} event={event} compact onTicket={openTicket} />
            ))}
          </div>
        </section>

        {selectedTicket ? (
          <section className="ticket-overlay" role="dialog" aria-modal="true" aria-label="QR ticket preview">
            <article className="ticket-card">
              <div className="event-row">
                <div>
                  <p className="ticket-kicker">QR Ticket</p>
                  <h3>{selectedTicket.title}</h3>
                </div>
                <button type="button" className="secondary-btn" onClick={() => setSelectedTicket(null)}>
                  Close
                </button>
              </div>

              <div className="ticket-qr" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="ticket-meta">
                <p>{selectedTicket.date}</p>
                <p>{selectedTicket.location}</p>
              </div>
            </article>
          </section>
        ) : null}

        <section className="card">
          <h3>All Events</h3>
          {isLoadingEvents ? <Loader label="Loading events..." /> : null}
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onAction={handleRegister} />
          ))}
        </section>
      </section>

      <BottomNav />
    </main>
  );
};

export default EventsPage;
