import { useEffect, useState } from "react";
import TopBar from "../components/common/TopBar";
import BottomNav from "../components/common/BottomNav";
import AlertMessage from "../components/common/AlertMessage";
import Loader from "../components/common/Loader";
import { reportApi } from "../services/api";

const ReportIssuePage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "safety",
    location: "",
    violationType: "misconduct",
    evidenceLinks: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [reports, setReports] = useState([]);

  const loadMyReports = async () => {
    try {
      const { data } = await reportApi.myReports();
      setReports(data.results || []);
    } catch {
      setReports([]);
    } finally {
      setIsListLoading(false);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      loadMyReports();
    }, 0);

    return () => clearTimeout(timerId);
  }, []);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.title || !form.description) {
      setMessage({ type: "error", text: "Title and description are required" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        ...form,
        evidenceLinks: form.evidenceLinks
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };
      await reportApi.submit(payload);
      setMessage({ type: "success", text: "Report submitted successfully" });
      setForm({
        title: "",
        description: "",
        category: "safety",
        location: "",
        violationType: "misconduct",
        evidenceLinks: "",
      });
      loadMyReports();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to submit report" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mobile-shell">
      <TopBar title="Campus Connect" />

      <section className="feed">
        <section className="card">
          <h3>Safety Reporting</h3>
          <p className="muted">Submit an issue and our team will review it.</p>
          <form className="auth-form" onSubmit={onSubmit}>
            <div className="field-group">
              <label htmlFor="title">Issue title</label>
              <div className="input-shell">
                <input id="title" name="title" placeholder="Issue title" value={form.title} onChange={onChange} />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="description">Description</label>
              <div className="input-shell input-shell-textarea">
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  placeholder="Describe what happened"
                  value={form.description}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="category">Category</label>
              <div className="input-shell">
                <input id="category" name="category" placeholder="Category" value={form.category} onChange={onChange} />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="location">Location</label>
              <div className="input-shell">
                <input id="location" name="location" placeholder="Location" value={form.location} onChange={onChange} />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="violationType">Violation Type</label>
              <div className="input-shell">
                <input
                  id="violationType"
                  name="violationType"
                  placeholder="misconduct / harassment / bullying"
                  value={form.violationType}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="evidenceLinks">Evidence Links (comma separated)</label>
              <div className="input-shell">
                <input
                  id="evidenceLinks"
                  name="evidenceLinks"
                  placeholder="https://... , https://..."
                  value={form.evidenceLinks}
                  onChange={onChange}
                />
              </div>
            </div>

            <button type="submit" className="primary-btn" disabled={isLoading}>
              {isLoading ? "Submitting..." : <span>Submit for Verification <span className="btn-arrow">›</span></span>}
            </button>
          </form>
          <AlertMessage type={message.type} message={message.text} />
        </section>

        <section className="card">
          <h3>My Reports</h3>
          {isListLoading ? <Loader label="Loading reports..." /> : null}
          {!isListLoading && reports.length === 0 ? <p className="muted">No reports yet</p> : null}
          {reports.map((report) => (
            <article key={report._id} className="event-item">
              <h4>{report.title}</h4>
              <p>{report.description}</p>
              <p className="chip">Status: {report.status}</p>
              <p className="chip">Severity: {report.severity || "n/a"}</p>
            </article>
          ))}
        </section>
      </section>

      <BottomNav />
    </main>
  );
};

export default ReportIssuePage;
