import React, { useState, useEffect } from "react";
import api from "../utils/api";
import "./AttendanceCalendar.css";
import CommonCalendar from "../Components/CommonCalendar/CommonCalendar";
import { FiCalendar } from "react-icons/fi";

const AttendanceCalendar = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance/employee-attendance");

      if (res.data.status) {
        setAttendanceData(res.data.result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const summary = {
    present: attendanceData.filter((item) => item.status === "present").length,
    absent: attendanceData.filter((item) => item.status === "absent").length,
    leave: attendanceData.filter((item) => item.status === "leave").length,
    late: attendanceData.filter((item) => item.status === "late").length,
  };

  const today = new Date().toISOString().split("T")[0];

  const todayRecord = attendanceData.find(
    (item) => item.date.split("T")[0] === today,
  );

  const handlePunchIn = async () => {
    try {
      const res = await api.post("/attendance/punch-in");

      if (res.data.status) {
        alert("Punch In Successful");
        fetchAttendance();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePunchOut = async () => {
    try {
      const res = await api.post("/attendance/punch-out");

      if (res.data.status) {
        alert("Punch Out Successful");
        fetchAttendance();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const calendarDays = Array.from({ length: 31 }, (_, i) => {
    const dayDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      i + 1,
    )
      .toISOString()
      .split("T")[0];

    const record = attendanceData.find(
      (item) => item.date.slice(0, 10) === dayDate,
    );

    return {
      date: i + 1,

      status:
        record?.status === "present"
          ? "P"
          : record?.status === "late"
            ? "L"
            : record?.status === "leave"
              ? "LV"
              : record?.status === "halfday"
                ? "H"
                : "A",
    };
  });

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <div className="attendance-right">
          <div className="attendance-actions">
            <button onClick={handlePunchIn} className="punch-in-btn">
              Punch In
            </button>

            <button onClick={handlePunchOut} className="punch-out-btn">
              Punch Out
            </button>
          </div>

          {/* ✅ Stats (FIXED CLASS NAMES) */}
          <div className="attendance-stats">
            <span className="att-present">P: {summary.present}</span>
            <span className="att-absent">A: {summary.absent}</span>
            <span className="att-leave">L: {summary.leave}</span>
            <span className="att-late">Lt: {summary.late}</span>
          </div>
        </div>
      </div>

      <div className="calendar-card">
        <div className="calendar-wrapper">
          <div className="calendar-month-year">
            <FiCalendar className="calendar-icon" />

            <span>
              {new Date().toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <CommonCalendar
            selectedEmployee={{
              name: "My Attendance",
              image: "/default-avatar.png",
              days: calendarDays.map((d) => d.status),
            }}
            month={new Date().getMonth() + 1}
            year={new Date().getFullYear()}
            showTitle={false}
            showEmployeeInfo={false}
          />

          {/* ✅ Legend (FIXED CLASS NAMES) */}
          <div className="legend">
            <span className="att-status att-present">P</span>
            <span className="att-status att-absent">A</span>
            <span className="att-status att-leave">L</span>
            <span className="att-status att-late">Lt</span>
            <span className="att-status att-half">H</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
