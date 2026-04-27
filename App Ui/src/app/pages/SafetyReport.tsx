import { useState } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, Eye, ChevronRight, Send, XCircle } from "lucide-react";

const categories = [
  { label: "Misconduct", color: "#EF4444", icon: "⚠️" },
  { label: "Harassment", color: "#EF4444", icon: "🚨" },
  { label: "Bullying", color: "#F59E0B", icon: "👊" },
  { label: "Academic Fraud", color: "#8B5CF6", icon: "📋" },
  { label: "Safety Hazard", color: "#F97316", icon: "⚡" },
  { label: "Inappropriate Content", color: "#EF4444", icon: "🔞" },
  { label: "Other", color: "#6B7280", icon: "📝" },
];

const myReports = [
  {
    id: 1,
    category: "Academic Fraud",
    summary: "Suspected plagiarism in group project submission",
    date: "Mar 10, 2026",
    status: "under_review",
  },
  {
    id: 2,
    category: "Safety Hazard",
    summary: "Broken fire exit handle in CS block stairwell",
    date: "Feb 28, 2026",
    status: "resolved",
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  under_review: { label: "Under Review", color: "#F59E0B", icon: Clock },
  resolved: { label: "Resolved", color: "#10B981", icon: CheckCircle },
  dismissed: { label: "Dismissed", color: "#6B7280", icon: XCircle },
};

export function SafetyReport() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("Report");

  const handleSubmit = () => {
    if (!selectedCategory || !description.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedCategory(null);
      setDescription("");
    }, 3000);
  };

  return (
    <div className="bg-[#F7F7F9] min-h-full pb-6">
      {/* Header */}
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
            <ShieldAlert size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold">Safety Reporting</h3>
            <p className="text-xs text-gray-400">Your identity is protected by default</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white flex border-b border-gray-100 px-4">
        {["Report", "My Reports", "Guidelines"].map((tab) => (
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

      {/* Report Tab */}
      {activeTab === "Report" && (
        <div className="px-4 mt-4 space-y-4">
          {submitted ? (
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-[#10B981]" />
              </div>
              <h3 className="text-gray-800 font-semibold mb-2">Report Submitted</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Thank you for helping keep our campus safe. Our moderation team will review your report within 24–48 hours. You will be notified of any updates.
              </p>
              <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3 w-full">
                <p className="text-xs text-gray-500">Report ID: <strong>#RPT-{Date.now().toString().slice(-6)}</strong></p>
              </div>
            </div>
          ) : (
            <>
              {/* Emergency notice */}
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-start gap-3">
                <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-red-700">Emergency?</p>
                  <p className="text-xs text-red-600 mt-0.5">
                    For immediate danger, call Campus Security at <strong>051-4863363</strong> or dial <strong>15</strong> (Police).
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-800 mb-3">Report Category</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => setSelectedCategory(cat.label)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl text-xs font-medium transition-all border ${
                        selectedCategory === cat.label
                          ? "border-[#FF6B2B] bg-orange-50 text-[#FF6B2B]"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-800 mb-3">Describe the Incident</p>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide as much detail as possible: what happened, when, where, and who was involved (if known)..."
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B] resize-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">Minimum 50 characters required</p>
              </div>

              {/* Evidence */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-800 mb-2">Attach Evidence (Optional)</p>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center gap-3 text-gray-400">
                  <Eye size={18} />
                  <div>
                    <p className="text-xs">Screenshots, photos, or documents</p>
                    <p className="text-[10px] mt-0.5 text-gray-300">Max 10MB per file</p>
                  </div>
                  <button className="ml-auto text-xs text-[#FF6B2B] bg-orange-50 px-3 py-1.5 rounded-lg">Browse</button>
                </div>
              </div>

              {/* Anonymous toggle */}
              <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Submit Anonymously</p>
                  <p className="text-xs text-gray-400 mt-0.5">Your identity will not be shared with the reported party</p>
                </div>
                <button
                  onClick={() => setAnonymous(!anonymous)}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${anonymous ? "bg-[#FF6B2B]" : "bg-gray-200"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${anonymous ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedCategory || description.length < 20}
                className="w-full bg-[#FF6B2B] text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
              >
                <Send size={16} />
                Submit Report
              </button>
            </>
          )}
        </div>
      )}

      {/* My Reports Tab */}
      {activeTab === "My Reports" && (
        <div className="px-4 mt-4 space-y-3">
          {myReports.map((report) => {
            const status = statusConfig[report.status];
            const StatusIcon = status.icon;
            return (
              <div key={report.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{report.category}</span>
                    </div>
                    <p className="text-sm text-gray-700">{report.summary}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{report.date}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                    <StatusIcon size={12} style={{ color: status.color }} />
                    <span className="text-[10px] font-medium" style={{ color: status.color }}>{status.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-2 text-xs text-gray-600">
                    <Eye size={11} />
                    View Details
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-2 text-xs text-gray-600">
                    <ChevronRight size={11} />
                    Follow Up
                  </button>
                </div>
              </div>
            );
          })}

          {myReports.length === 0 && (
            <div className="flex flex-col items-center py-16">
              <ShieldAlert size={32} className="text-gray-300 mb-3" />
              <p className="text-gray-400 text-sm">No reports submitted yet</p>
            </div>
          )}
        </div>
      )}

      {/* Guidelines Tab */}
      {activeTab === "Guidelines" && (
        <div className="px-4 mt-4 space-y-3">
          {[
            { title: "What to Report", content: "Harassment, bullying, academic dishonesty, physical threats, inappropriate content, or campus safety hazards." },
            { title: "What Happens After", content: "Reports are reviewed by the Admin team within 24–48 hours. Verified reports lead to investigation and may result in warnings, suspension, or permanent ban." },
            { title: "False Reporting", content: "Submitting false reports is a violation of community standards and may result in disciplinary action against the reporter." },
            { title: "Evidence", content: "Attaching screenshots or documents strengthens your report and helps the moderation team take faster action." },
            { title: "Your Privacy", content: "Anonymous reports do not reveal your identity to the reported party. Admin may contact you confidentially if follow-up is needed." },
          ].map((g) => (
            <div key={g.title} className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-800 mb-1.5">{g.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{g.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
