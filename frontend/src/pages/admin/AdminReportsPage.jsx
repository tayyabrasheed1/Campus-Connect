import { useEffect, useState } from "react";
import TopBar from "../../components/common/TopBar";
import BottomNav from "../../components/common/BottomNav";
import Loader from "../../components/common/Loader";
import AlertMessage from "../../components/common/AlertMessage";
import { adminApi } from "../../services/api";

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [logs, setLogs] = useState([]);
  const [knowledgeEntries, setKnowledgeEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [knowledgeForm, setKnowledgeForm] = useState({
    question: "",
    answer: "",
    category: "",
    keywords: "",
    sourceType: "faq",
    policyCode: "",
    audience: "all",
  });
  const [editingKnowledgeId, setEditingKnowledgeId] = useState("");

  const loadDashboard = async () => {
    setMessage({ type: "", text: "" });

    try {
      const [{ data: reportsData }, { data: logsData }, { data: kbData }] = await Promise.all([
        adminApi.allReports(),
        adminApi.moderationLogs(),
        adminApi.knowledgeBase(),
      ]);
      setReports(reportsData.results || []);
      setLogs(logsData.results || []);
      setKnowledgeEntries(kbData.results || []);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to load reports" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      loadDashboard();
    }, 0);

    return () => clearTimeout(timerId);
  }, []);

  const resolveReport = async (id) => {
    const moderationNotes = window.prompt("Add moderation note for audit trail:", "") || "";
    try {
      await adminApi.resolveReport(id, { moderationNotes });
      setMessage({ type: "success", text: "Report resolved" });
      loadDashboard();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Resolve failed" });
    }
  };

  const suspendUser = async (id) => {
    const reason = window.prompt("Suspension reason (community standards violation):", "Violation of campus community standards");
    if (!reason) return;
    try {
      await adminApi.suspendUser(id, { reason, suspensionType: "permanent" });
      setMessage({ type: "success", text: "User suspended permanently" });
      loadDashboard();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Suspend failed" });
    }
  };

  const seedFaq = async () => {
    try {
      const { data } = await adminApi.seedFaqs();
      setMessage({ type: "success", text: data.message });
      loadDashboard();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Seed failed" });
    }
  };

  const onKnowledgeChange = (event) => {
    setKnowledgeForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const resetKnowledgeForm = () => {
    setKnowledgeForm({
      question: "",
      answer: "",
      category: "",
      keywords: "",
      sourceType: "faq",
      policyCode: "",
      audience: "all",
    });
    setEditingKnowledgeId("");
  };

  const submitKnowledge = async (event) => {
    event.preventDefault();
    if (!knowledgeForm.question || !knowledgeForm.answer || !knowledgeForm.category) {
      setMessage({ type: "error", text: "Question, answer, and category are required" });
      return;
    }

    const payload = {
      question: knowledgeForm.question,
      answer: knowledgeForm.answer,
      category: knowledgeForm.category,
      sourceType: knowledgeForm.sourceType,
      policyCode: knowledgeForm.policyCode,
      keywords: knowledgeForm.keywords
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      audience: [knowledgeForm.audience],
    };

    try {
      if (editingKnowledgeId) {
        await adminApi.updateKnowledge(editingKnowledgeId, payload);
        setMessage({ type: "success", text: "Knowledge entry updated" });
      } else {
        await adminApi.createKnowledge(payload);
        setMessage({ type: "success", text: "Knowledge entry created" });
      }
      resetKnowledgeForm();
      loadDashboard();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Knowledge save failed" });
    }
  };

  const startEditKnowledge = (entry) => {
    setEditingKnowledgeId(entry._id);
    setKnowledgeForm({
      question: entry.question || "",
      answer: entry.answer || "",
      category: entry.category || "",
      keywords: (entry.keywords || []).join(", "),
      sourceType: entry.sourceType || "faq",
      policyCode: entry.policyCode || "",
      audience: entry.audience?.[0] || "all",
    });
  };

  const deleteKnowledge = async (id) => {
    const ok = window.confirm("Delete this knowledge entry?");
    if (!ok) return;
    try {
      await adminApi.deleteKnowledge(id);
      setMessage({ type: "success", text: "Knowledge entry deleted" });
      if (editingKnowledgeId === id) {
        resetKnowledgeForm();
      }
      loadDashboard();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Delete failed" });
    }
  };

  return (
    <main className="mobile-shell">
      <TopBar title="Campus Connect" />

      <section className="feed">
        <section className="card admin-hero">
          <h3>Admin Dashboard</h3>
          <p className="muted">Manage reports, resolve issues, and moderate users.</p>
        </section>

        <section className="card">
          <div className="event-row">
            <h3>Safety Reports</h3>
            <button type="button" className="secondary-btn" onClick={seedFaq}>
              Seed FAQs
            </button>
          </div>

          <AlertMessage type={message.type} message={message.text} />
          {isLoading ? <Loader label="Loading admin reports..." /> : null}

          {!isLoading && reports.length === 0 ? <p className="muted">No reports available</p> : null}

          {reports.map((report) => (
            <article key={report._id} className="event-item">
              <h4>{report.title}</h4>
              <p>{report.description}</p>
              <p>By: {report.submittedBy?.fullName || "Unknown"}</p>
              <p>Status: {report.status}</p>
              <p>Severity: {report.severity || "n/a"}</p>
              {report.violationType ? <p>Violation: {report.violationType}</p> : null}
              {report.evidenceLinks?.length ? <p>Evidence: {report.evidenceLinks.length} link(s)</p> : null}

              <div className="row-actions">
                <button type="button" onClick={() => resolveReport(report._id)} disabled={report.status === "resolved"}>
                  Resolve
                </button>
                {report.submittedBy?._id ? (
                  <button className="ghost-btn" type="button" onClick={() => suspendUser(report.submittedBy._id)}>
                    Suspend User
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </section>

        <section className="card">
          <h3>Knowledge Base Manager</h3>
          <p className="muted">Create and maintain FAQ, policy, and handbook entries.</p>

          <form className="auth-form" onSubmit={submitKnowledge}>
            <div className="field-group">
              <label htmlFor="question">Question</label>
              <div className="input-shell">
                <input id="question" name="question" value={knowledgeForm.question} onChange={onKnowledgeChange} />
              </div>
            </div>
            <div className="field-group">
              <label htmlFor="answer">Answer</label>
              <div className="input-shell input-shell-textarea">
                <textarea id="answer" name="answer" rows="3" value={knowledgeForm.answer} onChange={onKnowledgeChange} />
              </div>
            </div>
            <div className="field-group">
              <label htmlFor="category">Category</label>
              <div className="input-shell">
                <input id="category" name="category" value={knowledgeForm.category} onChange={onKnowledgeChange} />
              </div>
            </div>
            <div className="field-group">
              <label htmlFor="keywords">Keywords (comma separated)</label>
              <div className="input-shell">
                <input id="keywords" name="keywords" value={knowledgeForm.keywords} onChange={onKnowledgeChange} />
              </div>
            </div>
            <div className="field-group">
              <label htmlFor="sourceType">Source Type</label>
              <div className="input-shell">
                <select id="sourceType" name="sourceType" value={knowledgeForm.sourceType} onChange={onKnowledgeChange}>
                  <option value="faq">FAQ</option>
                  <option value="policy">Policy</option>
                  <option value="handbook">Handbook</option>
                </select>
              </div>
            </div>
            <div className="field-group">
              <label htmlFor="policyCode">Policy Code</label>
              <div className="input-shell">
                <input id="policyCode" name="policyCode" value={knowledgeForm.policyCode} onChange={onKnowledgeChange} />
              </div>
            </div>
            <div className="field-group">
              <label htmlFor="audience">Audience</label>
              <div className="input-shell">
                <select id="audience" name="audience" value={knowledgeForm.audience} onChange={onKnowledgeChange}>
                  <option value="all">All</option>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
            </div>

            <div className="row-actions">
              <button type="submit">{editingKnowledgeId ? "Update Entry" : "Create Entry"}</button>
              {editingKnowledgeId ? (
                <button type="button" className="ghost-btn" onClick={resetKnowledgeForm}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>

          {!isLoading && knowledgeEntries.length === 0 ? <p className="muted">No knowledge entries yet</p> : null}
          {knowledgeEntries.map((entry) => (
            <article key={entry._id} className="event-item">
              <h4>{entry.question}</h4>
              <p>{entry.answer}</p>
              <p>
                {entry.category} · {entry.sourceType}
              </p>
              {entry.policyCode ? <p>Policy: {entry.policyCode}</p> : null}
              <p>Audience: {(entry.audience || []).join(", ")}</p>
              <div className="row-actions">
                <button type="button" onClick={() => startEditKnowledge(entry)}>
                  Edit
                </button>
                <button type="button" className="ghost-btn" onClick={() => deleteKnowledge(entry._id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="card">
          <h3>Moderation Logs</h3>
          {!isLoading && logs.length === 0 ? <p className="muted">No moderation logs yet</p> : null}
          {logs.map((log) => (
            <article key={log._id} className="event-item">
              <h4>{log.action.replaceAll("_", " ")}</h4>
              <p>{log.details}</p>
              <p className="muted">{new Date(log.createdAt).toLocaleString()}</p>
            </article>
          ))}
        </section>
      </section>

      <BottomNav />
    </main>
  );
};

export default AdminReportsPage;
