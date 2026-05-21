import { Outlet } from "react-router-dom";

import Sidebar from "../Components/Sidebar/Sidebar";
import TopNavbar from "../Components/TopNavbar";

import "./HRLayout.css";

const HRLayout = () => {
  return (
      <div className="admin-main">

        <TopNavbar />

      <div className="admin-container">

      <Sidebar />

        <div className="admin-content">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default HRLayout;