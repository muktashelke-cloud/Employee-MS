import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import TopNavbar from "../Components/TopNavbar";
import "./EmployeeLayout.css";

const EmployeeLayout = () => {
  return (
    <div className="admin-container">
      <Sidebar />

      <div className="admin-main">
        <TopNavbar />

        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout;