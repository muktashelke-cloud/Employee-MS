import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./Components/Login";
import ProtectedRoute from "./Components/ProtectedRoute";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import ManageAdmin from "./admin/ManageAdmin";
import ManageHR from "./admin/ManageHR";
import MonthlyReport from "./admin/MonthlyReport";
import AttendanceManagement from "./admin/AttendanceManagement";

import HRLayout from "./hr/HRLayout";
import HRDashboard from "./hr/HRDashboard";
import HRLeave from "./hr/HRLeave";

import EmployeeLayout from "./employee/EmployeeLayout";
import EmployeeDashboard from "./employee/EmployeeDashboard";
import Leave from "./employee/Leave";
import AttendanceCalendar from "./employee/AttendanceCalendar";
import EmployeeNotifications from "./employee/EmployeeNotifications";

import Employee from "./Components/Employee";
import Profile from "./Components/Profile";
import ChangePassword from "./Components/ChangePassword";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserForm from "./Components/UserForm";
import AdminAttendanceCalendar from "./admin/AdminAttendanceCalendar";
import AddHR from "./pages/AddHR";
import AddAdmin from "./pages/AddAdmin";
import Allocation from "./admin/Allocation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeTasks from "./Components/EmployeeTasks";
import Timesheet from "./pages/Timesheet";
import AdminTimesheet from "./pages/AdminTimesheet";
import EmployeePayslip from "./employee/EmployeePayslip";
import Settings from "./pages/Settings";
function App() {
  return (
    <>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin", "hr"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="leave" element={<HRLeave />} />
          <Route path="employees" element={<Employee />} />
          <Route path="monthly-report" element={<MonthlyReport />} />
          <Route
            path="attendance-calendar"
            element={<AdminAttendanceCalendar />}
          />
          <Route
            path="attendance-management"
            element={<AttendanceManagement />}
          />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="change-password" element={<ChangePassword />} />

          <Route path="allocation" element={<Allocation />} />
          <Route path="timesheets" element={<AdminTimesheet />} />

          {/* Admin only features (frontend control only) */}
          <Route path="manage-admin" element={<ManageAdmin />} />
          <Route path="manage-hr" element={<ManageHR />} />
          <Route path="add-admin" element={<UserForm type="admin" />} />
          <Route path="add-hr" element={<UserForm type="hr" />} />
          <Route path="add-employee" element={<UserForm type="employee" />} />
          <Route
            path="edit-employee/:id"
            element={<UserForm type="employee" />}
            />
            
          <Route path="edit-admin/:id" element={<UserForm type="admin" />} />
          <Route path="edit-hr/:id" element={<UserForm type="hr" />} />
        </Route>

        {/* HR */}
        <Route
          path="/hr"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin", "hr"]}>
              <HRLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<HRDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="leave" element={<HRLeave />} /> {/* FIX */}
          <Route path="attendance" element={<AttendanceCalendar />} />
          <Route path="timesheets" element={<AdminTimesheet />} />
          <Route
            path="attendance-calendar"
            element={<AdminAttendanceCalendar />}
          />
          <Route path="employees" element={<Employee />} />
          <Route
            path="add-employee"
            element={<UserForm type="employee" />}
          />{" "}
          {/* ADD THIS */}
          <Route
            path="edit-employee/:id"
            element={<UserForm type="employee" />}
          />
          <Route
            path="attendance-management"
            element={<AttendanceManagement />}
          />
          <Route path="monthly-report" element={<MonthlyReport />} />
          <Route path="add-hr" element={<UserForm type="hr" />} />
          <Route path="edit-hr/:id" element={<UserForm type="hr" />} />
        </Route>

        {/* EMPLOYEE */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute
              allowedRoles={["employee", "admin", "superadmin", "hr"]}
            >
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="leave" element={<Leave />} />
          <Route path="attendance" element={<AttendanceCalendar />} />
          <Route path="notifications" element={<EmployeeNotifications />}/>
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="tasks" element={<EmployeeTasks />} />
          <Route path="timesheet" element={<Timesheet />} />
          <Route path="payslip" element={<EmployeePayslip />} />

          <Route
            path="edit-employee/:id"
            element={<UserForm type="employee" />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </>
  );
}

export default App;
