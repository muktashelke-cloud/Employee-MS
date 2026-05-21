import "./AdminLayout.css";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import TopNavbar from "../Components/TopNavbar";
const AdminLayout = () => {
  return (
    <div className="admin-container">
      <Sidebar />

      <div className="admin-main">
        <TopNavbar />
        {/* Page Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
