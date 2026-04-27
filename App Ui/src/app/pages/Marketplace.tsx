import { useState } from "react";
import { Search, SlidersHorizontal, Heart, MapPin, Plus, Tag, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const categories = ["All", "Books", "Electronics", "Stationery", "Clothing", "Other"];

const listings = [
  {
    id: 1,
    title: "Data Structures & Algorithms (3rd Ed.)",
    price: 800,
    condition: "Good",
    seller: "Ahmed K.",
    dept: "CS 2021",
    location: "SZABIST Campus",
    image: "https://images.unsplash.com/photo-1748807269720-f4477356f85d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "Books",
    saved: false,
    verified: true,
  },
  {
    id: 2,
    title: "Logitech MX Keys Keyboard",
    price: 7500,
    condition: "Like New",
    seller: "Sara M.",
    dept: "SE 2022",
    location: "F-10, Islamabad",
    image: "https://images.unsplash.com/photo-1701576766277-c6160505581d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "Electronics",
    saved: true,
    verified: true,
  },
  {
    id: 3,
    title: "Calculus Early Transcendentals",
    price: 650,
    condition: "Fair",
    seller: "Omar T.",
    dept: "EE 2020",
    location: "SZABIST Campus",
    image: "https://images.unsplash.com/photo-1701709304274-bd9e5402d979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "Books",
    saved: false,
    verified: true,
  },
  {
    id: 4,
    title: "HP Laptop Stand + Mouse Combo",
    price: 2200,
    condition: "Good",
    seller: "Fatima Z.",
    dept: "BA 2022",
    location: "G-13, Islamabad",
    image: "https://images.unsplash.com/photo-1763890763377-abd05301034d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "Electronics",
    saved: false,
    verified: false,
  },
];

const conditionColors: Record<string, string> = {
  "Like New": "#10B981",
  "Good": "#3B82F6",
  "Fair": "#F59E0B",
};

export function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [savedIds, setSavedIds] = useState<number[]>([2]);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const toggleSave = (id: number) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filtered = listings.filter(l =>
    (activeCategory === "All" || l.category === activeCategory) &&
    l.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#F7F7F9] min-h-full pb-6">
      {/* Header */}
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 font-semibold">Student Marketplace</h3>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-[#FF6B2B] text-white text-xs px-3 py-2 rounded-xl"
          >
            <Plus size={13} />
            Sell Item
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-3 py-2.5 gap-2">
            <Search size={15} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books, electronics..."
              className="flex-1 outline-none text-sm text-gray-600 placeholder-gray-300 bg-transparent"
            />
          </div>
          <button className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">
            <SlidersHorizontal size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Categories */}
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

      {/* Trust badge */}
      <div className="mx-4 mt-4 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
        <span className="text-lg">🛡️</span>
        <p className="text-xs text-orange-700">
          <strong>Domain-secured marketplace</strong> — only verified SZABIST students can buy & sell
        </p>
      </div>

      {/* Grid of listings */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="relative">
              <ImageWithFallback
                src={item.image}
                alt={item.title}
                className="w-full h-32 object-cover"
              />
              <button
                onClick={() => toggleSave(item.id)}
                className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center"
              >
                <Heart
                  size={13}
                  className={savedIds.includes(item.id) ? "fill-[#FF6B2B] text-[#FF6B2B]" : "text-gray-400"}
                />
              </button>
              <span
                className="absolute top-2 left-2 text-white text-[9px] px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: conditionColors[item.condition] || "#6B7280" }}
              >
                {item.condition}
              </span>
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">{item.title}</p>
              <div className="flex items-center gap-1 mt-1">
                <Tag size={10} className="text-[#FF6B2B]" />
                <span className="text-sm font-bold text-[#FF6B2B]">Rs. {item.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-gray-400 text-[10px]">
                <MapPin size={9} />
                <span className="truncate">{item.location}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-gray-400 text-[10px]">
                <span>{item.seller}</span>
                {item.verified && <span className="text-[#10B981]">✓</span>}
                <span className="text-gray-300">•</span>
                <span>{item.dept}</span>
              </div>
              <button className="mt-2 w-full flex items-center justify-center gap-1.5 bg-[#1A1A1A] text-white text-[10px] py-2 rounded-xl">
                <MessageCircle size={11} />
                Chat with Seller
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Listing Modal */}
      {showCreate && (
        <div className="absolute inset-0 bg-black/50 z-40 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">List an Item</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 text-sm">Cancel</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Item Title</label>
                <input placeholder="e.g., Introduction to Computing (2nd Ed.)" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6B2B]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Category</label>
                  <select className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#FF6B2B]">
                    {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Condition</label>
                  <select className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#FF6B2B]">
                    <option>Like New</option>
                    <option>Good</option>
                    <option>Fair</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Price (Rs.)</label>
                <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6B2B]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Description</label>
                <textarea rows={3} placeholder="Describe your item..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6B2B] resize-none" />
              </div>
              <button onClick={() => setShowCreate(false)} className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-medium">
                Post Listing
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
