import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Heart, MapPin, Plus, Tag, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

const categories = ["All", "Books", "Electronics", "Stationery", "Clothing", "Other"];

const initialListings = [
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
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load state from localStorage
  const [listings, setListings] = useState<any[]>(() => {
    const raw = localStorage.getItem("cc_marketplace_listings");
    return raw ? JSON.parse(raw) : initialListings;
  });

  const [savedIds, setSavedIds] = useState<number[]>(() => {
    const raw = localStorage.getItem("cc_saved_listings");
    return raw ? JSON.parse(raw) : [2];
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  // Sell item form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Books");
  const [newCondition, setNewCondition] = useState("Good");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const toggleSave = (id: number) => {
    const updated = savedIds.includes(id) ? savedIds.filter(i => i !== id) : [...savedIds, id];
    setSavedIds(updated);
    localStorage.setItem("cc_saved_listings", JSON.stringify(updated));
  };

  const filtered = listings.filter(l =>
    (activeCategory === "All" || l.category === activeCategory) &&
    (!showSavedOnly || savedIds.includes(l.id)) &&
    l.title.toLowerCase().includes(search.toLowerCase())
  );

  const handlePostListing = () => {
    if (!newTitle.trim() || !newPrice.trim()) {
      alert("Please enter a title and price!");
      return;
    }

    let categoryImage = "https://images.unsplash.com/photo-1701709304274-bd9e5402d979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
    if (newCategory === "Books") {
      categoryImage = "https://images.unsplash.com/photo-1748807269720-f4477356f85d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
    } else if (newCategory === "Electronics") {
      categoryImage = "https://images.unsplash.com/photo-1701576766277-c6160505581d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
    } else if (newCategory === "Stationery") {
      categoryImage = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80";
    } else if (newCategory === "Clothing") {
      categoryImage = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80";
    }

    const currentUserName = user ? `${user.firstName} ${user.lastName}` : "Demo Student";
    const currentUserDept = user?.batch || user?.dept || "CS 2022";
    const isVerified = user?.email ? user.email.endsWith("@szabist-isb.edu.pk") : true;

    const newItem = {
      id: Date.now(),
      title: newTitle.trim(),
      price: Number(newPrice) || 0,
      condition: newCondition,
      seller: currentUserName,
      dept: currentUserDept,
      location: "SZABIST Campus",
      image: categoryImage,
      category: newCategory,
      saved: false,
      verified: isVerified,
      description: newDescription.trim()
    };

    const updated = [newItem, ...listings];
    setListings(updated);
    localStorage.setItem("cc_marketplace_listings", JSON.stringify(updated));

    // Reset Form
    setNewTitle("");
    setNewPrice("");
    setNewDescription("");
    setNewCategory("Books");
    setNewCondition("Good");
    setShowCreate(false);
  };

  const handleChatWithSeller = (item: any) => {
    const currentUserName = user ? `${user.firstName} ${user.lastName}` : "Demo Student";
    if (item.seller === currentUserName) {
      alert("This is your listing item! You cannot chat with yourself.");
      return;
    }

    const roomId = `m-chat-${item.id}`;
    
    // Construct room payload
    const newRoom = {
      id: roomId,
      name: `Marketplace: ${item.title.substring(0, 18)}...`,
      dept: `Seller: ${item.seller} (${item.dept})`,
      batch: null,
      lastMsg: `Hi ${item.seller}, is this still available?`,
      time: "now",
      unread: 0,
      avatar: "MP",
      color: "#FF6B2B",
      isBroadcast: false,
      sellerName: item.seller,
      itemTitle: item.title,
      itemPrice: item.price
    };

    // Retrieve existing custom rooms
    const existingRaw = localStorage.getItem("cc_custom_chat_rooms");
    const existingRooms = existingRaw ? JSON.parse(existingRaw) : [];
    
    if (!existingRooms.some((r: any) => r.id === roomId)) {
      existingRooms.unshift(newRoom);
      localStorage.setItem("cc_custom_chat_rooms", JSON.stringify(existingRooms));

      // Seed initial welcoming message from System and Seller query
      const initialMsgs = [
        {
          id: `m-init-sys-${Date.now()}`,
          sender: "System",
          text: `🛡️ Security Notice: Coordinate safely inside the SZABIST community. Direct trade is at your own responsibility.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isMe: false
        },
        {
          id: `m-init-user-${Date.now()}`,
          sender: "Me",
          text: `Hi ${item.seller}, I am interested in purchasing your "${item.title}" for Rs. ${item.price.toLocaleString()}. Is it still available?`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isMe: true
        }
      ];
      localStorage.setItem(`cc_msgs_${roomId}`, JSON.stringify(initialMsgs));
    }

    // Set active chat and redirect
    localStorage.setItem("cc_active_chat_id", roomId);
    navigate("/app/chats");
  };

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

      {/* Categories & Saved Filter */}
      <div className="flex gap-2 px-4 mt-4 overflow-x-auto no-scrollbar items-center">
        <button
          onClick={() => setShowSavedOnly(prev => !prev)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
            showSavedOnly
              ? "bg-[#FF6B2B] text-white"
              : "bg-white text-gray-500 border border-gray-200"
          }`}
        >
          <Heart size={11} className={showSavedOnly ? "fill-white" : ""} />
          Saved Wishlist
        </button>
        
        <span className="text-gray-300">|</span>

        {categories.map((c) => (
          <button
            key={c}
            onClick={() => {
              setActiveCategory(c);
              setShowSavedOnly(false);
            }}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === c && !showSavedOnly
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
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
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
                  <span className="truncate font-medium">{item.seller}</span>
                  {item.verified && <span className="text-[#10B981] font-bold">✓</span>}
                  <span className="text-gray-300">•</span>
                  <span>{item.dept}</span>
                </div>
              </div>
            </div>
            <div className="px-3 pb-3">
              <button
                onClick={() => handleChatWithSeller(item)}
                className="w-full flex items-center justify-center gap-1.5 bg-[#1A1A1A] text-white text-[10px] py-2 rounded-xl hover:bg-black transition-colors"
              >
                <MessageCircle size={11} />
                Chat with Seller
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 bg-white rounded-2xl p-8 text-center text-gray-400 text-xs">
            No listing items found
          </div>
        )}
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
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Introduction to Computing (2nd Ed.)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6B2B] text-gray-700 bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#FF6B2B] text-gray-700 bg-white"
                  >
                    {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#FF6B2B] text-gray-700 bg-white"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Price (Rs.)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6B2B] text-gray-700 bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe your item's condition, meeting point, etc..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6B2B] resize-none text-gray-700 bg-white"
                />
              </div>
              <button
                onClick={handlePostListing}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-4 rounded-2xl font-medium transition-colors"
              >
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
