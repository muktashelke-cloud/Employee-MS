import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../utils/api";
import "./Sidebar.css";
import { Menu } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UserCog,
  UserRound,
  FileText,
  CalendarCheck,
  ClipboardList,
  Briefcase,
  LogOut,
} from "lucide-react";

import {
  FaUsers,
  FaTachometerAlt,
  FaUserShield,
  FaUserTie,
  FaFileAlt,
  FaCalendarCheck,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  /* Base path */
  const basePath =
    role === "superadmin" || role === "admin"
      ? "/admin"
      : role === "hr"
        ? "/hr"
        : "/employee";

  const activeStyle = ({ isActive }) => (isActive ? "menu active" : "menu");

  /* Fetch user */
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser?.role) {
        setRole(storedUser.role);
      }
    } catch (err) {
      console.log("Role fetch error:", err);
    }
  }, []);
  /* Logout */
  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
    } catch (err) {
      console.log("Logout failed");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className={collapsed ? "admin-sidebar collapsed" : "admin-sidebar"}>
      {/* HEADER */}
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
         <Menu size={18} />
        </button>

        {!collapsed && (
          <h3 className="sidebar-title">
            {role === "superadmin"
              ? "EMS"
              : role === "admin"
                ? "Admin Panel"
                : role === "hr"
                  ? "HR Panel"
                  : "Employee Panel"}
          </h3>
        )}
      </div>

      {/* LINKS */}
      <div className="sidebar-links">
        {/* Dashboard */}
        {(role === "admin" || role === "hr" || role === "superadmin") && (
          <NavLink to={`${basePath}/dashboard`} className={activeStyle}>
            <FaTachometerAlt />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
        )}

        {/* Profile */}
        <NavLink to={`${basePath}/profile`} className={activeStyle}>
          <FaUserTie />
          {!collapsed && <span>Profile</span>}
        </NavLink>

        {/* Leave */}
        <NavLink to={`${basePath}/leave`} className={activeStyle}>
          <FaFileAlt />
          {!collapsed && <span>Leave</span>}
        </NavLink>

        {/* Employee Attendance */}
        {role === "employee" && (
          <>
            <NavLink to={`${basePath}/attendance`} className={activeStyle}>
              <FaCalendarCheck />
              {!collapsed && <span>My Attendance</span>}
            </NavLink>

            <NavLink to={`${basePath}/tasks`} className={activeStyle}>
              <FaFileAlt />
              {!collapsed && <span>My Tasks</span>}
            </NavLink>

            {/* ✅ MY TIMESHEET */}
            <NavLink to={`${basePath}/timesheet`} className={activeStyle}>
              <FaFileAlt />
              {!collapsed && <span>Timesheet</span>}
            </NavLink>
          </>
        )}

        {/* HR Attendance (FIXED 🔥) */}
        {role === "hr" && (
          <>
            <NavLink to={`${basePath}/attendance`} className={activeStyle}>
              <FaCalendarCheck />
              {!collapsed && <span>Attendance</span>}
            </NavLink>

            <NavLink
              to={`${basePath}/attendance-calendar`}
              className={activeStyle}
            >
              <FaCalendarCheck />
              {!collapsed && <span>Attendance Calendar</span>}
            </NavLink>

            <NavLink
              to={`${basePath}/attendance-management`}
              className={activeStyle}
            >
              <FaCalendarCheck />
              {!collapsed && <span>Attendance Management</span>}
            </NavLink>
          </>
        )}
        {/* Employees */}
        {(role === "admin" || role === "hr" || role === "superadmin") && (
          <NavLink to={`${basePath}/employees`} className={activeStyle}>
            <FaUsers />
            {!collapsed && <span>Employees</span>}
          </NavLink>
        )}

        {/* Reports */}
        {(role === "admin" || role === "hr" || role === "superadmin") && (
          <NavLink to={`${basePath}/monthly-report`} className={activeStyle}>
            <FaFileAlt />
            {!collapsed && <span>Reports</span>}
          </NavLink>
        )}

        {/* Allocation */}
        {(role === "admin" || role === "superadmin") && (
          <NavLink to={`${basePath}/allocation`} className={activeStyle}>
            <FaUsers />
            {!collapsed && <span>Allocation</span>}
          </NavLink>
        )}
        {/* Timesheets (ADMIN + SUPERADMIN) */}
        {["admin", "superadmin", "hr"].includes(role) && (
          <NavLink to={`${basePath}/timesheets`} className={activeStyle}>
            <FaFileAlt />
            {!collapsed && <span>Timesheets</span>}
          </NavLink>
        )}

        {/* Super Admin */}
        {role === "superadmin" && (
          <>
            <NavLink to="/admin/manage-admin" className={activeStyle}>
              <FaUserShield />
              {!collapsed && <span>Admins</span>}
            </NavLink>

            <NavLink to="/admin/manage-hr" className={activeStyle}>
              <FaUsers />
              {!collapsed && <span>HR</span>}
            </NavLink>
          </>
        )}
      </div>

      {/* LOGOUT */}
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
