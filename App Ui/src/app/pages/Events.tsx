import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, Users, QrCode, Plus, ChevronRight, Filter } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { eventApi } from "../../services/api";

const months = ["Mar 2026", "Apr 2026", "May 2026"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type EventItem = {
  id: string;
  title: string;
  org: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  image: string;
  registered: boolean;
  online: boolean;
  category: string;
  maxParticipants?: number;
};

type CreateEventForm = {
  title: string;
  location: string;
  date: string;
  time: string;
  maxParticipants: string;
  category: string;
  description: string;
};

const campusLocationOptions = [
  "SZABIST Islamabad Main Auditorium",
  "Admissions Office",
  "Student Affairs Office",
  "SZABIST Library",
  "Computer Science Department Office",
  "Student Cafeteria",
  "Sports Complex",
  "IT Helpdesk",
];

const demoEvents: EventItem[] = [
  {
    id: "1",
    title: "AI & ML Summit",
    org: "CS Department",
    date: "Mar 22",
    time: "10:00 AM",
    location: "CS Block, SZABIST",
    attendees: 145,
    image: "https://images.unsplash.com/photo-1646579886135-068c73800308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    registered: true,
    online: false,
    category: "Tech",
  },
  {
    id: "2",
    title: "FYP Showcase 2026",
    org: "Final Year Committee",
    date: "Apr 01",
    time: "09:00 AM",
    location: "Main Auditorium",
    attendees: 220,
    image: "https://images.unsplash.com/photo-1763890763377-abd05301034d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    registered: false,
    online: false,
    category: "Events",
  },
  {
    id: "3",
    title: "Basketball Tournament",
    org: "Sports Society",
    date: "Mar 26",
    time: "03:00 PM",
    location: "Sports Ground",
    attendees: 88,
    image: "https://images.unsplash.com/photo-1696861270495-7f35c35c3273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    registered: false,
    online: false,
    category: "Sports",
  },
  {
    id: "4",
    title: "Startup Pitch Night",
    org: "Entrepreneurship Club",
    date: "Apr 05",
    time: "05:00 PM",
    location: "Via Zoom",
    attendees: 60,
    image: "https://images.unsplash.com/photo-1701576766277-c6160505581d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    registered: false,
    online: true,
    category: "Tech",
  },
];

const calDates = [17, 18, 19, 20, 21, 22, 23];

export function Events() {
  const [activeMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState(22);
  const [showCreate, setShowCreate] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [events, setEvents] = useState<EventItem[]>(demoEvents);
  const [registeredIds, setRegisteredIds] = useState<string[]>(["1"]);
  const [createForm, setCreateForm] = useState<CreateEventForm>({
    title: "",
    location: "SZABIST Islamabad Main Auditorium",
    date: "",
    time: "",
    maxParticipants: "50",
    category: "Events",
    description: "",
  });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const payload = (await eventApi.list()) as unknown as {
          results?: Array<Record<string, unknown>>;
          events?: Array<Record<string, unknown>>;
        };

        const source = Array.isArray(payload.results)
          ? payload.results
          : Array.isArray(payload.events)
            ? payload.events
            : [];

        if (source.length === 0) {
          setEvents(demoEvents);
          setRegisteredIds(demoEvents.filter((event) => event.registered).map((event) => event.id));
          return;
        }

        const normalized = source.map((item) => {
          const rawDate = String(item.date ?? "");
          const dateParts = rawDate.includes("-") ? rawDate.split("-") : [rawDate, ""];

          const location = String(item.location ?? "TBA");
          return {
            id: String(item.id ?? item._id ?? Math.random()),
            title: String(item.title ?? "Untitled Event"),
            org: String(item.subtitle ?? item.org ?? "Campus Connect"),
            date: dateParts[0].trim() || "TBD",
            time: dateParts[1]?.trim() || "TBD",
            location,
            attendees: Number(item.attendees ?? 0),
            image: String(
              item.image ??
                "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1100&q=80"
            ),
            registered: String(item.status ?? "") === "registered",
            online: location.toLowerCase().includes("zoom") || location.toLowerCase().includes("online"),
            category: String(item.tag ?? item.category ?? "Events"),
            maxParticipants: Number(item.maxParticipants ?? 0),
          } satisfies EventItem;
        });

        setEvents(normalized);
        setRegisteredIds(normalized.filter((event) => event.registered).map((event) => event.id));
      } catch {
        setEvents(demoEvents);
        setRegisteredIds(demoEvents.filter((event) => event.registered).map((event) => event.id));
      }
    };

    loadEvents();
  }, []);

  const toggleRegister = async (id: string) => {
    if (registeredIds.includes(id)) return;

    try {
      await eventApi.register(id);
    } catch {
      // Keep UI responsive even if backend request fails.
    }

    setRegisteredIds((prev) => [...prev, id]);
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, attendees: event.attendees + 1 } : event)));
  };

  const handleCreateEvent = async () => {
    if (!createForm.title.trim() || !createForm.location.trim() || !createForm.date || !createForm.time) {
      return;
    }

    const payload = {
      title: createForm.title.trim(),
      subtitle: "Created by you",
      description: createForm.description.trim(),
      date: `${createForm.date} - ${createForm.time}`,
      location: createForm.location.trim(),
      maxParticipants: Number(createForm.maxParticipants) || 0,
      isPublic: true,
      tag: createForm.category,
    };

    setIsPosting(true);
    try {
      const response = (await eventApi.create(payload)) as unknown as {
        event?: Record<string, unknown>;
      };

      const created = response.event;
      if (created) {
        const rawDate = String(created.date ?? "");
        const dateParts = rawDate.includes("-") ? rawDate.split("-") : [rawDate, ""];

        const normalizedCreated: EventItem = {
          id: String(created.id ?? created._id ?? Math.random()),
          title: String(created.title ?? payload.title),
          org: String(created.subtitle ?? "Created by you"),
          date: dateParts[0].trim() || createForm.date,
          time: dateParts[1]?.trim() || createForm.time,
          location: String(created.location ?? payload.location),
          attendees: Number(created.attendees ?? 0),
          image: String(
            created.image ??
              "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1100&q=80"
          ),
          registered: false,
          online: false,
          category: String(created.tag ?? payload.tag),
          maxParticipants: Number(created.maxParticipants ?? payload.maxParticipants),
        };

        setEvents((prev) => [normalizedCreated, ...prev]);
      }

      setCreateForm({
        title: "",
        location: "SZABIST Islamabad Main Auditorium",
        date: "",
        time: "",
        maxParticipants: "50",
        category: "Events",
        description: "",
      });
      setShowCreate(false);
    } catch {
      // Keep flow graceful in demo mode even if backend call fails.
      const fallback: EventItem = {
        id: `local-${Date.now()}`,
        title: createForm.title.trim(),
        org: "Created by you",
        date: createForm.date,
        time: createForm.time,
        location: createForm.location,
        attendees: 0,
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1100&q=80",
        registered: false,
        online: false,
        category: createForm.category,
        maxParticipants: Number(createForm.maxParticipants) || 0,
      };
      setEvents((prev) => [fallback, ...prev]);
      setShowCreate(false);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-[#F7F7F9] min-h-full pb-6">
      {/* Header */}
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 font-semibold">Campus Events</h3>
          <div className="flex gap-2">
            <button className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
              <Filter size={14} className="text-gray-600" />
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 bg-[#FF6B2B] text-white text-xs px-3 py-2 rounded-xl"
            >
              <Plus size={13} />
              Create
            </button>
          </div>
        </div>

        {/* Month selector */}
        <div className="flex gap-2 mb-4">
          {months.map((m, i) => (
            <button
              key={m}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                i === activeMonth ? "bg-[#FF6B2B] text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Calendar strip */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {calDates.map((d, i) => (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all ${
                selectedDate === d ? "bg-[#1A1A1A] text-white" : "bg-gray-50 text-gray-500"
              }`}
            >
              <span className="text-[10px] uppercase">{days[i]}</span>
              <span className="text-sm font-semibold">{d}</span>
              {d === 22 && (
                <span className={`w-1 h-1 rounded-full ${selectedDate === 22 ? "bg-[#FF6B2B]" : "bg-[#FF6B2B]"}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* My Registered Events */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-800">My Events</p>
          <button className="text-xs text-[#FF6B2B] flex items-center gap-0.5">See all <ChevronRight size={12} /></button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {events.filter(e => registeredIds.includes(e.id)).map(e => (
            <div key={e.id} className="flex-shrink-0 w-48 bg-white rounded-2xl overflow-hidden shadow-sm">
              <ImageWithFallback src={e.image} alt={e.title} className="w-full h-24 object-cover" />
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-800 leading-tight">{e.title}</p>
                <div className="flex items-center gap-1 mt-1.5 text-gray-400 text-[10px]">
                  <Calendar size={10} />
                  <span>{e.date} • {e.time}</span>
                </div>
                <button className="mt-2 w-full flex items-center justify-center gap-1.5 border border-gray-200 rounded-lg py-1.5 text-[10px] text-gray-600">
                  <QrCode size={11} />
                  View QR Ticket
                </button>
              </div>
            </div>
          ))}
          {registeredIds.length === 0 && (
            <div className="flex-shrink-0 w-full bg-white rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-xs">No registered events yet</p>
            </div>
          )}
        </div>
      </div>

      {/* All Events */}
      <div className="px-4 mt-5">
        <p className="text-sm font-semibold text-gray-800 mb-3">All Events</p>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl flex overflow-hidden shadow-sm">
              <div className="relative w-24 flex-shrink-0">
                <ImageWithFallback src={event.image} alt={event.title} className="w-full h-full object-cover" />
                {event.online && (
                  <span className="absolute top-2 left-1 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">Online</span>
                )}
              </div>
              <div className="flex-1 p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{event.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{event.org}</p>
                  </div>
                  <span className="text-[9px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-1">{event.category}</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-gray-400 text-[10px]">
                  <Clock size={9} />
                  <span>{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                    <MapPin size={9} />
                    <span className="truncate max-w-[100px]">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                    <Users size={9} />
                    <span>
                      {event.attendees}
                      {event.maxParticipants && event.maxParticipants > 0 ? `/${event.maxParticipants}` : ""}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleRegister(event.id)}
                  className={`mt-2 w-full py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                    registeredIds.includes(event.id)
                      ? "bg-gray-100 text-gray-500"
                      : "bg-[#FF6B2B] text-white"
                  }`}
                >
                  {registeredIds.includes(event.id) ? "Registered ✓" : "Register"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreate && (
        <div className="absolute inset-0 bg-black/50 z-40 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Create Event</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 text-sm">Close</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Event Name</label>
                <input
                  value={createForm.title}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Give a name to your event"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Event Type</label>
                <select
                  value={createForm.category}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B] bg-white"
                >
                  {["Tech", "Academic", "Sports", "Society", "Events"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Location (SZABIST Islamabad)</label>
                <select
                  value={createForm.location}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B] bg-white"
                >
                  {campusLocationOptions.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Date</label>
                  <input
                    type="date"
                    value={createForm.date}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Start Time</label>
                  <input
                    type="time"
                    value={createForm.time}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, time: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">People Needed</label>
                <input
                  type="number"
                  min={1}
                  value={createForm.maxParticipants}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, maxParticipants: e.target.value }))}
                  placeholder="50"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Event Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="What is your event about?"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B] resize-none"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <p className="text-sm text-gray-700">Public Event</p>
                <div className="w-12 h-6 bg-[#FF6B2B] rounded-full flex items-center px-1">
                  <div className="w-5 h-5 bg-white rounded-full ml-auto shadow" />
                </div>
              </div>
              <button
                onClick={handleCreateEvent}
                disabled={isPosting}
                className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-medium"
              >
                {isPosting ? "Posting..." : "Post Event"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
