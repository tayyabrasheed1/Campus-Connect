import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  Home, Calendar, MessageSquare, User, Plus, ShoppingBag,
  BookOpen, Users, Bot, BarChart2, Map, ShieldAlert,
  LayoutDashboard, X, ChevronRight, Bell, LogOut
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { icon: Home, label: "Explore", path: "/app" },
  { icon: Calendar, label: "Events", path: "/app/events" },
  { icon: Plus, label: "", path: "/app/create", isCreate: true },
  { icon: MessageSquare, label: "Chats", path: "/app/chats" },
  { icon: User, label: "Profile", path: "/app/profile" },
];

const drawerItems = [
  { icon: ShoppingBag, label: "Marketplace", path: "/app/marketplace", color: "#FF6B2B" },
  { icon: BookOpen, label: "Study Resources", path: "/app/resources", color: "#3B82F6" },
  { icon: Users, label: "Alumni Portal", path: "/app/alumni", color: "#8B5CF6" },
  { icon: Bot, label: "Campus Assistant", path: "/app/assistant", color: "#10B981" },
  { icon: BarChart2, label: "Student Feedback", path: "/app/feedback", color: "#F59E0B" },
  { icon: Map, label: "Campus Mapper", path: "/app/mapper", color: "#EC4899" },
  { icon: ShieldAlert, label: "Safety Reporting", path: "/app/safety", color: "#EF4444" },
  { icon: LayoutDashboard, label: "Admin Dashboard", path: "/app/admin", color: "#6B7280" },
];

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const displayName = user ? `${user.firstName} ${user.lastName}` : "Campus User";
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "CU";
  const role = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Student";

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="relative w-full max-w-[430px] h-screen bg-white flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 pt-10 pb-3 flex items-center justify-between z-10">
          <button onClick={() => setDrawerOpen(true)} className="flex flex-col gap-1 p-1">
            <span className="block w-5 h-0.5 bg-gray-800" />
            <span className="block w-5 h-0.5 bg-gray-800" />
            <span className="block w-3 h-0.5 bg-gray-800" />
          </button>
          <span className="tracking-[0.2em] text-sm font-semibold text-gray-900">CAMPUS CONNECT</span>
          <button className="relative p-1">
            <Bell size={20} className="text-gray-800" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF6B2B] rounded-full" />
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-100 px-2 py-2 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.isCreate) {
              return (
                <button
                  key="create"
                  className="w-12 h-12 bg-[#FF6B2B] rounded-full flex items-center justify-center shadow-lg shadow-orange-200 -mt-5"
                >
                  <Plus size={22} className="text-white" />
                </button>
              );
            }
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                  isActive(item.path) ? "text-[#FF6B2B]" : "text-gray-400"
                }`}
              >
                <Icon size={22} />
                <span className="text-[10px]">{item.label}</span>
                {isActive(item.path) && (
                  <span className="w-1 h-1 bg-[#FF6B2B] rounded-full absolute -bottom-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Slide-out Drawer */}
        {drawerOpen && (
          <div className="absolute inset-0 z-[1200] flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
            <div className="relative w-72 bg-[#1A1A1A] h-full flex flex-col shadow-2xl animate-slide-in-left">
              {/* Drawer Header */}
              <div className="pt-12 pb-6 px-6 border-b border-white/10">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="absolute top-10 right-4 text-white/60 hover:text-white"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FF6B2B] flex items-center justify-center text-white font-bold text-lg">{initials[0]}</div>
                  <div>
                    <p className="text-white font-semibold">{displayName}</p>
                    <p className="text-white/50 text-xs">{role}</p>
                  </div>
                </div>
              </div>

              {/* Drawer Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <p className="text-white/30 text-xs uppercase tracking-widest px-6 mb-3">Modules</p>
                {drawerItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                      className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.color + "22" }}>
                        <Icon size={18} style={{ color: item.color }} />
                      </div>
                      <span className="text-white/80 text-sm">{item.label}</span>
                      <ChevronRight size={14} className="text-white/20 ml-auto" />
                    </button>
                  );
                })}
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-white/10">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 text-white/40 hover:text-white/70 transition-colors text-sm"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}