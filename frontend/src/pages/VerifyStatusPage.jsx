import { useMemo, useState } from "react";
import TopBar from "../components/common/TopBar";
import BottomNav from "../components/common/BottomNav";
import AlertMessage from "../components/common/AlertMessage";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";

const VerifyStatusPage = () => {
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    department: user?.department || "",
    batchYear: user?.batchYear || "",
    documentName: user?.verificationDocumentName || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const verificationStatus = user?.verificationStatus || "unverified";

  const statusLabel = useMemo(
    () =>
      ({
        unverified: "Unverified",
        pending: "Pending Review",
        verified: "Verified",
        rejected: "Rejected",
      }[verificationStatus] || "Unverified"),
    [verificationStatus]
  );

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await authApi.submitVerification(form);
      await refreshProfile();
      setMessage({ type: "success", text: "Verification request submitted successfully" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to submit verification request" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mobile-shell">
      <TopBar title="Verification" />

      <section className="feed">
        <section className="card">
          <h3>Profile verification</h3>
          <p className="muted">Submit your details so the campus team can review your account.</p>

          <div className="profile-grid" style={{ marginBottom: 20 }}>
            <article>
              <strong>{statusLabel}</strong>
              <span>Status</span>
            </article>
            <article>
              <strong>{user?.verificationDocumentName || "None"}</strong>
              <span>Document</span>
            </article>
            <article>
              <strong>{user?.verificationRequestedAt ? new Date(user.verificationRequestedAt).toLocaleDateString() : "--"}</strong>
              <span>Requested</span>
            </article>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            <div className="field-group">
              <label htmlFor="department">Department</label>
              <div className="input-shell">
                <input id="department" name="department" value={form.department} onChange={onChange} placeholder="Department" />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="batchYear">Batch Year</label>
              <div className="input-shell">
                <input id="batchYear" name="batchYear" value={form.batchYear} onChange={onChange} placeholder="Batch year" />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="documentName">Document Name</label>
              <div className="input-shell">
                <input
                  id="documentName"
                  name="documentName"
                  value={form.documentName}
                  onChange={onChange}
                  placeholder="Student card, employee ID, transcript..."
                />
              </div>
            </div>

            <button className="primary-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : <span>Submit verification <span className="btn-arrow">›</span></span>}
            </button>
          </form>

          <AlertMessage type={message.type} message={message.text} />
        </section>
      </section>

      <BottomNav />
    </main>
  );
};

export default VerifyStatusPage;