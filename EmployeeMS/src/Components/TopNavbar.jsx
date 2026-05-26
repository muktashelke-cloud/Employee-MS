import { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import "./TopNavbar.css";

import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";

import { useLocation, useNavigate } from "react-router-dom";

const TopNavbar = () => {
  const [user, setUser] = useState(null);

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();

  const location = useLocation();

  const navigate = useNavigate();

  /* PAGE TITLE */

  let title = "Dashboard";

  if (location.pathname.includes("/allocation")) {
    title = "Allocation Management";
  } else if (location.pathname.includes("/employees")) {
    title = "Employee Management";
  } else if (location.pathname.includes("/monthly-report")) {
    title = "Monthly Attendance";
  } else if (location.pathname.includes("/leave")) {
    title = "Leave Management";
  } else if (location.pathname.includes("/attendance-management")) {
    title = "Attendance Management";
  } else if (location.pathname.includes("/attendance-calendar")) {
    title = "Employee Attendance Calendar";
  } else if (location.pathname.includes("/attendance")) {
    title = "My Attendance";
  } else if (location.pathname.includes("/profile")) {
    title = "My Profile";
  } else if (location.pathname.includes("/manage-admin")) {
    title = "Manage Admin";
  } else if (location.pathname.includes("/edit-admin")) {
    title = "Edit Admin";
  } else if (location.pathname.includes("/manage-hr")) {
    title = "Manage HR";
  } else if (location.pathname.includes("/timesheets")) {
    title = "Employee Timesheets";
  }

  /* PANEL NAME */

  /* PANEL NAME */

  let panel = "EMPLOYEE PANEL";

  if (user?.role === "superadmin") {
    panel = "SUPER ADMIN PANEL";
  } else if (user?.role === "admin") {
    panel = "ADMIN PANEL";
  } else if (user?.role === "hr") {
    panel = "HR PANEL";
  }
  /* PROFILE PAGE CHECK */

  const isProfilePage = location.pathname.includes("/profile");

  /* FETCH USE */

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user || res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  /* CLOSE DROPDOWN */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* LOGOUT */

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      localStorage.clear();

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="top-navbar">
      {/* LEFT */}

      <div className="page-title-section">
        <p className="page-subtitle">{panel}</p>

        <h2 className="page-title">{title}</h2>
      </div>

      {/* RIGHT */}

      <div className="nav-right" ref={dropdownRef}>
        <span className="user-name">{user?.name}</span>

        {/* AVATAR */}

        <div className="avatar" onClick={() => setOpen(!open)}>
          {isProfilePage ? (
            <div className="avatar initials-avatar">
              {user?.name?.charAt(0)}
            </div>
          ) : user?.image ? (
            <img src={`http://localhost:5000/${user.image}`} alt="profile" />
          ) : (
            user?.name?.charAt(0)
          )}
        </div>

        {/* DROPDOWN */}

        {open && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => navigate("profile")}>
              <FiUser />
              <span>Profile</span>
            </div>

            <div className="dropdown-item">
              <FiSettings />
              <span>Settings</span>
            </div>

            <div className="dropdown-item logout" onClick={handleLogout}>
              <FiLogOut />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavbar;
