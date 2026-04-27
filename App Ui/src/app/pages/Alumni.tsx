import { useState } from "react";
import { Search, Briefcase, MapPin, MessageCircle, UserPlus, ChevronRight, ExternalLink, GraduationCap } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const tabs = ["Network", "Jobs", "Mentors", "Directory"];

const alumni = [
  { id: 1, name: "Zara Ahmed", batch: "CS 2019", role: "Software Engineer", company: "Arbisoft", location: "Lahore", avatar: "ZA", color: "#FF6B2B", connected: true },
  { id: 2, name: "Ali Hassan", batch: "SE 2020", role: "Product Manager", company: "Airlift", location: "Karachi", avatar: "AH", color: "#8B5CF6", connected: false },
  { id: 3, name: "Sana Mir", batch: "CS 2018", role: "Data Scientist", company: "Systems Ltd", location: "Islamabad", avatar: "SM", color: "#3B82F6", connected: false },
  { id: 4, name: "Bilal Khan", batch: "EE 2021", role: "ML Engineer", company: "Folio3", location: "Karachi", avatar: "BK", color: "#10B981", connected: true },
];

const jobs = [
  { id: 1, title: "Junior Software Developer", company: "TechVentures PK", type: "Full-time", location: "Islamabad", posted: "2d ago", postedBy: "Zara Ahmed (Alumni)", skills: ["React", "Node.js"] },
  { id: 2, title: "Data Analyst Intern", company: "Telenor Pakistan", type: "Internship", location: "Islamabad", posted: "5d ago", postedBy: "Sana Mir (Alumni)", skills: ["Python", "SQL"] },
  { id: 3, title: "Android Developer", company: "Careem", type: "Full-time", location: "Remote", posted: "1w ago", postedBy: "Ali Hassan (Alumni)", skills: ["Kotlin", "Java"] },
  { id: 4, title: "UI/UX Designer", company: "Creative Chaos", type: "Part-time", location: "Lahore", posted: "2w ago", postedBy: "Bilal Khan (Alumni)", skills: ["Figma", "Adobe XD"] },
];

const mentors = [
  { id: 1, name: "Dr. Kamran Hayat", batch: "CS 2010", role: "Senior SWE at Google", expertise: ["Cloud", "Backend", "Career"], sessions: 12, rating: 4.9, avatar: "KH", color: "#FF6B2B" },
  { id: 2, name: "Ayesha Raza", batch: "SE 2015", role: "CTO at StartupXYZ", expertise: ["Startups", "Leadership", "Mobile"], sessions: 8, rating: 4.8, avatar: "AR", color: "#8B5CF6" },
  { id: 3, name: "Usman Farooq", batch: "CS 2017", role: "ML Research Lead", expertise: ["AI/ML", "Research", "Data"], sessions: 20, rating: 5.0, avatar: "UF", color: "#10B981" },
];

const jobTypeColor: Record<string, string> = {
  "Full-time": "#10B981",
  "Internship": "#3B82F6",
  "Part-time": "#F59E0B",
};

export function Alumni() {
  const [activeTab, setActiveTab] = useState("Network");
  const [search, setSearch] = useState("");
  const [connectedIds, setConnectedIds] = useState<number[]>([1, 4]);

  const toggleConnect = (id: number) => {
    setConnectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="bg-[#F7F7F9] min-h-full pb-6">
      {/* Header */}
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-800 font-semibold">Alumni Portal</h3>
            <p className="text-xs text-gray-400 mt-0.5">Connect with SZABIST graduates</p>
          </div>
          <div className="w-10 h-10 bg-[#FF6B2B]/10 rounded-xl flex items-center justify-center">
            <GraduationCap size={18} className="text-[#FF6B2B]" />
          </div>
        </div>
        <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2.5 gap-2">
          <Search size={15} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alumni, jobs, mentors..."
            className="flex-1 outline-none text-sm text-gray-600 placeholder-gray-300 bg-transparent"
          />
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

      {/* Stats banner */}
      <div className="mx-4 mt-4 bg-[#1A1A1A] rounded-2xl p-4 flex items-center justify-around">
        {[
          { val: "1,240+", label: "Alumni" },
          { val: "85", label: "Mentors" },
          { val: "34", label: "Open Jobs" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-white font-bold">{s.val}</p>
            <p className="text-white/40 text-[10px] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Network Tab */}
      {activeTab === "Network" && (
        <div className="px-4 mt-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-800">Alumni You May Know</p>
            <button className="text-xs text-[#FF6B2B] flex items-center gap-0.5">See all <ChevronRight size={12} /></button>
          </div>
          {alumni.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: a.color }}>
                {a.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{a.name}</p>
                <p className="text-xs text-gray-500">{a.role} at {a.company}</p>
                <div className="flex items-center gap-1 mt-0.5 text-gray-400 text-[10px]">
                  <MapPin size={9} />
                  <span>{a.location}</span>
                  <span className="text-gray-300">•</span>
                  <GraduationCap size={9} />
                  <span>{a.batch}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                  <MessageCircle size={14} className="text-gray-600" />
                </button>
                <button
                  onClick={() => toggleConnect(a.id)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    connectedIds.includes(a.id)
                      ? "bg-gray-100"
                      : "bg-[#FF6B2B]"
                  }`}
                >
                  <UserPlus size={14} className={connectedIds.includes(a.id) ? "text-gray-600" : "text-white"} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === "Jobs" && (
        <div className="px-4 mt-4 space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{job.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{job.company}</p>
                </div>
                <span
                  className="text-[10px] px-2 py-1 rounded-full text-white font-medium"
                  style={{ backgroundColor: jobTypeColor[job.type] }}
                >
                  {job.type}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <MapPin size={10} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Briefcase size={10} />
                  <span>{job.posted}</span>
                </div>
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {job.skills.map((s) => (
                  <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Posted by {job.postedBy}</p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-[#1A1A1A] text-white text-xs py-2.5 rounded-xl font-medium">Apply Now</button>
                <button className="w-10 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                  <ExternalLink size={14} className="text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mentors Tab */}
      {activeTab === "Mentors" && (
        <div className="px-4 mt-4 space-y-3">
          {mentors.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: m.color }}>
                  {m.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.role}</p>
                  <p className="text-[10px] text-gray-400">{m.batch}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#F59E0B]">⭐ {m.rating}</p>
                  <p className="text-[10px] text-gray-400">{m.sessions} sessions</p>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap mb-3">
                {m.expertise.map((e) => (
                  <span key={e} className="text-[10px] bg-orange-50 text-[#FF6B2B] px-2 py-0.5 rounded-full border border-orange-100">{e}</span>
                ))}
              </div>
              <button className="w-full bg-[#FF6B2B] text-white text-xs py-2.5 rounded-xl font-medium">
                Request Mentorship Session
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Directory Tab */}
      {activeTab === "Directory" && (
        <div className="px-4 mt-4 flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <GraduationCap size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Alumni Directory</p>
          <p className="text-gray-300 text-xs mt-1 text-center">Browse all SZABIST graduates by batch, department, or industry</p>
          <button className="mt-4 bg-[#FF6B2B] text-white text-sm px-6 py-2.5 rounded-xl">Browse Directory</button>
        </div>
      )}
    </div>
  );
}
