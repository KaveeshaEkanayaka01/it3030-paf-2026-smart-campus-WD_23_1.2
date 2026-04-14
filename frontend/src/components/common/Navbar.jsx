import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div>
        <h1 className="navbar__title">Smart Campus</h1>
        <p className="navbar__subtitle">Campus Resource Management System</p>
      </div>

      <div className="navbar__right">
        <nav className="navbar__links">
          <Link to="/">Dashboard</Link>
          <Link to="/resources">Resources</Link>
        </nav>

        <div className="navbar__user">
          <span className="navbar__name">{user?.fullName || "User"}</span>
          <span className="navbar__role">{user?.role || "USER"}</span>
        </div>

        <button className="navbar__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;