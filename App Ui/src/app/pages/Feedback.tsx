import { useState } from "react";
import { BarChart2, MessageSquare, TrendingUp, TrendingDown, Minus, Plus, Send, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

const tabs = ["Polls", "Sentiment", "My Feedback"];

const polls = [
  {
    id: 1,
    question: "How would you rate the campus Wi-Fi quality this week?",
    type: "rating",
    total: 312,
    results: [
      { label: "Excellent", value: 45, color: "#10B981" },
      { label: "Good", value: 98, color: "#3B82F6" },
      { label: "Average", value: 112, color: "#F59E0B" },
      { label: "Poor", value: 57, color: "#EF4444" },
    ],
    voted: true,
    myVote: "Good",
    createdBy: "Campus Admin",
    tag: "Infrastructure",
  },
  {
    id: 2,
    question: "Which library extension hours work best for you?",
    type: "multiple",
    total: 188,
    results: [
      { label: "Until 10 PM", value: 89, color: "#FF6B2B" },
      { label: "Until 8 PM", value: 54, color: "#8B5CF6" },
      { label: "24/7 Access", value: 45, color: "#10B981" },
    ],
    voted: false,
    myVote: null,
    createdBy: "Library Committee",
    tag: "Facilities",
  },
  {
    id: 3,
    question: "How satisfied are you with the FYP supervision process?",
    type: "satisfaction",
    total: 97,
    results: [
      { label: "Very Satisfied", value: 28, color: "#10B981" },
      { label: "Satisfied", value: 41, color: "#3B82F6" },
      { label: "Neutral", value: 18, color: "#F59E0B" },
      { label: "Dissatisfied", value: 10, color: "#EF4444" },
    ],
    voted: false,
    myVote: null,
    createdBy: "CS Department",
    tag: "Academic",
  },
];

const sentimentData = [
  { day: "Mon", score: 62 },
  { day: "Tue", score: 74 },
  { day: "Wed", score: 58 },
  { day: "Thu", score: 81 },
  { day: "Fri", score: 77 },
  { day: "Sat", score: 85 },
];

const sentimentTopics = [
  { topic: "Campus Facilities", score: 72, trend: "up" },
  { topic: "Academic Quality", score: 84, trend: "up" },
  { topic: "Wi-Fi & Tech", score: 55, trend: "down" },
  { topic: "Canteen Food", score: 48, trend: "down" },
  { topic: "Staff Helpfulness", score: 78, trend: "neutral" },
];

export function Feedback() {
  const [activeTab, setActiveTab] = useState("Polls");
  const [votedPolls, setVotedPolls] = useState<Record<number, string>>({ 1: "Good" });
  const [newFeedback, setNewFeedback] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("General");

  const vote = (pollId: number, option: string) => {
    setVotedPolls(prev => ({ ...prev, [pollId]: option }));
  };

  return (
    <div className="bg-[#F7F7F9] min-h-full pb-6">
      {/* Header */}
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-gray-800 font-semibold">Student Feedback</h3>
          <div className="w-9 h-9 bg-[#FF6B2B]/10 rounded-xl flex items-center justify-center">
            <BarChart2 size={18} className="text-[#FF6B2B]" />
          </div>
        </div>
        <p className="text-xs text-gray-400">Help shape SZABIST by sharing your experience</p>
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

      {/* Polls Tab */}
      {activeTab === "Polls" && (
        <div className="px-4 mt-4 space-y-4">
          {polls.map((poll) => {
            const voted = !!votedPolls[poll.id];
            const total = poll.results.reduce((s, r) => s + r.value, 0);
            return (
              <div key={poll.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-[10px] bg-orange-50 text-[#FF6B2B] px-2 py-0.5 rounded-full">{poll.tag}</span>
                  <span className="text-[10px] text-gray-400">{poll.total} votes</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 mt-2 mb-4">{poll.question}</p>

                {!voted ? (
                  <div className="space-y-2">
                    {poll.results.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => vote(poll.id, opt.label)}
                        className="w-full flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-[#FF6B2B] hover:text-[#FF6B2B] transition-colors text-left"
                      >
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {poll.results.map((opt) => {
                      const pct = Math.round((opt.value / total) * 100);
                      const isSelected = votedPolls[poll.id] === opt.label;
                      return (
                        <div key={opt.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs ${isSelected ? "font-semibold" : "text-gray-500"}`} style={isSelected ? { color: opt.color } : {}}>
                              {opt.label} {isSelected && "✓"}
                            </span>
                            <span className="text-xs text-gray-400">{pct}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: opt.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <p className="text-[10px] text-gray-400 mt-3">By {poll.createdBy}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Sentiment Tab */}
      {activeTab === "Sentiment" && (
        <div className="px-4 mt-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-1">Campus Mood This Week</p>
            <p className="text-xs text-gray-400 mb-4">Based on aggregated student feedback sentiment</p>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-3xl font-bold text-gray-900">73</span>
              <span className="text-gray-400 text-sm mb-1">/100</span>
              <span className="text-[#10B981] text-xs mb-1 ml-1 flex items-center gap-0.5">
                <TrendingUp size={12} /> +5 from last week
              </span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentData} barSize={24}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {sentimentData.map((entry, i) => (
                      <Cell key={i} fill={entry.score >= 75 ? "#FF6B2B" : "#E5E7EB"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-3">Topic Breakdown</p>
            <div className="space-y-3">
              {sentimentTopics.map((t) => (
                <div key={t.topic} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-700">{t.topic}</span>
                      <div className="flex items-center gap-1">
                        {t.trend === "up" && <TrendingUp size={11} className="text-[#10B981]" />}
                        {t.trend === "down" && <TrendingDown size={11} className="text-[#EF4444]" />}
                        {t.trend === "neutral" && <Minus size={11} className="text-gray-400" />}
                        <span className="text-xs font-semibold text-gray-800">{t.score}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${t.score}%`,
                          backgroundColor: t.score >= 70 ? "#10B981" : t.score >= 55 ? "#F59E0B" : "#EF4444"
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* My Feedback Tab */}
      {activeTab === "My Feedback" && (
        <div className="px-4 mt-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-3">Submit Feedback</p>
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1.5 block">Category</label>
              <div className="flex gap-2 flex-wrap">
                {["General", "Academic", "Facilities", "Faculty", "Events"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setFeedbackCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      feedbackCategory === c ? "bg-[#FF6B2B] text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="Share your thoughts about campus life, academic quality, facilities..."
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B] resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-[10px] text-gray-400">Your feedback is anonymous unless you choose to reveal your identity</p>
            </div>
            <button className="mt-3 w-full bg-[#FF6B2B] text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
              <Send size={14} />
              Submit Feedback
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-800">My Past Submissions</p>
              <button className="text-xs text-[#FF6B2B] flex items-center gap-0.5">
                See all <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { cat: "Facilities", snippet: "The new seating in library is great but need more...", date: "Mar 10" },
                { cat: "Academic", snippet: "FYP guidance has been excellent this semester...", date: "Mar 05" },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-[10px] bg-orange-50 text-[#FF6B2B] px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0">{f.cat}</span>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 leading-relaxed">{f.snippet}</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">{f.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
