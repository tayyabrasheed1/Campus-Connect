import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Navigation,
  ChevronRight,
  Building,
  Coffee,
  BookOpen,
  Dumbbell,
  FlaskConical,
  Monitor,
  Route,
  Compass,
  Users,
} from "lucide-react";
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { eventApi } from "../../services/api";

type LocationKind = "office" | "classroom" | "facility" | "poi";

type CampusLocation = {
  id: number;
  name: string;
  shortName: string;
  category: "Academic" | "Facilities" | "Library" | "Sports" | "Labs" | "IT";
  kind: LocationKind;
  floor: string;
  description: string;
  department?: string;
  roomCode?: string;
  x: number;
  y: number;
  color: string;
};

type RoutePlan = {
  eta: string;
  distance: string;
  steps: string[];
};

type MapPoint = {
  lat: number;
  lng: number;
};

type RouteMeta = {
  distance: string;
  duration: string;
};

type PlannedEvent = {
  id: string;
  title: string;
  location: string;
  category: string;
  attendees: number;
  maxParticipants: number;
  status: "registered" | "open";
  point: MapPoint;
};

const categoryOptions = [
  { label: "All", icon: MapPin },
  { label: "Academic", icon: Building },
  { label: "Facilities", icon: Coffee },
  { label: "Library", icon: BookOpen },
  { label: "Sports", icon: Dumbbell },
  { label: "Labs", icon: FlaskConical },
  { label: "IT", icon: Monitor },
];

const kindFilters: Array<{ key: "all" | LocationKind; label: string }> = [
  { key: "all", label: "All Directory" },
  { key: "office", label: "Department Offices" },
  { key: "classroom", label: "Classrooms" },
  { key: "facility", label: "Facilities" },
  { key: "poi", label: "Points of Interest" },
];

const locations: CampusLocation[] = [
  {
    id: 1,
    name: "Main Entrance Gate",
    shortName: "GATE",
    category: "Facilities",
    kind: "poi",
    floor: "Ground",
    description: "Primary entry gate with student access check and security desk.",
    x: 10,
    y: 85,
    color: "#6B7280",
  },
  {
    id: 2,
    name: "Computer Science Department Office",
    shortName: "CS",
    category: "Academic",
    kind: "office",
    floor: "3rd Floor, MAB",
    description: "Department administration office for CS advising and notices.",
    department: "Computer Science",
    roomCode: "MAB-301",
    x: 60,
    y: 24,
    color: "#3B82F6",
  },
  {
    id: 3,
    name: "Registrar Office",
    shortName: "REG",
    category: "Academic",
    kind: "office",
    floor: "2nd Floor, MAB",
    description: "Transcripts, enrollment records, and official student documents.",
    department: "Administration",
    roomCode: "MAB-205",
    x: 54,
    y: 40,
    color: "#EC4899",
  },
  {
    id: 4,
    name: "SZABIST Islamabad Main Auditorium",
    shortName: "AUD",
    category: "Academic",
    kind: "facility",
    floor: "Ground Floor, Main Block",
    description: "Main auditorium for seminars, convocations, and flagship campus events.",
    department: "Events & Student Affairs",
    roomCode: "AUD-01",
    x: 39,
    y: 28,
    color: "#FF6B2B",
  },
  {
    id: 5,
    name: "Student Affairs Office",
    shortName: "SAO",
    category: "Academic",
    kind: "office",
    floor: "1st Floor, Main Block",
    description: "Support desk for student societies, activities, and event permissions.",
    department: "Student Affairs",
    roomCode: "SAO-105",
    x: 47,
    y: 22,
    color: "#F97316",
  },
  {
    id: 6,
    name: "SZABIST Library",
    shortName: "LIB",
    category: "Library",
    kind: "facility",
    floor: "Ground Floor",
    description: "Digital and physical resource center with reading zones.",
    x: 20,
    y: 56,
    color: "#8B5CF6",
  },
  {
    id: 7,
    name: "Computer Lab A",
    shortName: "LAB",
    category: "Labs",
    kind: "facility",
    floor: "2nd Floor",
    description: "40-seat workstation lab for programming and software courses.",
    roomCode: "LAB-A",
    x: 66,
    y: 56,
    color: "#10B981",
  },
  {
    id: 8,
    name: "IT Helpdesk",
    shortName: "IT",
    category: "IT",
    kind: "office",
    floor: "1st Floor",
    description: "Support for WiFi, LMS issues, and account recovery.",
    department: "IT Services",
    roomCode: "IT-101",
    x: 33,
    y: 42,
    color: "#6B7280",
  },
  {
    id: 9,
    name: "Student Cafeteria",
    shortName: "CAFE",
    category: "Facilities",
    kind: "poi",
    floor: "Ground Floor",
    description: "Food court with indoor seating and student hangout area.",
    x: 45,
    y: 75,
    color: "#F59E0B",
  },
  {
    id: 10,
    name: "Sports Complex",
    shortName: "GYM",
    category: "Sports",
    kind: "facility",
    floor: "Basement",
    description: "Gym and indoor sports courts for student activities.",
    x: 76,
    y: 75,
    color: "#EF4444",
  },
  {
    id: 11,
    name: "Prayer Area",
    shortName: "MSD",
    category: "Facilities",
    kind: "poi",
    floor: "Ground Floor",
    description: "Quiet prayer space for students and staff.",
    x: 28,
    y: 70,
    color: "#0EA5E9",
  },
  {
    id: 12,
    name: "Admissions Office",
    shortName: "ADM",
    category: "Academic",
    kind: "office",
    floor: "Ground Floor",
    description: "Information desk for admissions, scholarships, and prospectus.",
    department: "Admissions",
    roomCode: "ADM-02",
    x: 43,
    y: 50,
    color: "#14B8A6",
  },
];

const staticRoutes: Record<string, RoutePlan> = {
  "1-2": {
    eta: "6 min",
    distance: "420 m",
    steps: [
      "Enter through the Main Entrance Gate and proceed straight on the central pathway.",
      "Take the stairs/elevator in MAB to the 3rd floor.",
      "Turn right at the faculty corridor to reach the CS Department Office (MAB-301).",
    ],
  },
  "1-6": {
    eta: "4 min",
    distance: "280 m",
    steps: [
      "Walk left from the Main Entrance toward the library wing.",
      "Use the ground-floor corridor beside the information desk.",
      "The SZABIST Library is on your right.",
    ],
  },
  "2-7": {
    eta: "3 min",
    distance: "180 m",
    steps: [
      "Exit CS Department Office and continue along the main academic corridor.",
      "Take the stairs down to the 2nd floor lab section.",
      "Computer Lab A is at the far end of the corridor.",
    ],
  },
  "6-9": {
    eta: "5 min",
    distance: "320 m",
    steps: [
      "Leave the Library and follow signs to Student Services.",
      "Cross the central courtyard pathway.",
      "Student Cafeteria is beside the seating deck.",
    ],
  },
};

const CAMPUS_ADDRESS = "Street # 09, Plot # 67, Sector H-8/4, Islamabad, Pakistan";

const CAMPUS_CENTER: MapPoint = {
  // Aligned to the public SZABIST Islamabad map position.
  lat: 33.677265,
  lng: 73.068057,
};

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function resolveEventPoint(locationLabel: string): MapPoint {
  const normalized = normalizeText(locationLabel);
  const candidate = locations.find((loc) => {
    const fields = [loc.name, loc.shortName, loc.department ?? "", loc.roomCode ?? ""];
    return fields.some((item) => normalizeText(item).includes(normalized) || normalized.includes(normalizeText(item)));
  });

  if (candidate) {
    return locationToLatLng(candidate);
  }

  // Fallback: keep event visible near campus center if custom location does not match directory labels.
  return {
    lat: CAMPUS_CENTER.lat + 0.00015,
    lng: CAMPUS_CENTER.lng + 0.00015,
  };
}

function locationToLatLng(location: CampusLocation): MapPoint {
  return {
    lat: CAMPUS_CENTER.lat + (50 - location.y) * 0.000035,
    lng: CAMPUS_CENTER.lng + (location.x - 50) * 0.00005,
  };
}

function getRoutePlan(fromId: number, toId: number): RoutePlan {
  const direct = staticRoutes[`${fromId}-${toId}`];
  if (direct) return direct;

  const reverse = staticRoutes[`${toId}-${fromId}`];
  if (reverse) {
    return {
      eta: reverse.eta,
      distance: reverse.distance,
      steps: [...reverse.steps].reverse(),
    };
  }

  return {
    eta: "5-8 min",
    distance: "~350 m",
    steps: [
      "Follow the central corridor signs toward your destination block.",
      "Use the nearest staircase/elevator for the required floor.",
      "Check room labels and digital boards near corridor intersections.",
    ],
  };
}

function kindLabel(kind: LocationKind): string {
  if (kind === "office") return "Office";
  if (kind === "classroom") return "Classroom";
  if (kind === "facility") return "Facility";
  return "POI";
}

export function Mapper() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeKind, setActiveKind] = useState<"all" | LocationKind>("all");
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [routeFrom, setRouteFrom] = useState(1);
  const [routeTo, setRouteTo] = useState(2);
  const [routePath, setRoutePath] = useState<Array<[number, number]>>([]);
  const [routeMeta, setRouteMeta] = useState<RouteMeta | null>(null);
  const [plannedEvents, setPlannedEvents] = useState<PlannedEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const startNavigation = (location: CampusLocation) => {
    const from = locationToLatLng(locations[0]);
    const to = locationToLatLng(location);
    const route = `${from.lat},${from.lng};${to.lat},${to.lng}`;
    window.open(
      `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${encodeURIComponent(route)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return locations.filter((loc) => {
      const categoryMatch = activeCategory === "All" || loc.category === activeCategory;
      const kindMatch = activeKind === "all" || loc.kind === activeKind;
      const searchMatch =
        !query ||
        loc.name.toLowerCase().includes(query) ||
        (loc.department || "").toLowerCase().includes(query) ||
        (loc.roomCode || "").toLowerCase().includes(query) ||
        loc.shortName.toLowerCase().includes(query);

      return categoryMatch && kindMatch && searchMatch;
    });
  }, [activeCategory, activeKind, search]);

  const selected = locations.find((loc) => loc.id === selectedLocation);
  const routeSource = locations.find((loc) => loc.id === routeFrom);
  const routeDestination = locations.find((loc) => loc.id === routeTo);
  const routePlan = getRoutePlan(routeFrom, routeTo);

  const poiLocations = useMemo(() => locations.filter((loc) => loc.kind === "poi"), []);
  const selectedEvent = plannedEvents.find((event) => event.id === selectedEventId) ?? null;

  useEffect(() => {
    const loadPlannedEvents = async () => {
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

        const normalized = source
          .filter((item) => !String(item.location ?? "").toLowerCase().includes("zoom"))
          .map((item) => {
            const location = String(item.location ?? "Campus Area");
            return {
              id: String(item.id ?? item._id ?? Math.random()),
              title: String(item.title ?? "Campus Event"),
              location,
              category: String(item.tag ?? item.category ?? "Events"),
              attendees: Number(item.attendees ?? 0),
              maxParticipants: Number(item.maxParticipants ?? 0),
              status: String(item.status ?? "open") === "registered" ? "registered" : "open",
              point: resolveEventPoint(location),
            } satisfies PlannedEvent;
          });

        setPlannedEvents(normalized);
      } catch {
        setPlannedEvents([]);
      }
    };

    loadPlannedEvents();
  }, []);

  useEffect(() => {
    if (routeFrom === routeTo || !routeSource || !routeDestination) {
      setRoutePath([]);
      setRouteMeta(null);
      return;
    }

    const controller = new AbortController();
    const origin = locationToLatLng(routeSource);
    const destination = locationToLatLng(routeDestination);

    const loadRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/foot/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`,
          { signal: controller.signal }
        );
        const payload = await response.json();
        const route = payload?.routes?.[0];

        if (!route) {
          setRoutePath([]);
          setRouteMeta(null);
          return;
        }

        const coordinates = Array.isArray(route.geometry?.coordinates)
          ? route.geometry.coordinates.map((coordinate: [number, number]) => [coordinate[1], coordinate[0]] as [number, number])
          : [];

        setRoutePath(coordinates);
        setRouteMeta({
          distance: `${Math.round((route.distance || 0) / 10) / 100} km`,
          duration: `${Math.max(1, Math.round((route.duration || 0) / 60))} min`,
        });
      } catch {
        setRoutePath([]);
        setRouteMeta(null);
      }
    };

    loadRoute();
    return () => controller.abort();
  }, [routeFrom, routeTo, routeSource, routeDestination]);

  return (
    <div className="bg-[#F7F7F9] min-h-full pb-6">
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 font-semibold">Campus Mapper</h3>
          <div className="w-9 h-9 bg-[#FF6B2B]/10 rounded-xl flex items-center justify-center">
            <MapPin size={18} className="text-[#FF6B2B]" />
          </div>
        </div>
        <div className="mb-4 rounded-xl bg-orange-50 border border-orange-100 px-3 py-2.5">
          <p className="text-[11px] font-semibold text-[#FF6B2B]">SZABIST Islamabad</p>
          <p className="text-[11px] text-gray-500 mt-0.5">{CAMPUS_ADDRESS}</p>
        </div>
        <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2.5 gap-2">
          <Search size={15} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search offices, classrooms, facilities, room codes..."
            className="flex-1 outline-none text-sm text-gray-600 placeholder-gray-300 bg-transparent"
          />
        </div>
      </div>

      <div className="px-4 mt-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">Digital Directory Filters</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {kindFilters.map((filter) => (
            <button
              type="button"
              key={filter.key}
              onClick={() => setActiveKind(filter.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border ${
                activeKind === filter.key
                  ? "bg-[#FF6B2B] text-white border-[#FF6B2B]"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-4 mt-3 overflow-x-auto no-scrollbar">
        {categoryOptions.map((category) => {
          const Icon = category.icon;
          return (
            <button
              type="button"
              key={category.label}
              onClick={() => setActiveCategory(category.label)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === category.label
                  ? "bg-[#1A1A1A] text-white"
                  : "bg-white text-gray-500 border border-gray-200"
              }`}
            >
              <Icon size={11} />
              {category.label}
            </button>
          );
        })}
      </div>

      <div className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden shadow-sm" style={{ height: 300 }}>
        <MapContainer center={[CAMPUS_CENTER.lat, CAMPUS_CENTER.lng]} zoom={17} style={{ width: "100%", height: "100%" }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((loc) => {
            const point = locationToLatLng(loc);
            return (
              <CircleMarker
                key={`osm-${loc.id}`}
                center={[point.lat, point.lng]}
                radius={selectedLocation === loc.id ? 10 : 8}
                pathOptions={{ color: loc.color, fillColor: loc.color, fillOpacity: 0.85 }}
                eventHandlers={{ click: () => setSelectedLocation(loc.id) }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                  <span>{loc.name}</span>
                </Tooltip>
              </CircleMarker>
            );
          })}
          {plannedEvents.map((event) => (
            <CircleMarker
              key={`evt-${event.id}`}
              center={[event.point.lat, event.point.lng]}
              radius={selectedEventId === event.id ? 8 : 6}
              pathOptions={{ color: "#111827", fillColor: "#111827", fillOpacity: 0.9 }}
              eventHandlers={{ click: () => setSelectedEventId(event.id) }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <span>{event.title}</span>
              </Tooltip>
            </CircleMarker>
          ))}
          {routePath.length > 0 && <Polyline positions={routePath} pathOptions={{ color: "#FF6B2B", weight: 4 }} />}
        </MapContainer>
      </div>

      {selectedEvent && (
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm border-l-4 border-l-[#111827]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">{selectedEvent.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{selectedEvent.category} • {selectedEvent.location}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1">
                <Users size={11} className="text-gray-500" />
                <span className="text-[11px] text-gray-600">
                  {selectedEvent.attendees}
                  {selectedEvent.maxParticipants > 0 ? ` / ${selectedEvent.maxParticipants}` : ""} joined
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await eventApi.register(selectedEvent.id);
                  setPlannedEvents((prev) =>
                    prev.map((event) =>
                      event.id === selectedEvent.id
                        ? { ...event, attendees: event.attendees + 1, status: "registered" }
                        : event
                    )
                  );
                } catch {
                  // Keep map UI responsive even when register call fails.
                }
              }}
              disabled={selectedEvent.status === "registered"}
              className={`text-xs px-3 py-2 rounded-xl text-white ${
                selectedEvent.status === "registered" ? "bg-gray-400" : "bg-[#FF6B2B]"
              }`}
            >
              {selectedEvent.status === "registered" ? "Available ✓" : "I Am Available"}
            </button>
          </div>
        </div>
      )}

      {selected && (
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm border-l-4" style={{ borderLeftColor: selected.color }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">{selected.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{kindLabel(selected.kind)} • {selected.floor}</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{selected.description}</p>
              {(selected.department || selected.roomCode) && (
                <p className="text-[11px] text-gray-500 mt-2">
                  {[selected.department, selected.roomCode].filter(Boolean).join(" • ")}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => startNavigation(selected)}
              className="flex items-center gap-1 text-xs text-white px-3 py-2 rounded-xl flex-shrink-0"
              style={{ backgroundColor: selected.color }}
            >
              <Navigation size={11} />
              Navigate
            </button>
          </div>
        </div>
      )}

      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Route size={15} className="text-[#FF6B2B]" />
          <p className="text-sm font-semibold text-gray-800">Static Route Guidance</p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <select
            value={routeFrom}
            onChange={(e) => setRouteFrom(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white outline-none"
          >
            {locations.map((loc) => (
              <option key={`from-${loc.id}`} value={loc.id}>{`From: ${loc.name}`}</option>
            ))}
          </select>

          <select
            value={routeTo}
            onChange={(e) => setRouteTo(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white outline-none"
          >
            {locations.map((loc) => (
              <option key={`to-${loc.id}`} value={loc.id}>{`To: ${loc.name}`}</option>
            ))}
          </select>
        </div>

        <div className="mt-3 bg-gray-50 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-700">
              {routeSource?.shortName} to {routeDestination?.shortName}
            </p>
            <p className="text-[11px] text-gray-500">
              {routeMeta?.distance || routePlan.distance} • {routeMeta?.duration || routePlan.eta}
            </p>
          </div>
          {routeMeta && (
            <p className="text-[11px] text-[#FF6B2B] mt-1">Live OpenStreetMap walking route</p>
          )}
          <ul className="mt-2 space-y-1.5">
            {routePlan.steps.map((step) => (
              <li key={step} className="text-xs text-gray-500 flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FF6B2B] flex-shrink-0" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-800">Point of Interest Discovery</p>
          <span className="text-xs text-gray-400">{poiLocations.length} hotspots</span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {poiLocations.map((loc) => (
            <button
              type="button"
              key={`poi-${loc.id}`}
              onClick={() => setSelectedLocation(loc.id)}
              className="flex-shrink-0 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100 text-left min-w-[190px]"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${loc.color}20` }}>
                  <Compass size={13} style={{ color: loc.color }} />
                </div>
                <p className="text-xs font-semibold text-gray-700 truncate">{loc.name}</p>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{loc.floor}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-800">Campus Digital Directory</p>
          <span className="text-xs text-gray-400">{filtered.length} results</span>
        </div>
        <div className="space-y-2">
          {filtered.map((loc) => {
            const Icon = categoryOptions.find((category) => category.label === loc.category)?.icon || MapPin;
            return (
              <button
                type="button"
                key={loc.id}
                onClick={() => setSelectedLocation(loc.id === selectedLocation ? null : loc.id)}
                className={`w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm border transition-all ${
                  selectedLocation === loc.id ? "border-[#FF6B2B]" : "border-transparent"
                }`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${loc.color}20` }}>
                  <Icon size={17} style={{ color: loc.color }} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">{loc.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 flex-shrink-0">
                      {kindLabel(loc.kind)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {[loc.category, loc.floor, loc.roomCode].filter(Boolean).join(" • ")}
                  </p>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl px-4 py-8 text-center text-sm text-gray-400 shadow-sm">
              No matching location found. Try searching by department name or room code.
            </div>
          )}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
