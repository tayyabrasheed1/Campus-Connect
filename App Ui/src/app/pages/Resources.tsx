import { useState } from "react";
import { Search, Upload, ExternalLink, FileText, Video, Link2, Pin, ChevronRight, Download } from "lucide-react";

const subjects = ["All", "CS-401", "SE-302", "AI-501", "DS-201", "NET-401"];

const resources = [
  {
    id: 1,
    title: "Introduction to Machine Learning - Lecture Slides",
    subject: "AI-501",
    type: "slides",
    uploadedBy: "Dr. Imran Khan (Faculty)",
    date: "Mar 15, 2026",
    size: "4.2 MB",
    pinned: true,
    link: null,
    faculty: true,
  },
  {
    id: 2,
    title: "LangChain Official Documentation",
    subject: "AI-501",
    type: "link",
    uploadedBy: "Dr. Imran Khan (Faculty)",
    date: "Mar 14, 2026",
    size: null,
    pinned: true,
    link: "https://langchain.com/docs",
    faculty: true,
  },
  {
    id: 3,
    title: "Data Structures — Mid Term Past Papers (2020-2024)",
    subject: "DS-201",
    type: "pdf",
    uploadedBy: "Ayesha Kamran (Student)",
    date: "Mar 12, 2026",
    size: "1.8 MB",
    pinned: false,
    link: null,
    faculty: false,
  },
  {
    id: 4,
    title: "React Native Tutorial — Full Course",
    subject: "SE-302",
    type: "video",
    uploadedBy: "Ms. Nadia Ali (Faculty)",
    date: "Mar 10, 2026",
    size: null,
    pinned: false,
    link: "https://youtube.com/watch?v=example",
    faculty: true,
  },
  {
    id: 5,
    title: "Operating Systems — Chapter 4 Notes",
    subject: "CS-401",
    type: "pdf",
    uploadedBy: "Muhammad Tayyab (Student)",
    date: "Mar 08, 2026",
    size: "860 KB",
    pinned: false,
    link: null,
    faculty: false,
  },
  {
    id: 6,
    title: "Supabase + PostgreSQL Setup Guide",
    subject: "SE-302",
    type: "link",
    uploadedBy: "Sir Hamid Iqbal (Faculty)",
    date: "Mar 05, 2026",
    size: null,
    pinned: false,
    link: "https://supabase.com/docs",
    faculty: true,
  },
];

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  pdf: { icon: FileText, color: "#EF4444", bg: "#FEE2E2", label: "PDF" },
  slides: { icon: FileText, color: "#3B82F6", bg: "#DBEAFE", label: "Slides" },
  video: { icon: Video, color: "#8B5CF6", bg: "#EDE9FE", label: "Video" },
  link: { icon: Link2, color: "#10B981", bg: "#D1FAE5", label: "Link" },
};

export function Resources() {
  const [activeSubject, setActiveSubject] = useState("All");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const filtered = resources.filter(r =>
    (activeSubject === "All" || r.subject === activeSubject) &&
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const pinned = filtered.filter(r => r.pinned);
  const rest = filtered.filter(r => !r.pinned);

  return (
    <div className="bg-[#F7F7F9] min-h-full pb-6">
      {/* Header */}
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 font-semibold">Study Resource Hub</h3>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-1.5 bg-[#FF6B2B] text-white text-xs px-3 py-2 rounded-xl"
          >
            <Upload size={13} />
            Upload
          </button>
        </div>
        <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2.5 gap-2">
          <Search size={15} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources, subjects..."
            className="flex-1 outline-none text-sm text-gray-600 placeholder-gray-300 bg-transparent"
          />
        </div>
      </div>

      {/* Subject filter */}
      <div className="flex gap-2 px-4 mt-4 overflow-x-auto no-scrollbar">
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSubject(s)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSubject === s
                ? "bg-[#1A1A1A] text-white"
                : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Faculty announcement banner */}
      <div className="mx-4 mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2">
        <Pin size={14} className="text-blue-500 flex-shrink-0" />
        <p className="text-xs text-blue-700">Faculty-uploaded resources are marked with a verified badge and appear pinned.</p>
      </div>

      {/* Pinned Resources */}
      {pinned.length > 0 && (
        <div className="px-4 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <Pin size={13} className="text-[#FF6B2B]" />
            <p className="text-sm font-semibold text-gray-800">Pinned by Faculty</p>
          </div>
          <div className="space-y-2">
            {pinned.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </div>
      )}

      {/* All Resources */}
      <div className="px-4 mt-5">
        <p className="text-sm font-semibold text-gray-800 mb-3">All Resources</p>
        <div className="space-y-2">
          {rest.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="absolute inset-0 bg-black/50 z-40 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Upload Resource</h3>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 text-sm">Cancel</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Resource Title</label>
                <input placeholder="e.g., Operating Systems - Chapter 5 Notes" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6B2B]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Subject Code</label>
                  <select className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#FF6B2B]">
                    {subjects.filter(s => s !== "All").map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Type</label>
                  <select className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#FF6B2B]">
                    <option>PDF</option>
                    <option>Slides</option>
                    <option>Video Link</option>
                    <option>External Link</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">External URL (optional)</label>
                <input placeholder="https://..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6B2B]" />
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center">
                <Upload size={20} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Drop file here or browse</p>
                <p className="text-xs text-gray-300 mt-0.5">PDF, PPTX, DOCX up to 20MB</p>
              </div>
              <button onClick={() => setShowUpload(false)} className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-medium">
                Upload Resource
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function ResourceCard({ resource }: { resource: any }) {
  const cfg = typeConfig[resource.type];
  const Icon = cfg.icon;

  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.bg }}>
        <Icon size={18} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-1">
          <p className="text-xs font-semibold text-gray-800 leading-tight flex-1 truncate">{resource.title}</p>
          {resource.faculty && <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full flex-shrink-0">Faculty</span>}
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5">{resource.uploadedBy}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-gray-300">{resource.subject}</span>
          <span className="text-gray-200">•</span>
          <span className="text-[10px] text-gray-300">{resource.date}</span>
          {resource.size && (
            <>
              <span className="text-gray-200">•</span>
              <span className="text-[10px] text-gray-300">{resource.size}</span>
            </>
          )}
        </div>
      </div>
      {resource.link ? (
        <a href={resource.link} target="_blank" rel="noopener noreferrer">
          <ExternalLink size={16} className="text-gray-400" />
        </a>
      ) : (
        <button>
          <Download size={16} className="text-gray-400" />
        </button>
      )}
    </div>
  );
}
