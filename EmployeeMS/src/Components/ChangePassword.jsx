import { useState } from "react";
import api from "../utils/api";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      if (res.data.status) {
        alert("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Error changing password");
    }
  };

  return (
    <div className="change-password-wrapper">
  <div className="change-password-card">
        <h4>Change Password</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button type="submit" className="btn btn-primary w-100">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;