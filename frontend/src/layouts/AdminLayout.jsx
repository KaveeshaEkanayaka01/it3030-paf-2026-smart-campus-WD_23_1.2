import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import "./MainLayout.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} />

      <div className="layout__main">
        <Navbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;