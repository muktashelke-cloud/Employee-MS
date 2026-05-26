import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import api from "../utils/api";
import "./AdminAttendanceCalendar.css";

const AdminAttendanceCalendar = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/auth/all-employees");
      if (res.data.status) {
        setEmployees(res.data.result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch attendance
  const fetchAttendance = async (employeeId = "") => {
    try {
      const url = employeeId
        ? `/attendance/admin-attendance?employee_id=${employeeId}`
        : "/attendance/admin-attendance";

      const res = await api.get(url);

      if (res.data.status) {
        setAttendanceData(res.data.result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getColor = (status) => {
    switch (status) {
      case "present":
        return "green";
      case "absent":
        return "red";
      case "leave":
        return "orange";
      case "late":
        return "purple";
      case "halfday":
        return "blue";
      default:
        return "black";
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };
const tileContent = ({ date }) => {
  const formatted = formatDate(date);
  const today = formatDate(new Date());

  if (formatted > today) return null;

  const records = attendanceData.filter(
    (item) => formatDate(item.date) === formatted,
  );

  if (records.length === 0) {
    return null;
  }

  const r = records[0];

  return (
    <div className="tooltip-wrapper">
      <div className={`admin-status admin-${r.status}`}>
        {r.status === "present"
          ? "P"
          : r.status === "absent"
            ? "A"
            : r.status === "leave"
              ? "L"
              : r.status === "late"
                ? "Lt"
                : "H"}
      </div>

      <span className="custom-tooltip">
        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
      </span>
    </div>
  );
};
  const handleDayClick = (date) => {
    const formatted = formatDate(date);

    const records = attendanceData.filter(
      (item) => formatDate(item.date) === formatted,
    );

    setSelectedDate(formatted);
    setSelectedRecords(records);
  };

  return (
    <div className="calendar-page">
      <div className="calendar-card">
        <div className="calendar-header">
          <select
            className="employee-filter"
            value={selectedEmployee}
            onChange={(e) => {
              setSelectedEmployee(e.target.value);
              fetchAttendance(e.target.value);
            }}
          >
            <option value="">All Employees</option>

            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
        </div>
        {/* Calendar */}
        <div className="calendar-wrapper">
          <Calendar tileContent={tileContent} onClickDay={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceCalendar;
