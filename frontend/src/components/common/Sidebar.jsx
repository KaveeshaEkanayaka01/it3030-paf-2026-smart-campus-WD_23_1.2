import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { isAdmin } from "../../utils/roleUtils";
import "./Sidebar.css";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <h2>Smart Campus</h2>
        <p>Manage everything smoothly</p>
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