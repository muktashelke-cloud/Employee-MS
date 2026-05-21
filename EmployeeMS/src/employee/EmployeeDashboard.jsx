import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 useEffect(() => {

  const role = localStorage.getItem("role");

  if (role !== "employee") {
    navigate("/login");
    return;
  }

  fetchEmployee();

}, []);
  const fetchEmployee = async () => {
    try {
      const res = await api.get("/auth/me");

      if (res.data.status) {
        setEmployee(res.data.user);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3 className="loading">Loading...</h3>;
  }

  return (
    <div className="employee-dashboard">
      <h2 className="dashboard-title">
        Welcome {employee?.name} 👋
      </h2>

      <div className="dashboard-cards">

        {/* Profile */}
        <div
          className="dashboard-card profile"
          onClick={() => navigate("/employee/profile")}
        >
          <h4>Email</h4>
          <p>{employee?.email}</p>
        </div>

        {/* Salary */}
        <div className="dashboard-card salary">
          <h4>Salary</h4>
          <p>₹ {employee?.salary}</p>
        </div>

        {/* Attendance */}
        <div
          className="dashboard-card attendance"
          onClick={() => navigate("/employee/attendance")}
        >
          <h4>Attendance</h4>
          <p>View Records</p>
        </div>

        {/* ✅ FIXED Apply Leave */}
        <div
          className="dashboard-card leave"
          onClick={() => navigate("/employee/leave")}
        >
          <h4>Apply Leave</h4>
          <p>Request Leave</p>
        </div>

        {/* Tasks */}
        <div
          className="dashboard-card tasks"
          onClick={() => navigate("/employee/tasks")}
        >
          <h4>My Tasks</h4>
          <p>View Allocations</p>
        </div>

      </div>
    </div>
  );
};

export default EmployeeDashboard;