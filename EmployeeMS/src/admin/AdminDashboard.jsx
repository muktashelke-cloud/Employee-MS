import { useEffect, useState } from "react";
import api from "../utils/api";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import AdminAttendanceCalendar from "./AdminAttendanceCalendar";
import RoleSwitch from "../Components/RoleSwitch";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ✅ FIX 1: role state मध्ये ठेव (re-render साठी)
  const [role, setRole] = useState(
    localStorage.getItem("role") || "superadmin",
  );

  const [count, setCount] = useState({
    admin: 0,
    hr: 0,
    emp: 0,
  });

  const [attendance, setAttendance] = useState({
    present: 0,
    absent: 0,
    leave_count: 0,
    late: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const countRes = await api.get("/auth/dashboard-count");
      if (countRes.data) {
        setCount(countRes.data);
      }

      const attendanceRes = await api.get("/attendance/summary");
      if (attendanceRes.data.status) {
        setAttendance(attendanceRes.data.result);
      }
    } catch (err) {
      console.log("Dashboard Error:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Welcome 👋</h2>
  
      </div>

      {/* TOP CARDS */}
      <div className="dashboard-cards">
        <div className="dashboard-card admin">
          <h4>Total Admins</h4>
          <h2>{count.admin}</h2>
        </div>

        <div className="dashboard-card hr">
          <h4>Total HR</h4>
          <h2>{count.hr}</h2>
        </div>

        <div className="dashboard-card emp">
          <h4>Total Employees</h4>
          <h2>{count.emp}</h2>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="dashboard-bottom">
        <div className="left-section">
          {/* TOP ROW */}
          <div className="top-row">
            {/* Quick Actions */}
            <div className="quick-actions-card">
              <h5 className="section-title">Quick Actions</h5>

              <button
                className="action-btn primary"
                onClick={() => navigate("/admin/add-employee")}
              >
                Add Employee
              </button>

              <button
                className="action-btn success"
                onClick={() => navigate("/admin/add-hr")}
              >
                Add HR
              </button>

              <button
                className="action-btn warning"
                onClick={() => navigate("/admin/add-admin")}
              >
                Add Admin
              </button>
            </div>

            {/* ✅ FIX 2: RoleSwitch ALWAYS visible */}
            <div className="role-access-card" >
              <RoleSwitch role={role} setRole={setRole} />
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="attendance-wrapper">
          <div
            className="attendance-summary-card"
           
          >
            <h5 className="section-title">Today's Attendance</h5>

            <div className="attendance-grid">
              <div className="att present">
                🟢 Present <span>{attendance.present}</span>
              </div>

              <div className="att absent">
                🔴 Absent <span>{attendance.absent}</span>
              </div>

              <div className="att leave">
                🟡 Leave <span>{attendance.leave_count}</span>
              </div>

              <div className="att late">
                🕒 Late <span>{attendance.late}</span>
              </div>
            </div>
          </div>
        </div>
        </div>
        

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="calendar-section">
            <AdminAttendanceCalendar />

            <div className="legend">
              <span>🟢 Present</span>
              <span>🔴 Absent</span>
              <span>🟡 Leave</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
