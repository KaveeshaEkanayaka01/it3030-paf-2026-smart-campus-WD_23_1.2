import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <button className="navbar__menu" onClick={toggleSidebar}>
        ☰
      </button>

      <div className="navbar__right">
        <div className={`navbar__user ${isAdmin ? "admin" : ""}`}>
          <span className="navbar__name">
            {user?.fullName || "User"}
            {isAdmin && <span className="admin-icon"> 👑</span>}
          </span>

          <span className={`navbar__role ${isAdmin ? "admin-role" : ""}`}>
            {isAdmin ? "ADMIN PANEL" : user?.role || "USER"}
          </span>
        </div>

        <button className="navbar__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;