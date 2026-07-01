import { useState, useMemo } from "react";
import { BarChart2, TrendingUp, TrendingDown, Minus, Plus, Send, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

const tabs = ["Polls", "Sentiment", "My Feedback"];

const initialPolls = [
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

const sentimentTopics = [
  { topic: "Campus Facilities", score: 72, trend: "up" },
  { topic: "Academic Quality", score: 84, trend: "up" },
  { topic: "Wi-Fi & Tech", score: 55, trend: "down" },
  { topic: "Canteen Food", score: 48, trend: "down" },
  { topic: "Staff Helpfulness", score: 78, trend: "neutral" },
];

export function Feedback() {
  const [activeTab, setActiveTab] = useState("Polls");

  // Load polls and votes from localStorage
  const [activePolls, setActivePolls] = useState<any[]>(() => {
    const raw = localStorage.getItem("cc_polls");
    return raw ? JSON.parse(raw) : initialPolls;
  });

  const [votedPolls, setVotedPolls] = useState<Record<number, string>>(() => {
    const raw = localStorage.getItem("cc_voted_polls");
    return raw ? JSON.parse(raw) : { 1: "Good" };
  });

  // Feedback form states
  const [newFeedback, setNewFeedback] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("General");
  
  const [pastFeedbacks, setPastFeedbacks] = useState<any[]>(() => {
    const raw = localStorage.getItem("cc_past_feedbacks");
    return raw ? JSON.parse(raw) : [
      { cat: "Facilities", snippet: "The new seating in library is great but need more...", date: "Mar 10", sentiment: "positive" },
      { cat: "Academic", snippet: "FYP guidance has been excellent this semester...", date: "Mar 05", sentiment: "positive" },
    ];
  });

  // Create poll states
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollTag, setPollTag] = useState("General");
  const [pollOption1, setPollOption1] = useState("");
  const [pollOption2, setPollOption2] = useState("");
  const [pollOption3, setPollOption3] = useState("");
  const [pollOption4, setPollOption4] = useState("");

  const vote = (pollId: number, option: string) => {
    const newVoted = { ...votedPolls, [pollId]: option };
    setVotedPolls(newVoted);
    localStorage.setItem("cc_voted_polls", JSON.stringify(newVoted));

    const updatedPolls = activePolls.map(poll => {
      if (poll.id === pollId) {
        const results = poll.results.map((opt: any) => {
          if (opt.label === option) {
            return { ...opt, value: opt.value + 1 };
          }
          return opt;
        });
        return { ...poll, results, total: poll.total + 1 };
      }
      return poll;
    });
    setActivePolls(updatedPolls);
    localStorage.setItem("cc_polls", JSON.stringify(updatedPolls));
  };

  const handleCreatePoll = () => {
    if (!pollQuestion.trim() || !pollOption1.trim() || !pollOption2.trim()) {
      alert("Please fill in the question and at least 2 options!");
      return;
    }

    const options = [pollOption1.trim(), pollOption2.trim()];
    if (pollOption3.trim()) options.push(pollOption3.trim());
    if (pollOption4.trim()) options.push(pollOption4.trim());

    const colors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"];

    const newPoll = {
      id: Date.now(),
      question: pollQuestion.trim(),
      type: "multiple",
      total: 0,
      results: options.map((opt, index) => ({
        label: opt,
        value: 0,
        color: colors[index % colors.length]
      })),
      voted: false,
      myVote: null,
      createdBy: "Student Representative",
      tag: pollTag
    };

    const updated = [newPoll, ...activePolls];
    setActivePolls(updated);
    localStorage.setItem("cc_polls", JSON.stringify(updated));

    // Reset Form
    setPollQuestion("");
    setPollOption1("");
    setPollOption2("");
    setPollOption3("");
    setPollOption4("");
    setPollTag("General");
    setShowCreatePoll(false);
  };

  const handleSubmitFeedback = () => {
    if (!newFeedback.trim()) {
      alert("Please enter your thoughts before submitting!");
      return;
    }

    const text = newFeedback.toLowerCase();
    const posWords = ["good", "great", "excellent", "awesome", "like", "love", "best", "clean", "helpful", "improved", "superb", "satisfied", "satisfying"];
    const negWords = ["bad", "poor", "worst", "slow", "wait", "dirty", "broken", "terrible", "down", "issue", "problem", "dissatisfied", "dislike"];
    
    let posCount = 0;
    let negCount = 0;
    posWords.forEach(w => { if (text.includes(w)) posCount++; });
    negWords.forEach(w => { if (text.includes(w)) negCount++; });

    let sentiment: "positive" | "negative" | "neutral" = "neutral";
    if (posCount > negCount) sentiment = "positive";
    else if (negCount > posCount) sentiment = "negative";

    const newItem = {
      cat: feedbackCategory,
      snippet: newFeedback.trim(),
      date: "Just now",
      sentiment
    };

    const updated = [newItem, ...pastFeedbacks];
    setPastFeedbacks(updated);
    localStorage.setItem("cc_past_feedbacks", JSON.stringify(updated));
    setNewFeedback("");
    alert(`Feedback posted anonymously!\nDynamic Sentiment Engine tagged this: ${sentiment.toUpperCase()}`);
  };

  // Compute sentiment statistics
  const moodScore = useMemo(() => {
    let score = 73; // baseline
    pastFeedbacks.forEach(f => {
      if (f.sentiment === "positive") score += 3;
      if (f.sentiment === "negative") score -= 4;
    });
    return Math.min(100, Math.max(0, score));
  }, [pastFeedbacks]);

  const sentimentData = useMemo(() => {
    return [
      { day: "Mon", score: 62 },
      { day: "Tue", score: 74 },
      { day: "Wed", score: 58 },
      { day: "Thu", score: 81 },
      { day: "Fri", score: Math.max(20, moodScore - 5) },
      { day: "Today", score: moodScore },
    ];
  }, [moodScore]);

  return (
    <div className="bg-[#F7F7F9] min-h-full pb-6">
      {/* Header */}
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-gray-800 font-semibold">Student Feedback</h3>
          <button
            onClick={() => setShowCreatePoll(true)}
            className="flex items-center gap-1.5 bg-[#FF6B2B] text-white text-xs px-3 py-1.5 rounded-xl font-medium"
          >
            <Plus size={13} />
            Create Poll
          </button>
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
          {activePolls.map((poll) => {
            const voted = !!votedPolls[poll.id];
            const total = poll.results.reduce((s: number, r: any) => s + r.value, 0);
            return (
              <div key={poll.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-[10px] bg-orange-50 text-[#FF6B2B] px-2 py-0.5 rounded-full">{poll.tag}</span>
                  <span className="text-[10px] text-gray-400">{poll.total + (voted && poll.total === 0 ? 1 : 0)} votes</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 mt-2 mb-4">{poll.question}</p>

                {!voted ? (
                  <div className="space-y-2">
                    {poll.results.map((opt: any) => (
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
                    {poll.results.map((opt: any) => {
                      const optTotal = total === 0 ? 1 : total;
                      const pct = Math.round((opt.value / optTotal) * 100);
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
            <p className="text-sm font-semibold text-gray-800 mb-1">Campus Mood Score</p>
            <p className="text-xs text-gray-400 mb-4">Sentiment Engine analytics based on aggregated student feedback</p>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-3xl font-bold text-gray-900">{moodScore}</span>
              <span className="text-gray-400 text-sm mb-1">/100</span>
              {moodScore >= 73 ? (
                <span className="text-[#10B981] text-xs mb-1 ml-1 flex items-center gap-0.5 font-semibold">
                  <TrendingUp size={12} /> +{moodScore - 73} from baseline
                </span>
              ) : (
                <span className="text-[#EF4444] text-xs mb-1 ml-1 flex items-center gap-0.5 font-semibold">
                  <TrendingDown size={12} /> -{73 - moodScore} from baseline
                </span>
              )}
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
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF6B2B] resize-none bg-white"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-[10px] text-gray-400">Your feedback is 100% anonymous & secured</p>
            </div>
            <button
              onClick={handleSubmitFeedback}
              className="mt-3 w-full bg-[#FF6B2B] text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            >
              <Send size={14} />
              Submit Feedback
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-800">My Feedback Logs</p>
              <button className="text-xs text-[#FF6B2B] flex items-center gap-0.5">
                See all <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {pastFeedbacks.map((f, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="flex flex-col gap-1 items-start flex-shrink-0">
                    <span className="text-[10px] bg-orange-50 text-[#FF6B2B] px-2 py-0.5 rounded-full mt-0.5">{f.cat}</span>
                    <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                      f.sentiment === "positive" ? "bg-green-100 text-green-700" :
                      f.sentiment === "negative" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {f.sentiment}
                    </span>
                  </div>
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

      {/* Create Poll Modal */}
      {showCreatePoll && (
        <div className="absolute inset-0 bg-black/50 z-40 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Create Campus Poll</h3>
              <button onClick={() => setShowCreatePoll(false)} className="text-gray-400 text-sm">Cancel</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Survey Question</label>
                <input
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="e.g., Should we install vending machines in CS Block?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6B2B] text-gray-700 bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Category Tag</label>
                <select
                  value={pollTag}
                  onChange={(e) => setPollTag(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#FF6B2B] text-gray-700 bg-white"
                >
                  <option value="General">General</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Academic">Academic</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Events">Events</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 block">Poll Choices</label>
                <input
                  value={pollOption1}
                  onChange={(e) => setPollOption1(e.target.value)}
                  placeholder="Choice 1 (Required)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B2B] text-gray-700 bg-white"
                />
                <input
                  value={pollOption2}
                  onChange={(e) => setPollOption2(e.target.value)}
                  placeholder="Choice 2 (Required)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B2B] text-gray-700 bg-white"
                />
                <input
                  value={pollOption3}
                  onChange={(e) => setPollOption3(e.target.value)}
                  placeholder="Choice 3 (Optional)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B2B] text-gray-700 bg-white"
                />
                <input
                  value={pollOption4}
                  onChange={(e) => setPollOption4(e.target.value)}
                  placeholder="Choice 4 (Optional)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B2B] text-gray-700 bg-white"
                />
              </div>
              <button
                onClick={handleCreatePoll}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-4 rounded-2xl font-medium transition-colors text-sm"
              >
                Publish Survey Poll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
