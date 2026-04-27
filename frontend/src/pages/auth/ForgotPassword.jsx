import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AlertMessage from "../../components/common/AlertMessage";
import { authApi } from "../../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", recoveryAnswer: "", otp: "", newPassword: "" });
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const requestOtp = async () => {
    if (!form.email) {
      setMessage({ type: "error", text: "Email is required" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const { data } = await authApi.requestOtp({ email: form.email, recoveryAnswer: form.recoveryAnswer });
      setGeneratedOtp(data.otp || "");
      setChallengeToken(data.challengeToken || "");
      setMessage({ type: "success", text: "OTP generated. Use the shown OTP for simulation." });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to request OTP" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!form.email || !form.recoveryAnswer || !form.otp || !form.newPassword) {
      setMessage({ type: "error", text: "Fill all fields before reset" });
      return;
    }
    if (!challengeToken) {
      setMessage({ type: "error", text: "Request OTP first to start recovery challenge" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await authApi.verifyOtp({
        email: form.email,
        otp: form.otp,
        challengeToken,
        newPassword: form.newPassword,
      });
      setMessage({ type: "success", text: "Password reset successful. Please login." });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to reset password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-screen">
      <div className="auth-topbar">
        <button className="auth-back" type="button" onClick={() => navigate(-1)} aria-label="Go back">
          ←
        </button>

        <section className="auth-brand">
          <p className="auth-brand-title">Campus Connect</p>
          <p className="auth-brand-sub">SZABIST Islamabad</p>
          <div className="auth-dots" aria-hidden="true">
            <span className="active" />
            <span className="active" />
            <span />
          </div>
        </section>

        <span className="auth-back auth-back-spacer" aria-hidden="true">
          ←
        </span>
      </div>

      <section className="auth-panel">
        <h1>Reset Password</h1>
        <p>Simulated OTP recovery for your account</p>

        <div className="auth-form">
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <div className="input-shell">
              <span className="input-icon">✉</span>
              <input id="email" name="email" type="email" placeholder="Enter your email" value={form.email} onChange={onChange} />
            </div>
          </div>

          <button type="button" className="secondary-btn" onClick={requestOtp} disabled={isLoading}>
            {isLoading ? "Please wait..." : "Request OTP"}
          </button>

          {generatedOtp ? <p className="otp-box">Generated OTP: {generatedOtp}</p> : null}

          <div className="field-group">
            <label htmlFor="recoveryAnswer">Recovery Answer</label>
            <div className="input-shell">
              <span className="input-icon">🛡️</span>
              <input
                id="recoveryAnswer"
                name="recoveryAnswer"
                placeholder="Enter recovery answer"
                value={form.recoveryAnswer}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="otp">OTP</label>
            <div className="input-shell">
              <span className="input-icon">🔢</span>
              <input id="otp" name="otp" placeholder="Enter OTP" value={form.otp} onChange={onChange} />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-shell">
              <span className="input-icon">🔒</span>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="New password"
                value={form.newPassword}
                onChange={onChange}
              />
            </div>
          </div>

          <button type="button" className="primary-btn" onClick={resetPassword} disabled={isLoading}>
            {isLoading ? "Resetting..." : <span>Reset Password <span className="btn-arrow">›</span></span>}
          </button>
        </div>

        <AlertMessage type={message.type} message={message.text} />

        <p className="auth-foot">
          Return to <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;
