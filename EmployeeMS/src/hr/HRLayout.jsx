import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import TopNavbar from "../Components/TopNavbar";

const HRLayout = () => {
  return (
   <div className="flex min-h-screen bg-gray-100">
    <Sidebar />

    <div className="ml-[148px] flex flex-1 flex-col">

        <TopNavbar />

        <main className="flex-1 p-6">
            <Outlet />
        </main>

    </div>
</div>
  );
};

export default HRLayout;