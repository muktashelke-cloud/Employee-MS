
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";

const EmployeeLayout = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout;