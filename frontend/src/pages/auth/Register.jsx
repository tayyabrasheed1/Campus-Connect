import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AlertMessage from "../../components/common/AlertMessage";

const Register = () => {
  const navigate = useNavigate();
  const { register, loginWithDemoAccount } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    recoveryQuestion: "",
    recoveryAnswer: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Student");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fullName = useMemo(() => `${form.firstName} ${form.lastName}`.trim(), [form.firstName, form.lastName]);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setMessage({ type: "error", text: "Please fill all required fields" });
      return;
    }

    if (!form.email.includes("@")) {
      setMessage({ type: "error", text: "Enter a valid email" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await register({
        name: fullName,
        fullName,
        email: form.email,
        password: form.password,
        department: selectedRole === "Faculty" ? "Faculty" : "Computer Science",
        batchYear: selectedRole === "Alumni" ? "Alumni" : "2022",
        recoveryQuestion: form.recoveryQuestion,
        recoveryAnswer: form.recoveryAnswer,
      });
      setMessage({ type: "success", text: "Account created" });
      navigate("/verify-profile");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Unable to register",
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
            <span />
            <span />
          </div>
        </section>

        <span className="auth-back auth-back-spacer" aria-hidden="true">
          ←
        </span>
      </div>

      <section className="auth-panel">
        <h1>Create Account</h1>
        <p>Join the SZABIST community</p>

        <div className="auth-role-label">I am a...</div>
        <div className="role-chip-row">
          {['Student', 'Faculty', 'Alumni'].map((role) => (
            <button
              key={role}
              type="button"
              className={`role-chip ${selectedRole === role ? 'role-chip-active' : ''}`}
              onClick={() => setSelectedRole(role)}
            >
              {role}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="field-row two-col">
            <div className="field-group">
              <label htmlFor="firstName">First Name</label>
              <div className="input-shell">
                <span className="input-icon">👤</span>
                <input id="firstName" name="firstName" placeholder="Muhammad" value={form.firstName} onChange={onChange} />
              </div>
            </div>
            <div className="field-group">
              <label htmlFor="lastName">Last Name</label>
              <div className="input-shell">
                <input id="lastName" name="lastName" placeholder="Tayyab" value={form.lastName} onChange={onChange} />
              </div>
            </div>
          </div>

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
            <label htmlFor="recoveryQuestion">Recovery Question</label>
            <div className="input-shell">
              <span className="input-icon">❓</span>
              <input
                id="recoveryQuestion"
                name="recoveryQuestion"
                placeholder="e.g. Your first school?"
                value={form.recoveryQuestion}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="recoveryAnswer">Recovery Answer</label>
            <div className="input-shell">
              <span className="input-icon">🛡️</span>
              <input
                id="recoveryAnswer"
                name="recoveryAnswer"
                placeholder="Recovery answer"
                value={form.recoveryAnswer}
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
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={form.password}
                onChange={onChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <AlertMessage type={message.type} message={message.text} />

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? 'Creating...' : <span>Next <span className="btn-arrow">›</span></span>}
          </button>
        </form>

        <p className="auth-foot">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
        <button type="button" className="secondary-btn auth-demo-btn" onClick={onDemoAccount} disabled={isLoading}>
          Use demo data
        </button>
      </section>
    </main>
  );
};

export default Register;
