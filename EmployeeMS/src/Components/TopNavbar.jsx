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
    <header
      className="
      sticky top-0 z-40
      h-[74px]
      bg-white/90
      backdrop-blur-xl
      border-b border-slate-200
      flex items-center justify-between
      px-8
      shadow-sm
    "
    >
      {/* LEFT */}
      <div className="flex flex-col justify-center">
        <p
          className="
          text-[11px]
          font-semibold
          tracking-[0.12em]
          uppercase
          text-slate-500
          leading-none
          mb-1
        "
        >
          {panel}
        </p>

        <h2
          className="
          text-[24px]
font-extrabold tracking-[-0.4px]
          text-slate-900
          leading-none
        "
        >
          {title}
        </h2>
      </div>

      {/* RIGHT */}
      <div className="relative flex items-center gap-3" ref={dropdownRef}>
        {/* Notification */}
        <button
          className="
          w-[44px] h-[44px]
          rounded-2xl
          border border-slate-100
          bg-white
          flex items-center justify-center
          hover:bg-slate-50
          hover:shadow-md
          hover:-translate-y-[1px]
          transition-all duration-200
        "
        >
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11
              a6.002 6.002 0 00-4-5.659V5
              a2 2 0 10-4 0v.341C7.67 6.165
              6 8.388 6 11v3.159c0 .538-.214 1.055-.595
              1.436L4 17h5m6 0v1a3 3 0
              11-6 0v-1m6 0H9"
              />
            </svg>

            <span
              className="
              absolute -top-1 -right-1
              w-2 h-2
              rounded-full
              bg-red-500
              border border-white
            "
            />
          </div>
        </button>

        {/* USER CARD */}
        <div
          onClick={() => setOpen(!open)}
          className="
          flex items-center gap-3
          bg-white
          border border-slate-200
          rounded-[20px]
          px-3 py-2
          cursor-pointer
          hover:shadow-md
          transition-all
        "
        >
          {/* Avatar */}
          <div
            className="
            w-10 h-10
            rounded-full
            bg-gradient-to-br
            from-blue-500 to-blue-700
            text-white
            flex items-center justify-center
            font-bold text-sm
            overflow-hidden
            shrink-0
          "
          >
            {isProfilePage ? (
              <span>{user?.name?.charAt(0)}</span>
            ) : user?.image ? (
              <img
                src={`http://localhost:5000/${user.image}`}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.charAt(0)
            )}
          </div>

          {/* User Info */}
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-[13px] font-semibold text-slate-800">
              {user?.name}
            </span>

            <span className="text-[11px] text-slate-400 uppercase tracking-wide">
              {user?.role}
            </span>
          </div>

          {/* Arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 text-slate-400 transition ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div
            className="
            absolute right-0 top-16
            w-56
            bg-white
            border border-slate-200
            rounded-2xl
            shadow-[0_20px_50px_rgba(15,23,42,0.12)]
            p-2
            animate-in fade-in zoom-in
          "
          >
            <button
              onClick={() => navigate("/profile")}
              className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-sm font-medium
              text-slate-700
              hover:bg-slate-50
              hover:translate-x-1
              transition-all duration-200
            "
            >
              <FiUser className="text-[17px]" />
              Profile
            </button>

            <button
              className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-sm font-medium
              text-slate-700
              hover:bg-slate-50
              transition
            "
            >
              <FiSettings className="text-[17px]" />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-sm font-medium
              text-red-500
              hover:bg-red-50
              transition
            "
            >
              <FiLogOut className="text-[17px]" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNavbar;
