import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TopBar = ({ title = "Campus Connect", showUserSubtitle = false, onMenuClick, onBellClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
      return;
    }
    navigate("/profile");
  };

  const handleBellClick = () => {
    if (onBellClick) {
      onBellClick();
      return;
    }
    navigate("/chats");
  };

  return (
    <header className="topbar">
      <button className="icon-btn" type="button" aria-label="Menu" onClick={handleMenuClick}>
        <span className="menu-icon" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>
      <div>
        <p className="topbar-title">{title}</p>
        {showUserSubtitle && user?.fullName ? <p className="topbar-subtitle">{user.fullName}</p> : null}
      </div>
      <button className="icon-btn icon-btn-bell" type="button" aria-label="Notifications" onClick={handleBellClick}>
        <span className="bell-icon" aria-hidden="true">
          &#128276;
        </span>
        <span className="dot" />
      </button>
    </header>
  );
};

export default TopBar;
