import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const WelcomePage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/explore" replace />;
  }

  return (
    <main className="mobile-shell welcome-shell">
      <section className="welcome-card">
        <div className="welcome-dot" aria-hidden="true" />
        <h1 className="welcome-title">
          <span className="welcome-title-top">Welcome to</span>
          <span className="welcome-title-main">Campus Connect</span>
        </h1>
        <p className="welcome-intro">
          <span className="welcome-intro-dot" aria-hidden="true" />
          <span>Discover your fellow students, campus events, and create your own!</span>
        </p>

        <section className="welcome-gallery" aria-label="Campus highlights">
          <article
            className="welcome-image welcome-image-lg"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80')",
            }}
          />
          <article
            className="welcome-image welcome-image-md"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=800&q=80')",
            }}
          />
          <article
            className="welcome-image welcome-image-wide"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80')",
            }}
          />
        </section>

        <p className="welcome-caption">The place to meet SZABIST students through shared experiences</p>

        <div className="welcome-actions">
          <Link className="primary-btn welcome-btn" to="/register">
            Get Started
          </Link>
          <Link className="secondary-btn welcome-btn" to="/login">
            Already a Member? Log in
          </Link>
        </div>

        <p className="welcome-footnote">
          By continuing you agree to our{" "}
          <a href="#" aria-label="Terms of service">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" aria-label="Privacy policy">
            Privacy Policy
          </a>
          . University email required for access.
        </p>
      </section>
    </main>
  );
};

export default WelcomePage;
