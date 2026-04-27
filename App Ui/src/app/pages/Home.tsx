import { useState } from "react";
import { Search, SlidersHorizontal, MapPin, Clock, Users, Bookmark } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useNavigate } from "react-router";

const categories = ["All", "Events", "Workshops", "Sports", "Tech", "Arts"];

const posts = [
  {
    id: 1,
    type: "event",
    title: "AI & Machine Learning Summit",
    description: "Explore the latest in AI research and applications with industry experts.",
    date: "Mar 22, 2026",
    time: "10:00 AM",
    location: "CS Block, SZABIST",
    organizer: "CS Department",
    attendees: 145,
    category: "Tech",
    image: "https://images.unsplash.com/photo-1646579886135-068c73800308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    badge: "Featured",
    badgeColor: "#FF6B2B",
    online: false,
  },
  {
    id: 2,
    type: "event",
    title: "Homemade Cocktails Workshop",
    description: "Learn mixology and cooking with fellow food enthusiasts on campus.",
    date: "Mar 24, 2026",
    time: "06:00 PM",
    location: "Student Center",
    organizer: "SZABIST Social Club",
    attendees: 32,
    category: "Arts",
    image: "https://images.unsplash.com/photo-1748807269720-f4477356f85d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    badge: null,
    online: false,
  },
  {
    id: 3,
    type: "event",
    title: "Basketball Tournament",
    description: "Inter-batch basketball tournament. Form your team and register now!",
    date: "Mar 26, 2026",
    time: "03:00 PM",
    location: "Sports Ground",
    organizer: "Sports Society",
    attendees: 88,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1696861270495-7f35c35c3273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    badge: "Registering",
    badgeColor: "#10B981",
    online: false,
  },
  {
    id: 4,
    type: "feed",
    title: "Final Year Project Showcase",
    description: "Students present their FYP prototypes. Come support and give feedback!",
    date: "Apr 01, 2026",
    time: "09:00 AM – 05:00 PM",
    location: "Main Auditorium",
    organizer: "Department of CS",
    attendees: 220,
    category: "Events",
    image: "https://images.unsplash.com/photo-1763890763377-abd05301034d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    badge: "Online",
    badgeColor: "#3B82F6",
    online: true,
  },
];

export function Home() {
  const [activeTab, setActiveTab] = useState("Explore");
  const [activeCategory, setActiveCategory] = useState("All");
  const [saved, setSaved] = useState<number[]>([]);
  const navigate = useNavigate();

  const filtered = posts.filter(p =>
    activeCategory === "All" || p.category === activeCategory
  );

  return (
    <div className="bg-[#F7F7F9] min-h-full pb-6">
      {/* Search bar */}
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-3 py-2.5 gap-2">
            <Search size={15} className="text-gray-400" />
            <input placeholder="Search events, people, resources..." className="flex-1 outline-none text-sm text-gray-600 placeholder-gray-300 bg-transparent" />
          </div>
          <button className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">
            <SlidersHorizontal size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {["Explore", "Feed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-2.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-[#FF6B2B] border-b-2 border-[#FF6B2B]"
                  : "text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Banner */}
      <div className="px-4 mt-4">
        <div className="relative rounded-2xl overflow-hidden h-44">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1701709304274-bd9e5402d979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
            alt="Campus Originals"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <span className="bg-[#FF6B2B] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">CAMPUS ORIGINALS</span>
            <p className="text-white mt-1.5 text-sm leading-tight">Apply for your membership & get free<br />access to all SZABIST events</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 px-4 mt-4 overflow-x-auto no-scrollbar">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === c
                ? "bg-[#1A1A1A] text-white"
                : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Event Cards */}
      <div className="px-4 mt-4 space-y-3">
        {filtered.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="relative">
              <ImageWithFallback
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover"
              />
              {post.badge && (
                <span
                  className="absolute top-3 left-3 text-white text-[10px] px-2.5 py-1 rounded-full font-medium"
                  style={{ backgroundColor: post.badgeColor }}
                >
                  {post.badge}
                </span>
              )}
              <button
                onClick={() => setSaved(saved.includes(post.id) ? saved.filter(s => s !== post.id) : [...saved, post.id])}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
              >
                <Bookmark
                  size={14}
                  className={saved.includes(post.id) ? "fill-[#FF6B2B] text-[#FF6B2B]" : "text-gray-500"}
                />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-900 font-semibold text-sm">{post.title}</p>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">{post.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock size={11} />
                  <span>{post.date} • {post.time}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <MapPin size={11} />
                  <span>{post.location}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Users size={11} />
                  <span>{post.attendees}</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/app/events")}
                className="mt-3 w-full py-2.5 bg-[#1A1A1A] text-white text-xs rounded-xl font-medium hover:bg-black transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
