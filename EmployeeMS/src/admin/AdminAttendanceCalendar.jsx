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

  const getShort = (status) => {
    switch (status) {
      case "present":
        return "P";
      case "absent":
        return "A";
      case "leave":
        return "L";
      case "late":
        return "Lt";
      case "halfday":
        return "H";
      default:
        return "";
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

  // Calendar content
  const tileContent = ({ date }) => {
    const formatted = formatDate(date);
    const today = formatDate(new Date());

    if (formatted > today) return null;

    const records = attendanceData.filter(
      (item) => formatDate(item.date) === formatted,
    );

    if (records.length === 0) {
      return <div className="admin-status admin-absent">A</div>;
    }
    const r = records[0];

    return (
      <div className={`admin-status admin-${r.status}`}>
        {getShort(r.status)}
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
          <h6 className="title">Employee Attendance Calendar</h6>

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
        <Calendar
          tileContent={tileContent}
          onClickDay={(value) => handleDayClick(value)}
        />
      </div>
      {selectedDate && (
        <div className="modal-overlay" onClick={() => setSelectedDate(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedDate} Attendance</h3>

            <p>
              Present:{" "}
              {selectedRecords.filter((r) => r.status === "present").length}
            </p>
            <p>
              Absent:{" "}
              {selectedRecords.filter((r) => r.status === "absent").length}
            </p>
            <p>
              Leave:{" "}
              {selectedRecords.filter((r) => r.status === "leave").length}
            </p>

            <hr />

            <div className="employee-list">
              {selectedRecords.map((r, i) => (
                <div key={i} className="employee-item">
                  {r.employee_name} - {r.status}
                </div>
              ))}
            </div>

            <button onClick={() => setSelectedDate(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAttendanceCalendar;
