import { useState, useMemo } from "react";
import { Users, ShieldAlert, Activity, Settings, CheckCircle, BarChart2, Eye, Ban, ChevronRight, X, AlertTriangle } from "lucide-react";
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

const initialUsers = [
  { name: "M. Tayyab Rasheed", email: "tayyab@szabist-isb.edu.pk", role: "Student", status: "active" },
  { name: "Ahmed Ayan", email: "ahmed@szabist-isb.edu.pk", role: "Student", status: "active" },
  { name: "Dr. Imran Khan", email: "imran.k@szabist-isb.edu.pk", role: "Faculty", status: "active" },
  { name: "Zara Ahmed", email: "zara@szabist-isb.edu.pk", role: "Alumni", status: "active" },
  { name: "Anonymous_cs22", email: "cs22_xxx@szabist-isb.edu.pk", role: "Student", status: "suspended" },
];

const initialReports = [
  { 
    id: 1, 
    category: "Academic Fraud", 
    user: "Anonymous", 
    date: "Mar 17", 
    status: "pending", 
    reportedUser: "Ahmed Ayan",
    description: "Student was caught exchanging exam answers during the final project submission in the Main Auditorium on Tuesday. Two distinct screenshots were uploaded as proof." 
  },
  { 
    id: 2, 
    category: "Harassment", 
    user: "Anonymous", 
    date: "Mar 16", 
    status: "pending", 
    reportedUser: "Anonymous_cs22",
    description: "Inappropriate and abusive statements were continuously posted on the Department BBA Chat channel. Verified by peer student complaints." 
  },
  { 
    id: 3, 
    category: "Misconduct", 
    user: "u/cs2022_user", 
    date: "Mar 15", 
    status: "reviewing", 
    reportedUser: "M. Tayyab Rasheed",
    description: "Intentional damage caused to students cafeteria furniture and fixtures after the basketball tournament loss on Friday."
  },
];

const initialLogs = [
  { action: "User suspended: cs22_xxx", user: "admin@szabist", time: "2h ago", type: "warning" },
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

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  // Load state from localStorage to ensure demo persistence
  const [users, setUsers] = useState<any[]>(() => {
    const raw = localStorage.getItem("cc_admin_users");
    return raw ? JSON.parse(raw) : initialUsers;
  });

  const [reports, setReports] = useState<any[]>(() => {
    const raw = localStorage.getItem("cc_admin_reports");
    return raw ? JSON.parse(raw) : initialReports;
  });

  const [logs, setLogs] = useState<any[]>(() => {
    const raw = localStorage.getItem("cc_admin_logs");
    return raw ? JSON.parse(raw) : initialLogs;
  });

  // Modal detail view
  const [viewingReport, setViewingReport] = useState<any | null>(null);

  const updateUsersList = (newUsers: any[]) => {
    setUsers(newUsers);
    localStorage.setItem("cc_admin_users", JSON.stringify(newUsers));
  };

  const updateReportsList = (newReports: any[]) => {
    setReports(newReports);
    localStorage.setItem("cc_admin_reports", JSON.stringify(newReports));
  };

  const updateLogsList = (newLogs: any[]) => {
    setLogs(newLogs);
    localStorage.setItem("cc_admin_logs", JSON.stringify(newLogs));
  };

  // Toggle suspension state for a user
  const toggleSuspendUser = (email: string) => {
    const userObj = users.find(u => u.email === email);
    if (!userObj) return;

    const willSuspend = userObj.status !== "suspended";
    const updatedUsers = users.map(u => {
      if (u.email === email) {
        return { ...u, status: willSuspend ? "suspended" : "active" };
      }
      return u;
    });
    updateUsersList(updatedUsers);

    // Create log entry
    const newLog = {
      action: willSuspend ? `User suspended: ${userObj.name}` : `User restored: ${userObj.name}`,
      user: "admin@szabist",
      time: "Just now",
      type: willSuspend ? "warning" : "success",
    };
    updateLogsList([newLog, ...logs]);
  };

  // Resolve report ticket
  const handleResolveReport = (reportId: number) => {
    const rep = reports.find(r => r.id === reportId);
    if (!rep) return;

    const updated = reports.map(r => r.id === reportId ? { ...r, status: "resolved" } : r);
    updateReportsList(updated);

    const newLog = {
      action: `Resolved report #${reportId} (${rep.category})`,
      user: "admin@szabist",
      time: "Just now",
      type: "success",
    };
    updateLogsList([newLog, ...logs]);
    setViewingReport(null);
    alert(`Safety Ticket #${reportId} has been resolved.`);
  };

  // Ban reported student directly from ticket
  const handleBanReportedUser = (reportId: number, reportedName: string) => {
    const rep = reports.find(r => r.id === reportId);
    if (!rep) return;

    // Ban user
    const updatedUsers = users.map(u => u.name === reportedName ? { ...u, status: "suspended" } : u);
    updateUsersList(updatedUsers);

    // Resolve report
    const updatedReports = reports.map(r => r.id === reportId ? { ...r, status: "resolved" } : r);
    updateReportsList(updatedReports);

    // Log action
    const newLog = {
      action: `Banned student ${reportedName} & resolved ticket #${reportId}`,
      user: "admin@szabist",
      time: "Just now",
      type: "danger",
    };
    updateLogsList([newLog, ...logs]);
    setViewingReport(null);
    alert(`Report #${reportId} resolved. User "${reportedName}" has been successfully suspended from SZABIST Campus Connect!`);
  };

  // Export logs to real CSV file
  const handleExportCSV = () => {
    const header = "Action,Auditor,Timestamp,Severity Level\n";
    const rows = logs.map(l => `"${l.action}","${l.user}","${l.time}","${l.type.toUpperCase()}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `szabist_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate dynamic stats
  const activeReportsCount = useMemo(() => {
    return reports.filter(r => r.status === "pending" || r.status === "reviewing").length;
  }, [reports]);

  const statCards = useMemo(() => {
    return [
      { label: "Total Users", value: (3474 + users.length).toLocaleString(), change: "+12%", icon: Users, color: "#FF6B2B" },
      { label: "Active Today", value: "847", change: "+5%", icon: Activity, color: "#10B981" },
      { label: "Open Reports", value: activeReportsCount.toString(), change: `-${3 - activeReportsCount}`, icon: ShieldAlert, color: "#EF4444" },
      { label: "Events This Month", value: "28", change: "+7", icon: BarChart2, color: "#8B5CF6" },
    ];
  }, [users, activeReportsCount]);

  return (
    <div className="bg-[#F7F7F9] min-h-full pb-6 relative">
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
                    <span className="text-[10px] text-[#10B981] font-semibold">{stat.change}</span>
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
            <p className="text-sm font-semibold text-gray-800 mb-3">User Directory</p>
            {users.map((user, i) => (
              <div key={user.email} className={`flex items-center gap-3 py-3 ${i !== users.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold ${user.status === "suspended" ? "bg-red-400" : "bg-[#FF6B2B]"}`}>
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-800">{user.name}</p>
                  <p className="text-[10px] text-gray-400">{user.email} • <span className="font-semibold text-gray-500">{user.role}</span></p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${user.status === "suspended" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                    {user.status}
                  </span>
                  <button
                    onClick={() => toggleSuspendUser(user.email)}
                    title={user.status === "suspended" ? "Activate Account" : "Suspend Account"}
                    className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200"
                  >
                    {user.status === "suspended" ? (
                      <CheckCircle size={12} className="text-green-600" />
                    ) : (
                      <Ban size={12} className="text-red-500" />
                    )}
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
            <p className="text-sm font-semibold text-gray-800">Pending Safety Tickets</p>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">{activeReportsCount} open</span>
          </div>
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] bg-orange-50 text-[#FF6B2B] px-2 py-0.5 rounded-full font-semibold">{report.category}</span>
                  <p className="text-xs font-semibold text-gray-800 mt-2">Reported: {report.reportedUser}</p>
                  <p className="text-[10px] text-gray-400">By {report.user} • {report.date}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                  report.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  report.status === "reviewing" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                }`}>
                  {report.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-3 leading-relaxed">{report.description}</p>
              
              {report.status !== "resolved" && (
                <div className="flex gap-2 border-t border-gray-50 pt-2.5">
                  <button
                    onClick={() => setViewingReport(report)}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-2 text-xs text-gray-600 font-medium bg-gray-50 hover:bg-gray-100"
                  >
                    <Eye size={12} />
                    View Details
                  </button>
                  <button
                    onClick={() => handleResolveReport(report.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl py-2 text-xs text-green-600 font-medium"
                  >
                    <CheckCircle size={12} />
                    Resolve
                  </button>
                  <button
                    onClick={() => handleBanReportedUser(report.id, report.reportedUser)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl py-2 text-xs text-red-600 font-medium"
                  >
                    <Ban size={12} />
                    Ban Student
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === "Logs" && (
        <div className="px-4 mt-4 space-y-3">
          <p className="text-sm font-semibold text-gray-800">Activity Audit Logs</p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {logs.map((log, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3.5 ${i !== logs.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: logColors[log.type] || "#CBD5E1" }} />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-800">{log.action}</p>
                  <p className="text-[10px] text-gray-400">{log.user}</p>
                </div>
                <span className="text-[10px] text-gray-400">{log.time}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Export Audits</p>
                <p className="text-xs text-gray-400 mt-0.5">Download complete logs trail</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="bg-[#1A1A1A] hover:bg-black text-white text-xs px-4 py-2.5 rounded-xl font-medium transition-colors"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Report Detail Modal */}
      {viewingReport && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-red-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AlertTriangle size={16} />
                <h4 className="font-bold text-sm tracking-wide">Review Safety Ticket #{viewingReport.id}</h4>
              </div>
              <button onClick={() => setViewingReport(null)} className="text-white hover:opacity-80">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{viewingReport.category}</span>
                <h3 className="font-bold text-gray-900 mt-2 text-base">Reported: {viewingReport.reportedUser}</h3>
                <p className="text-[10px] text-gray-400">Filed by: {viewingReport.user} • {viewingReport.date}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 text-xs text-gray-600 leading-relaxed font-medium">
                <p className="text-gray-400 mb-1 font-bold text-[9px] uppercase tracking-wider">Audit Description</p>
                {viewingReport.description}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleResolveReport(viewingReport.id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 text-xs font-semibold transition-colors"
                >
                  <CheckCircle size={13} />
                  Mark Resolved
                </button>
                <button
                  onClick={() => handleBanReportedUser(viewingReport.id, viewingReport.reportedUser)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 text-xs font-semibold transition-colors"
                >
                  <Ban size={13} />
                  Ban Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
