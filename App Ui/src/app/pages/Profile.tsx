import { useState } from "react";
import { Edit3, Settings, QrCode, ChevronRight, ShieldCheck, Bell, HelpCircle, LogOut, BookOpen, Calendar, Users, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const stats = [
  { label: "Events", value: "12", icon: Calendar, color: "#FF6B2B" },
  { label: "Resources", value: "48", icon: BookOpen, color: "#3B82F6" },
  { label: "Connections", value: "95", icon: Users, color: "#8B5CF6" },
  { label: "Reviews", value: "4.8", icon: Star, color: "#F59E0B" },
];

const menuItems = [
  { icon: Bell, label: "Notifications", subtitle: "Manage alerts", color: "#FF6B2B" },
  { icon: ShieldCheck, label: "Privacy & Safety", subtitle: "Control your data", color: "#10B981" },
  { icon: QrCode, label: "My QR Code", subtitle: "Event check-in code", color: "#8B5CF6" },
  { icon: HelpCircle, label: "Help & Support", subtitle: "FAQs and contact", color: "#3B82F6" },
  { icon: Settings, label: "Settings", subtitle: "App preferences", color: "#6B7280" },
];

const badges = [
  { name: "Early Adopter", color: "#FF6B2B" },
  { name: "Event Creator", color: "#8B5CF6" },
  { name: "Verified Student", color: "#10B981" },
  { name: "Top Contributor", color: "#F59E0B" },
];

export function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("About");

  const displayName = user ? `${user.firstName} ${user.lastName}` : "Campus User";
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "CU";
  const email = user?.email ?? "";
  const role = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Student";

  const handleSignOut = () => {
    logout();
    navigate("/");
};

  return (
    <div className="bg-[#F7F7F9] min-h-full pb-6">
      {/* Header */}
      <div className="bg-white pb-5 px-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-800 font-semibold">My Profile</p>
          <button className="text-gray-500">
            <Edit3 size={18} />
          </button>
        </div>

        {/* Avatar & Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B2B] to-orange-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{initials}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10B981] rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900">{displayName}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{role}</p>
            <p className="text-gray-400 text-xs mt-0.5">{email}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <ShieldCheck size={12} className="text-[#10B981]" />
              <span className="text-[10px] text-[#10B981] font-medium">Verified Student</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-gray-50 rounded-2xl p-2.5 flex flex-col items-center gap-1">
                <Icon size={16} style={{ color: stat.color }} />
                <span className="text-sm font-bold text-gray-800">{stat.value}</span>
                <span className="text-[10px] text-gray-400">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white mt-2 flex border-b border-gray-100 px-4">
        {["About", "Events", "Marketplace", "Reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-medium transition-colors ${
              activeTab === tab
                ? "text-[#FF6B2B] border-b-2 border-[#FF6B2B]"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "About" && (
        <div className="px-4 mt-4 space-y-3">
          {/* Badges */}
          <div className="bg-white rounded-2xl p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Achievements</p>
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b.name}
                  className="text-xs px-3 py-1.5 rounded-full text-white font-medium"
                  style={{ backgroundColor: b.color }}
                >
                  {b.name}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-2xl p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">About Me</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Final year CS student at SZABIST Islamabad. Passionate about mobile development,
              AI systems, and building products that matter. Working on Campus Connect as my FYP.
            </p>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-2xl overflow-hidden">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                    i !== menuItems.length - 1 ? "border-b border-gray-50" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.color + "18" }}>
                    <Icon size={17} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-gray-800">{item.label}</p>
                    <p className="text-[10px] text-gray-400">{item.subtitle}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              );
            })}
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50"
          >
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
              <LogOut size={17} className="text-red-500" />
            </div>
            <span className="text-sm text-red-500">Sign Out</span>
          </button>
        </div>
      )}

      {activeTab !== "About" && (
        <div className="px-4 mt-6 flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-gray-400 text-sm">No {activeTab.toLowerCase()} yet</p>
          <p className="text-gray-300 text-xs mt-1">Your activity will appear here</p>
        </div>
      )}
    </div>
  );
}
