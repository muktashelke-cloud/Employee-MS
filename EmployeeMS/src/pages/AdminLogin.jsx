import "./AdminLogin.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
    tick: false,
  });

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!values.tick) {
      setError("Please accept terms & conditions");
      return;
    }

    api.post("/auth/adminlogin", values).then((res) => {
      if (res.data.loginStatus) {
        navigate("/admin/dashboard"); // ✅ only admin
      } else {
        setError("Invalid admin credentials");
      }
    });
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2>Admin Login</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={(e) =>
              setValues({ ...values, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={values.password}
            onChange={(e) =>
              setValues({ ...values, password: e.target.value })
            }
          />

          <div className="admin-terms">
            <label>
              <input
                type="checkbox"
                checked={values.tick}
                onChange={(e) =>
                  setValues({ ...values, tick: e.target.checked })
                }
              />
              <span>I agree to terms & conditions</span>
            </label>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
