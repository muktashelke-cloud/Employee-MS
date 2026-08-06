import { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import "./TopNavbar.css";

import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";

import { useLocation, useNavigate } from "react-router-dom";
import { Search, BriefcaseBusiness } from "lucide-react";

const TopNavbar = () => {
  const [user, setUser] = useState(null);

  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter((item) => item.is_read === 0).length;

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
    title = "My Leave";
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
  } else if (
    location.pathname.includes("/timesheet") ||
    location.pathname.includes("/timesheets")
  ) {
    title = "Timesheet";
  } else if (location.pathname.includes("/tasks")) {
    title = "My Tasks";
  } else if (location.pathname.includes("/notifications")) {
    title = "Notifications";
  } else if (location.pathname.includes("/payslip")) {
    title = "Payslip";
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
        console.log(res.data);
        setUser(res.data.user || res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    api
      .get(`/api/notifications/${user.id}`)

      .then((res) => {
        setNotifications(res.data);
      })

      .catch((err) => console.log(err));
  }, [user]);
  /* CLOSE DROPDOWN */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* LOGOUT */

  const handleLogout = () => {
    localStorage.clear();

    navigate("/login");
  };

  const handleSettings = () => {
    setOpen(false);

    if (user?.role === "admin" || user?.role === "superadmin") {
      navigate("/admin/settings");
    } else if (user?.role === "hr") {
      navigate("/hr/settings");
    } else {
      navigate("/employee/settings");
    }
  };
  const markAllRead = async () => {
    try {
      await api.put(`/api/notifications/read/${user.id}`);

      setNotifications(
        notifications.map((item) => ({
          ...item,

          is_read: 1,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleProfile = () => {
    console.log("CURRENT USER", user);

    console.log(user);

    setOpen(false);

    if (user?.role === "admin" || user?.role === "superadmin") {
      navigate("/admin/profile");
    } else if (user?.role === "hr") {
      navigate("/hr/profile");
    } else {
      navigate("/employee/profile");
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
      shadow-[0_8px_30px_rgba(15,23,42,0.06)]
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
          text-indigo-600
          leading-none
          mb-1
        "
        >
          {panel}
        </p>

        <h2
          className="
text-[28px]
font-black
tracking-[-0.6px]
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
          onClick={() => {
            setNotificationOpen(!notificationOpen);

            setOpen(false);
          }}
          className="
  relative
  w-[50px] h-[50px]
  rounded-[18px]
  bg-gradient-to-br from-white to-slate-50
  shadow-[0_8px_24px_rgba(15,23,42,0.08)]
  border border-slate-100
  flex items-center justify-center
  hover:-translate-y-[1px]
  transition-all duration-200
"
        >
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
      6 8.388 6 11v3.159c0 .538-.214
      1.055-.595 1.436L4 17h5m6
      0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>

          {unreadCount > 0 && (
            <span
              className="
      absolute
      top-2
      right-2
      min-w-[18px]
      h-[18px]
      px-1
      rounded-full
      bg-red-500
      text-white
      text-[10px]
      font-bold
      flex items-center justify-center
    "
            >
              {unreadCount}
            </span>
          )}
        </button>
        {notificationOpen && (
          <div
            className="
    absolute
    right-0
    top-16
    w-80
    bg-white
    border
    border-slate-200
    rounded-3xl
    shadow-[0_20px_50px_rgba(15,23,42,0.12)]
    p-4
    z-50
  "
          >
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Notifications</h3>

              <button
                onClick={markAllRead}
                className="

text-xs

text-indigo-600

hover:text-indigo-700

"
              >
                Mark all read
              </button>
            </div>

            {notifications.map((item) => (
              <div
                key={item.id}
                className={`
        p-3
        rounded-xl
        mb-2

        ${item.is_read === 0 ? "bg-indigo-50" : "bg-slate-50"}
      `}
              >
                {item.message}
              </div>
            ))}
          </div>
        )}
        {/* USER CARD */}
        <div
          onClick={() => setOpen(!open)}
          className="
          flex items-center gap-3
          bg-gradient-to-br from-white to-slate-50
          border border-slate-200
          rounded-[18px]
          px-3 py-1.5
          shadow-[0_10px_30px_rgba(15,23,42,0.06)]
          cursor-pointer
          hover:shadow-md
          transition-all
        "
        >
          {/* Avatar */}
          <div
            className="
w-12 h-12
rounded-full
bg-gradient-to-br
from-blue-500 to-blue-700
text-white
flex items-center justify-center
font-bold text-sm
overflow-hidden
shrink-0
ring-2 ring-white
shadow-[0_6px_14px_rgba(59,130,246,0.15)]
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
            rounded-3xl
            shadow-[0_20px_50px_rgba(15,23,42,0.12)]
            p-2
            animate-in fade-in zoom-in
            backdrop-blur-xl
          "
          >
            <button
              onClick={handleProfile}
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
              onClick={handleSettings}
              className="
  w-full
  flex items-center gap-3
  px-4 py-3
  rounded-xl
  text-sm font-medium
  text-slate-700
  hover:bg-slate-50
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
