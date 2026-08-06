import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import TopNavbar from "../Components/TopNavbar";

const HRLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-gray-100">
      <TopNavbar />

      <div className="flex min-h-screen w-full bg-gray-100">
        <Sidebar />

        <div className="flex-1 p-6 pt-0 overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HRLayout;