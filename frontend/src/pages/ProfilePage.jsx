import { Link } from "react-router-dom";
import TopBar from "../components/common/TopBar";
import BottomNav from "../components/common/BottomNav";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, logout } = useAuth();

  const initials = (user?.fullName || "Student")
    .split(" ")
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const profileLine = [user?.department, user?.batchYear ? `Batch ${user.batchYear}` : ""]
    .filter(Boolean)
    .join(" • ");

  const bioText =
    user?.bio ||
    "Final year CS student at SZABIST Islamabad. Passionate about mobile development, AI systems, and building products that matter.";

  return (
    <main className="mobile-shell">
      <TopBar title="Campus Connect" />

      <section className="feed">
        <section className="profile-wrap">
          <div className="profile-title-row">
            <h2>My Profile</h2>
            <button className="profile-edit" type="button" aria-label="Edit profile">
              ✎
            </button>
          </div>

          <section className="card profile-card-top">
            <div className="profile-head">
              <div className="profile-avatar-box">
                <div className="profile-avatar">{initials}</div>
                <span className="profile-online-dot" aria-hidden="true" />
              </div>
              <div className="profile-user-meta">
                <h3>{user?.fullName || "Student"}</h3>
                <p>{profileLine || "Computer Science"}</p>
                <p>{user?.email}</p>
                <p className="profile-verified">Verified Student</p>
              </div>
            </div>

            <div className="profile-grid profile-grid-four">
              <article>
                <strong>12</strong>
                <span>Events</span>
              </article>
              <article>
                <strong>48</strong>
                <span>Resources</span>
              </article>
              <article>
                <strong>95</strong>
                <span>Connections</span>
              </article>
              <article>
                <strong>4.8</strong>
                <span>Reviews</span>
              </article>
            </div>
          </section>

          <section className="profile-tabs" aria-label="Profile sections">
            <button type="button" className="profile-tab profile-tab-active">About</button>
            <button type="button" className="profile-tab">Events</button>
            <button type="button" className="profile-tab">Marketplace</button>
            <button type="button" className="profile-tab">Reviews</button>
          </section>

          <section className="card profile-section-card">
            <h4>Achievements</h4>
            <div className="profile-badges">
              <span className="profile-badge profile-badge-orange">Early Adopter</span>
              <span className="profile-badge profile-badge-purple">Event Creator</span>
              <span className="profile-badge profile-badge-green">Verified Student</span>
              <span className="profile-badge profile-badge-gold">Top Contributor</span>
            </div>
          </section>

          <section className="card profile-section-card">
            <h4>About Me</h4>
            <p className="profile-about-text">{bioText}</p>
          </section>

          <section className="card profile-menu-card">
            <button className="profile-menu-item" type="button">
              <span className="profile-menu-icon profile-menu-icon-orange">🔔</span>
              <span>
                <strong>Notifications</strong>
                <small>Manage alerts</small>
              </span>
              <span className="setting-arrow">›</span>
            </button>

            <button className="profile-menu-item" type="button">
              <span className="profile-menu-icon profile-menu-icon-green">🛡</span>
              <span>
                <strong>Privacy &amp; Safety</strong>
                <small>Control your data</small>
              </span>
              <span className="setting-arrow">›</span>
            </button>

            <button className="profile-menu-item" type="button">
              <span className="profile-menu-icon profile-menu-icon-purple">⌘</span>
              <span>
                <strong>My QR Code</strong>
                <small>Event check-in code</small>
              </span>
              <span className="setting-arrow">›</span>
            </button>

            <button className="profile-menu-item" type="button">
              <span className="profile-menu-icon profile-menu-icon-blue">?</span>
              <span>
                <strong>Help &amp; Support</strong>
                <small>FAQs and contact</small>
              </span>
              <span className="setting-arrow">›</span>
            </button>

            <button className="profile-menu-item" type="button">
              <span className="profile-menu-icon profile-menu-icon-gray">⚙</span>
              <span>
                <strong>Settings</strong>
                <small>App preferences</small>
              </span>
              <span className="setting-arrow">›</span>
            </button>
          </section>

          {user?.role === "admin" ? (
            <Link className="action-link" to="/admin/reports">
              Open Admin Dashboard
            </Link>
          ) : null}

          <button className="profile-signout" type="button" onClick={logout}>
            <span aria-hidden="true">↪</span>
            <span>Sign Out</span>
          </button>
        </section>
      </section>

      <BottomNav />
    </main>
  );
};

export default ProfilePage;
