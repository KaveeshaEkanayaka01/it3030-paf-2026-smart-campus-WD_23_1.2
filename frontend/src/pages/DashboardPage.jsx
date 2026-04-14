import useAuth from "../hooks/useAuth";
import "./DashboardPage.css";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <section className="dashboard__hero">
        <h1>Welcome back, {user?.fullName || "User"} 👋</h1>
        <p>
          Manage campus resources, track bookings, and stay updated from one
          place.
        </p>
      </section>

      <section className="dashboard__stats">
        <div className="stat-card">
          <span>Role</span>
          <strong>{user?.role || "N/A"}</strong>
        </div>

        <div className="stat-card">
          <span>Department</span>
          <strong>{user?.department || "Not Assigned"}</strong>
        </div>

        <div className="stat-card">
          <span>Email</span>
          <strong>{user?.email || "N/A"}</strong>
        </div>
      </section>

      <section className="dashboard__profile">
        <h2>Profile Overview</h2>

        <div className="profile-grid">
          <div className="profile-item">
            <span>Full Name</span>
            <p>{user?.fullName || "N/A"}</p>
          </div>

          <div className="profile-item">
            <span>Email Address</span>
            <p>{user?.email || "N/A"}</p>
          </div>

          <div className="profile-item">
            <span>Role</span>
            <p>{user?.role || "N/A"}</p>
          </div>

          <div className="profile-item">
            <span>Department</span>
            <p>{user?.department || "Not Assigned"}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;