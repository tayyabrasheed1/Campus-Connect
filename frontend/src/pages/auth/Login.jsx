import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AlertMessage from "../../components/common/AlertMessage";

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithDemoAccount } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setMessage({ type: "error", text: "Please fill all fields" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await login(form);
      setMessage({ type: "success", text: "Login successful" });
      navigate("/explore");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Unable to login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDemoAccount = async () => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await loginWithDemoAccount();
      navigate("/explore");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Unable to load demo account",
      });
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
        <h1>Welcome Back</h1>
        <p>Login to continue to Campus Connect</p>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="field-group">
            <label htmlFor="email">University Email</label>
            <div className="input-shell">
              <span className="input-icon">✉</span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="yourname@szabist-isb.edu.pk"
                value={form.email}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <div className="input-shell">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={onChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <AlertMessage type={message.type} message={message.text} />

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? "Signing in..." : <span>Login <span className="btn-arrow">›</span></span>}
          </button>
        </form>

        <p className="auth-foot">
          New here? <Link to="/register">Create account</Link>
        </p>
        <button type="button" className="secondary-btn auth-demo-btn" onClick={onDemoAccount} disabled={isLoading}>
          Continue with demo data
        </button>
        <p className="auth-foot">
          Forgot password? <Link to="/forgot-password">Reset with OTP</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
