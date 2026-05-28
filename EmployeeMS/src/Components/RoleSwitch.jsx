import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./RoleSwitch.css";

const RoleSwitch = () => {

  const navigate = useNavigate();

  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  console.log("Roles:", roles);

  const [currentRole, setCurrentRole] = useState(
    localStorage.getItem("role")
  );

  if (!roles || roles.length === 0) {
    console.log("❌ Roles empty");
    return null;
  }

  const changeRole = (role) => {
    console.log("👉 Clicked Role:", role);   // ✅ DEBUG

    if (!role) return;

    localStorage.setItem("role", role);
    setCurrentRole(role);

    console.log("👉 Navigating for:", role); // ✅ DEBUG

    if (role === "superadmin" || role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "hr") {
      navigate("/hr/dashboard");
    } else if (role === "employee") {
      navigate("/employee/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="role-switch-container">
      <h5 className="role-title">Switch Role</h5>

      {roles.map((role, index) =>
        role ? (
          <button
            key={index}
            onClick={() => {
              console.log("🔥 Button Clicked:", role); // ✅ DEBUG
              changeRole(role);
            }}
            className={`role-btn ${currentRole === role ? "active" : ""}`}
          >
            {role.toUpperCase()}
          </button>
        ) : null
      )}
    </div>
  );
};

export default RoleSwitch;