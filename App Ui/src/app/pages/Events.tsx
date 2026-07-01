import { useEffect, useState, useMemo } from "react";
import { Calendar, MapPin, Clock, Users, QrCode, Plus, ChevronRight, Filter, ShieldCheck, Camera, CheckCircle, RefreshCw } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { eventApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

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

// Dynamically generate base mock events relative to current system date
const getDemoEvents = (): EventItem[] => {
  const now = new Date();
  
  // Event 1 is today
  const t1 = now.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  
  // Event 2 is tomorrow
  const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const t2 = d2.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

  // Event 3 is in 2 days
  const d3 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
  const t3 = d3.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

  // Event 4 is in 4 days
  const d4 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4);
  const t4 = d4.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

  return [
    {
      id: "1",
      title: "AI & ML Summit",
      org: "CS Department",
      date: t1,
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
      date: t2,
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
      date: t3,
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
      date: t4,
      time: "05:00 PM",
      location: "Via Zoom",
      attendees: 60,
      image: "https://images.unsplash.com/photo-1701576766277-c6160505581d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      registered: false,
      online: true,
      category: "Tech",
    },
  ];
};

export function Events() {
  const { user } = useAuth();
  
  // Dynamically calculate months starting from current real-world month
  const dynamicMonths = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i = 0; i < 3; i++) {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const name = nextMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      arr.push(name);
    }
    return arr;
  }, []);

  // Dynamically calculate rolling 7-day strip starting from today
  const dynamicCalDates = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const futureDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      arr.push({
        dayName: futureDate.toLocaleDateString("en-US", { weekday: "short" }),
        dateNum: futureDate.getDate(),
        fullStr: futureDate.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
        isToday: i === 0
      });
    }
    return arr;
  }, []);

  const [selectedDate, setSelectedDate] = useState(() => new Date().getDate());
  const [showCreate, setShowCreate] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Dynamic events state
  const [events, setEvents] = useState<EventItem[]>(() => {
    const raw = localStorage.getItem("cc_events");
    return raw ? JSON.parse(raw) : getDemoEvents();
  });

  const [registeredIds, setRegisteredIds] = useState<string[]>(() => {
    const raw = localStorage.getItem("cc_registered_ids");
    return raw ? JSON.parse(raw) : ["1"];
  });

  const [createForm, setCreateForm] = useState<CreateEventForm>({
    title: "",
    location: "SZABIST Islamabad Main Auditorium",
    date: "",
    time: "",
    maxParticipants: "50",
    category: "Events",
    description: "",
  });

  // Ticket modal & coordinator states
  const [activeTicket, setActiveTicket] = useState<EventItem | null>(null);
  const [coordinatorMode, setCoordinatorMode] = useState(false);
  const [selectedScanEventId, setSelectedScanEventId] = useState("1");
  const [isScanning, setIsScanning] = useState(false);
  const [scanningName, setScanningName] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  
  // Attendance checked-in logs
  const [attendanceLogs, setAttendanceLogs] = useState<Array<{ name: string; roll: string; time: string; status: string }>>(() => {
    const raw = localStorage.getItem("cc_attendance_logs");
    return raw ? JSON.parse(raw) : [
      { name: "Sikandar Hayat", roll: "CS-22-205", time: "10:04 AM", status: "Success" }
    ];
  });

  // Keep track of check-in counts per event
  const [checkinCounts, setCheckinCounts] = useState<Record<string, number>>(() => {
    const raw = localStorage.getItem("cc_checkin_counts");
    return raw ? JSON.parse(raw) : { "1": 1 };
  });

  useEffect(() => {
    localStorage.setItem("cc_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("cc_registered_ids", JSON.stringify(registeredIds));
  }, [registeredIds]);

  useEffect(() => {
    localStorage.setItem("cc_attendance_logs", JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  useEffect(() => {
    localStorage.setItem("cc_checkin_counts", JSON.stringify(checkinCounts));
  }, [checkinCounts]);

  const toggleRegister = (id: string) => {
    let updatedRegs;
    if (registeredIds.includes(id)) {
      updatedRegs = registeredIds.filter(x => x !== id);
      setEvents(prev => prev.map(e => e.id === id ? { ...e, attendees: Math.max(0, e.attendees - 1) } : e));
    } else {
      updatedRegs = [...registeredIds, id];
      setEvents(prev => prev.map(e => e.id === id ? { ...e, attendees: e.attendees + 1 } : e));
    }
    setRegisteredIds(updatedRegs);
  };

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, ctx.currentTime); // 1KHz beep
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15); // beep duration 150ms
    } catch {
      // ignore browser block
    }
  };

  const handleSimulateScan = (studentName: string, studentRoll: string) => {
    setIsScanning(true);
    setScanningName(studentName);
    setScanResult(null);

    setTimeout(() => {
      playBeep();
      setIsScanning(false);
      setScanningName(null);
      setScanResult(studentName);

      // Add to check-in counts
      const currentCount = checkinCounts[selectedScanEventId] || 0;
      const updatedCounts = { ...checkinCounts, [selectedScanEventId]: currentCount + 1 };
      setCheckinCounts(updatedCounts);

      // Add to logs
      const log = {
        name: studentName,
        roll: studentRoll,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "Success"
      };
      setAttendanceLogs(prev => [log, ...prev]);
    }, 1800);
  };

  const handleCreateEvent = () => {
    if (!createForm.title.trim() || !createForm.location.trim() || !createForm.date || !createForm.time) {
      alert("Please fill in the Event Name, Location, Date, and Time!");
      return;
    }

    // Format input date into clean user friendly format like "Jun 02"
    const parsedDate = new Date(createForm.date);
    const formattedDateStr = isNaN(parsedDate.getTime()) 
      ? createForm.date 
      : parsedDate.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

    const fallback: EventItem = {
      id: `local-${Date.now()}`,
      title: createForm.title.trim(),
      org: user?.role === "admin" || user?.role === "faculty" ? "SZABIST Coordinator" : "Student Body",
      date: formattedDateStr,
      time: createForm.time,
      location: createForm.location,
      attendees: 0,
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1100&q=80",
      registered: false,
      online: createForm.location.toLowerCase().includes("zoom") || createForm.location.toLowerCase().includes("online"),
      category: createForm.category,
      maxParticipants: Number(createForm.maxParticipants) || 50,
    };

    setEvents((prev) => [fallback, ...prev]);
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
    alert("Event published successfully on the SZABIST portal!");
  };

  const activeScanEvent = events.find(e => e.id === selectedScanEventId) || events[0];

  return (
    <div className="bg-[#F7F7F9] min-h-full pb-6 relative">
      {/* Header */}
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 font-semibold">Campus Events</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCoordinatorMode(!coordinatorMode)}
              className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-xl border transition-all ${
                coordinatorMode 
                  ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30 font-semibold"
                  : "bg-gray-50 text-gray-600 border-gray-200"
              }`}
            >
              <ShieldCheck size={13} />
              {coordinatorMode ? "Coordinator View" : "Go Coordinator"}
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 bg-[#FF6B2B] text-white text-xs px-3 py-2 rounded-xl font-medium"
            >
              <Plus size={13} />
              Create
            </button>
          </div>
        </div>

        {/* Month selector */}
        <div className="flex gap-2 mb-4">
          {dynamicMonths.map((m, i) => (
            <button
              key={m}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                i === 0 ? "bg-[#FF6B2B] text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Calendar strip */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {dynamicCalDates.map((d) => (
            <button
              key={d.dateNum}
              onClick={() => setSelectedDate(d.dateNum)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all ${
                selectedDate === d.dateNum ? "bg-[#1A1A1A] text-white" : "bg-gray-50 text-gray-500"
              }`}
            >
              <span className="text-[10px] uppercase font-semibold">{d.dayName}</span>
              <span className="text-sm font-semibold">{d.dateNum}</span>
              {d.isToday && (
                <span className="w-1 h-1 rounded-full bg-[#FF6B2B]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Coordinator Portal UI overlay style */}
      {coordinatorMode ? (
        <div className="px-4 mt-4 space-y-4">
          <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-4 text-white shadow">
            <h4 className="font-semibold text-sm">SZABIST Event Gatekeeping</h4>
            <p className="text-[11px] opacity-90 mt-1">Simulate real-time QR attendance ticket scanning for events</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="text-xs text-gray-400 block mb-1.5">Select Event to Gatekeep</label>
            <select
              value={selectedScanEventId}
              onChange={(e) => {
                setSelectedScanEventId(e.target.value);
                setScanResult(null);
              }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#10B981] bg-white font-medium"
            >
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.title} ({e.location})</option>
              ))}
            </select>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-500">Status Check</span>
              <span className="text-xs bg-[#10B981]/15 text-[#10B981] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle size={10} /> Active Gatekeep
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">Checked In Attendees</span>
              <span className="text-xs font-bold text-gray-800">
                {checkinCounts[selectedScanEventId] || 0} scanned / {activeScanEvent.attendees} registered
              </span>
            </div>
          </div>

          {/* Scanner view simulation */}
          <div className="bg-[#1A1A1A] rounded-2xl p-4 text-white shadow-inner flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-red-600 animate-pulse text-[9px] px-2 py-0.5 rounded-full font-bold z-30">REC CAMERA</div>
            <p className="text-xs text-gray-400 font-medium mb-3">TICKET SCAN VIEWPORT</p>

            <div className="w-40 h-40 border-2 border-dashed border-[#10B981] rounded-2xl flex items-center justify-center relative overflow-hidden bg-black/70">
              {isScanning ? (
                <>
                  {/* Glowing Laser Sweep */}
                  <div className="absolute inset-x-0 h-0.5 bg-[#10B981] shadow-[0_0_10px_#10B981] animate-[sweep_1.8s_infinite] z-20" />
                  
                  {/* Sliding Mini ticket stub inside scanner */}
                  <div className="absolute bottom-2 w-28 bg-white text-gray-800 rounded-lg p-1.5 shadow-2xl border border-[#10B981] z-10 flex flex-col items-center animate-[slideUp_1.8s_ease-out]">
                    <div className="bg-gray-100 p-1 rounded my-0.5">
                      <svg width="18" height="18" viewBox="0 0 29 29" shapeRendering="crispEdges">
                        <path d="M0 0h7v7H0zm22 0h7v7h-7zM0 22h7v7H0z" fill="#1A1A1A" />
                        <path d="M1 1h5v5H1zm22 0h5v5h-5zM1 23h5v5H1z" fill="#FFFFFF" />
                        <path d="M2 2h3v3H2zm22 0h3v3h-3zM2 24h3v3H2z" fill="#1A1A1A" />
                      </svg>
                    </div>
                    <span className="text-[6px] text-gray-400 font-bold uppercase tracking-widest leading-none">Ticket Pass</span>
                    <span className="text-[7px] font-bold text-gray-700 truncate max-w-[90px] mt-0.5">{scanningName}</span>
                  </div>
                </>
              ) : null}

              {scanResult ? (
                <div className="text-center p-2 z-10 animate-[scaleIn_0.3s_ease-out]">
                  <CheckCircle size={32} className="text-[#10B981] mx-auto mb-1 animate-bounce" />
                  <p className="text-[10px] text-gray-300">VERIFIED</p>
                  <p className="text-xs font-bold text-white truncate max-w-[120px]">{scanResult}</p>
                </div>
              ) : (
                !isScanning && <Camera size={28} className="text-gray-600" />
              )}
            </div>

            <p className="text-[10px] text-gray-400 mt-3 text-center">Click a student below to simulate holding their phone screen to the camera</p>
            
            <div className="grid grid-cols-3 gap-2 w-full mt-4">
              <button
                onClick={() => handleSimulateScan("Tayyab Rasheed", "CS-22-124")}
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 text-[10px] transition-colors"
              >
                Tayyab (CS-124)
              </button>
              <button
                onClick={() => handleSimulateScan("Bilal Ahmed", "CS-22-506")}
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 text-[10px] transition-colors"
              >
                Bilal (CS-506)
              </button>
              <button
                onClick={() => handleSimulateScan("Ayesha Khan", "CS-22-509")}
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 text-[10px] transition-colors"
              >
                Ayesha (CS-509)
              </button>
            </div>
          </div>

          {/* Attendee logs */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h5 className="font-semibold text-xs text-gray-800 mb-3 flex items-center justify-between">
              <span>Scanned Gate Logs</span>
              <button
                onClick={() => {
                  setAttendanceLogs([]);
                  setCheckinCounts({ "1": 0 });
                }}
                className="text-[9px] text-red-500 font-medium flex items-center gap-0.5"
              >
                <RefreshCw size={8} /> Reset logs
              </button>
            </h5>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {attendanceLogs.map((log, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{log.name}</p>
                    <p className="text-[9px] text-gray-400">{log.roll}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full font-bold">{log.status}</span>
                    <p className="text-[8px] text-gray-300 mt-0.5">{log.time}</p>
                  </div>
                </div>
              ))}
              {attendanceLogs.length === 0 && (
                <p className="text-center text-xs text-gray-400 py-3">No scans verified yet</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* My Registered Events */}
          <div className="px-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-800">My Registered Tickets</p>
              <button className="text-xs text-[#FF6B2B] flex items-center gap-0.5">See all <ChevronRight size={12} /></button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {events.filter(e => registeredIds.includes(e.id)).map(e => (
                <div key={e.id} className="flex-shrink-0 w-48 bg-white rounded-2xl overflow-hidden shadow-sm">
                  <ImageWithFallback src={e.image} alt={e.title} className="w-full h-24 object-cover" />
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-800 leading-tight truncate">{e.title}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-gray-400 text-[10px]">
                      <Calendar size={10} />
                      <span className="truncate">{e.date} • {e.time}</span>
                    </div>
                    <button
                      onClick={() => setActiveTicket(e)}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 border border-gray-200 hover:border-[#FF6B2B] hover:text-[#FF6B2B] rounded-lg py-1.5 text-[10px] text-gray-600 font-medium transition-colors"
                    >
                      <QrCode size={11} />
                      View QR Ticket
                    </button>
                  </div>
                </div>
              ))}
              {events.filter(e => registeredIds.includes(e.id)).length === 0 && (
                <div className="flex-shrink-0 w-full bg-white rounded-2xl p-6 text-center border border-dashed border-gray-200">
                  <p className="text-gray-400 text-xs">No registered events yet. Register below!</p>
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
                      <span className="absolute top-2 left-1 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">Online</span>
                    )}
                  </div>
                  <div className="flex-1 p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-800 leading-tight">{event.title}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{event.org}</p>
                      </div>
                      <span className="text-[9px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-1 font-semibold">{event.category}</span>
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
                      className={`mt-2.5 w-full py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                        registeredIds.includes(event.id)
                          ? "bg-gray-100 text-gray-500 font-semibold"
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
        </>
      )}

      {/* QR Ticket Tear-stub Modal */}
      {activeTicket && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xs shadow-2xl overflow-hidden flex flex-col relative">
            {/* Top Info Banner */}
            <div className="bg-[#FF6B2B] text-white text-center p-4">
              <h4 className="font-bold text-sm tracking-wide uppercase">Official Entry Stub</h4>
              <p className="text-[10px] opacity-90 mt-0.5">SZABIST Student Gatepass</p>
            </div>

            <div className="p-5 flex flex-col items-center">
              {/* Event title */}
              <h3 className="font-bold text-gray-900 text-center text-base leading-tight mt-1">{activeTicket.title}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">{activeTicket.org}</p>

              {/* Styled Vector QR Code */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 my-4 shadow-inner flex items-center justify-center w-36 h-36">
                <svg width="110" height="110" viewBox="0 0 29 29" shapeRendering="crispEdges">
                  <path d="M0 0h7v7H0zm22 0h7v7h-7zM0 22h7v7H0z" fill="#1A1A1A" />
                  <path d="M1 1h5v5H1zm22 0h5v5h-5zM1 23h5v5H1z" fill="#FFFFFF" />
                  <path d="M2 2h3v3H2zm22 0h3v3h-3zM2 24h3v3H2z" fill="#1A1A1A" />
                  <path d="M9 1h2v3H9zm4 0h1v1h-1zm2 0h3v2h-3zm6 0h1v1h-1zM9 5h1v3H9zm3 0h4v1h-4zm5 0h1v2h-1zm1 1h2v1h-2zm-9 3h2v2H9zm3 1h1v1h-1zm2-1h3v2h-3zm5 0h2v1h-2zm-7 3h1v1h-1zm2 1h1v2h-1zm3-1h2v1h-2zm4 0h1v3h-1zM8 17h3v1H8zm4 0h2v2h-2zm5-1h1v3h-1zm2 1h2v1h-2z" fill="#1A1A1A" />
                </svg>
              </div>

              {/* Tear-off Ticket perforation */}
              <div className="w-full flex items-center gap-1 mb-4">
                <div className="w-3 h-6 bg-[#000000]/60 rounded-r-full -ml-8 flex-shrink-0" />
                <div className="flex-1 border-t border-dashed border-gray-300" />
                <div className="w-3 h-6 bg-[#000000]/60 rounded-l-full -mr-8 flex-shrink-0" />
              </div>

              {/* Student Details Section */}
              <div className="w-full text-left bg-gray-50/80 rounded-xl p-3 text-xs border border-gray-100 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Student:</span>
                  <span className="font-semibold text-gray-800">{user?.name || "Tayyab Rasheed"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Roll No:</span>
                  <span className="font-mono text-gray-700">{user?.batch === "2022" ? "CS-22-124" : "CS-22-506"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Venue:</span>
                  <span className="font-semibold text-gray-800 text-right truncate max-w-[120px]">{activeTicket.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Timing:</span>
                  <span className="font-semibold text-gray-800">{activeTicket.date} • {activeTicket.time}</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setActiveTicket(null)}
              className="bg-gray-900 hover:bg-black text-white text-xs py-3.5 text-center font-medium transition-colors border-t border-gray-100"
            >
              Close Ticket Stub
            </button>
          </div>
        </div>
      )}

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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B] bg-white"
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
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B] bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Start Time</label>
                  <input
                    type="time"
                    value={createForm.time}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, time: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B] bg-white"
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B] bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Event Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="What is your event about?"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B] resize-none bg-white"
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
                className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-medium"
              >
                Post Event
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes sweep {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes slideUp {
          0% { transform: translateY(120px); opacity: 0; }
          15% { transform: translateY(0); opacity: 1; }
          85% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-10px); opacity: 0; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
