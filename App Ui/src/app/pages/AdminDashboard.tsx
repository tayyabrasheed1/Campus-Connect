import { useState } from "react";
import { Users, ShieldAlert, Activity, Settings, TrendingUp, CheckCircle, Clock, XCircle, BarChart2, Eye, Ban, ChevronRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";

const tabs = ["Overview", "Users", "Reports", "Logs"];

const activityData = [
  { day: "Mon", users: 340, events: 12 },
  { day: "Tue", users: 420, events: 18 },
  { day: "Wed", users: 380, events: 15 },
  { day: "Thu", users: 510, events: 22 },
  { day: "Fri", users: 460, events: 19 },
  { day: "Sat", users: 280, events: 8 },
  { day: "Sun", users: 180, events: 5 },
];

const roleData = [
  { name: "Students", value: 2140, color: "#FF6B2B" },
  { name: "Faculty", value: 87, color: "#3B82F6" },
  { name: "Alumni", value: 1240, color: "#8B5CF6" },
  { name: "Admin", value: 12, color: "#10B981" },
];

const pendingReports = [
  { id: 1, category: "Academic Fraud", user: "Anonymous", date: "Mar 17", status: "pending" },
  { id: 2, category: "Harassment", user: "Anonymous", date: "Mar 16", status: "pending" },
  { id: 3, category: "Misconduct", user: "u/cs2022_user", date: "Mar 15", status: "reviewing" },
];

const recentLogs = [
  { action: "User suspended", user: "cs_2022_xx", time: "2h ago", type: "warning" },
  { action: "New admin added", user: "admin@szabist", time: "5h ago", type: "info" },
  { action: "Resource deleted", user: "faculty_hamid", time: "8h ago", type: "danger" },
  { action: "Mass email sent", user: "admin@szabist", time: "1d ago", type: "info" },
  { action: "Database backup", user: "System", time: "1d ago", type: "success" },
];

const logColors: Record<string, string> = {
  warning: "#F59E0B",
  info: "#3B82F6",
  danger: "#EF4444",
  success: "#10B981",
};

const statCards = [
  { label: "Total Users", value: "3,479", change: "+12%", icon: Users, color: "#FF6B2B" },
  { label: "Active Today", value: "847", change: "+5%", icon: Activity, color: "#10B981" },
  { label: "Open Reports", value: "14", change: "-3", icon: ShieldAlert, color: "#EF4444" },
  { label: "Events This Month", value: "28", change: "+7", icon: BarChart2, color: "#8B5CF6" },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="bg-[#F7F7F9] min-h-full pb-6">
      {/* Header */}
      <div className="bg-[#1A1A1A] px-4 pb-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-white font-semibold">Admin Dashboard</h3>
            <p className="text-white/40 text-xs mt-0.5">SZABIST Campus Connect</p>
          </div>
          <button className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <Settings size={18} className="text-white/60" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white flex border-b border-gray-100 px-4">
        {tabs.map((tab) => (
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

      {/* Overview Tab */}
      {activeTab === "Overview" && (
        <div className="px-4 mt-4 space-y-4">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.color + "18" }}>
                      <Icon size={18} style={{ color: stat.color }} />
                    </div>
                    <span className="text-[10px] text-[#10B981] font-medium">{stat.change}</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Activity chart */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-800">Weekly Activity</p>
              <span className="text-xs text-gray-400">Users & Events</span>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B2B" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#FF6B2B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 11 }} />
                  <Area type="monotone" dataKey="users" stroke="#FF6B2B" strokeWidth={2} fill="url(#userGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Role distribution */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-4">User Role Distribution</p>
            <div className="flex items-center gap-4">
              <div className="w-28 h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={roleData} cx="50%" cy="50%" innerRadius={28} outerRadius={48} dataKey="value" strokeWidth={0}>
                      {roleData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {roleData.map((r) => (
                  <div key={r.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                      <span className="text-xs text-gray-600">{r.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">{r.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "Users" && (
        <div className="px-4 mt-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-3">User Management</p>
            {[
              { name: "M. Tayyab Rasheed", email: "tayyab@szabist-isb.edu.pk", role: "Student", status: "active" },
              { name: "Ahmed Ayan", email: "ahmed@szabist-isb.edu.pk", role: "Student", status: "active" },
              { name: "Dr. Imran Khan", email: "imran.k@szabist-isb.edu.pk", role: "Faculty", status: "active" },
              { name: "Zara Ahmed", email: "zara@szabist-isb.edu.pk", role: "Alumni", status: "active" },
              { name: "Anonymous_cs22", email: "cs22_xxx@szabist-isb.edu.pk", role: "Student", status: "suspended" },
            ].map((user, i) => (
              <div key={i} className={`flex items-center gap-3 py-3 ${i !== 4 ? "border-b border-gray-50" : ""}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold ${user.status === "suspended" ? "bg-red-400" : "bg-[#FF6B2B]"}`}>
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-800">{user.name}</p>
                  <p className="text-[10px] text-gray-400">{user.email}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${user.status === "suspended" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                    {user.status}
                  </span>
                  <button>
                    <ChevronRight size={14} className="text-gray-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "Reports" && (
        <div className="px-4 mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Pending Reports</p>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{pendingReports.length} open</span>
          </div>
          {pendingReports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] bg-orange-50 text-[#FF6B2B] px-2 py-0.5 rounded-full">{report.category}</span>
                  <p className="text-xs text-gray-500 mt-1">Submitted by {report.user}</p>
                  <p className="text-[10px] text-gray-300">{report.date}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${report.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>
                  {report.status}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-2 text-xs text-gray-600">
                  <Eye size={11} />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 border border-green-200 rounded-xl py-2 text-xs text-green-600">
                  <CheckCircle size={11} />
                  Resolve
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 border border-red-200 rounded-xl py-2 text-xs text-red-600">
                  <Ban size={11} />
                  Ban User
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === "Logs" && (
        <div className="px-4 mt-4 space-y-3">
          <p className="text-sm font-semibold text-gray-800">Activity Audit Logs</p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {recentLogs.map((log, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3.5 ${i !== recentLogs.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: logColors[log.type] }} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-800">{log.action}</p>
                  <p className="text-[10px] text-gray-400">{log.user}</p>
                </div>
                <span className="text-[10px] text-gray-400">{log.time}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Export Logs</p>
                <p className="text-xs text-gray-400 mt-0.5">Download complete audit trail</p>
              </div>
              <button className="bg-[#1A1A1A] text-white text-xs px-4 py-2 rounded-xl">Export CSV</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
