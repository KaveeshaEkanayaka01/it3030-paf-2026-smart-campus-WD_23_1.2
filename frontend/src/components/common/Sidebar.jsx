import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { isAdmin } from "../../utils/roleUtils";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();

  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : "sidebar--closed"}`}>
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark">SC</div>
        <div>
          <h2>Smart Campus</h2>
          <p>Manage everything smoothly</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        <NavLink to="/" className="sidebar__link">
          Dashboard
        </NavLink>

        <NavLink to="/resources" className="sidebar__link">
          Resources
        </NavLink>

        {isAdmin(user) && (
          <NavLink to="/admin/resources" className="sidebar__link">
            Admin Resources
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;