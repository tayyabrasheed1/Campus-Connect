import { NavLink } from "react-router-dom";

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/explore" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
        <span className="nav-icon">⌂</span>
        <span className="nav-label">Explore</span>
      </NavLink>
      <NavLink to="/events" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
        <span className="nav-icon">▦</span>
        <span className="nav-label">Events</span>
      </NavLink>
      <NavLink to="/report" className="nav-plus" aria-label="Create report">
        +
      </NavLink>
      <NavLink to="/chats" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
        <span className="nav-icon">▭</span>
        <span className="nav-label">Chats</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
        <span className="nav-icon">◉</span>
        <span className="nav-label">Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
