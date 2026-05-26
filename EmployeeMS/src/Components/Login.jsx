import "./Login.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
    tick: false,
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.email || !values.password) {
      setError("Please fill all fields");
      return;
    }

    if (!values.tick) {
      setError("Please accept terms & conditions");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const cleanEmail = values.email.trim().toLowerCase();
      const cleanPassword = values.password.trim();

      const res = await api.post(
        "/auth/login",
        {
          email: cleanEmail,
          password: cleanPassword,
          tick: values.tick,
        },
        {
          withCredentials: true,
        },
      );

      if (res.data.status) {
        const role = res.data.user?.role;

        if (!role) {
          setError("Role not found");
          return;
        }

        const userData = {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
        };

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        if (role === "superadmin") {
          localStorage.setItem(
            "roles",
            JSON.stringify(["superadmin", "admin", "hr", "employee"]),
          );
        } else {
          localStorage.setItem("roles", JSON.stringify([role]));
        }

        localStorage.setItem("role", role);

        if (role === "superadmin" || role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "hr") {
          navigate("/hr/dashboard");
        } else {
          navigate("/employee/dashboard");
        }
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (error && (values.email || values.password)) {
      setError("");
    }
  }, [values.email, values.password]);

  return (
    <div className="loginPage">
      <form className="loginForm" onSubmit={handleSubmit} autoComplete="off">
        <input type="text" name="fakeuser" style={{ display: "none" }} />
        <input type="password" name="fakepass" style={{ display: "none" }} />
        <h2>Login</h2>

        {error && <div className="error-box">{error}</div>}

        <div className="input-group">
          <span className="input-icon">📧</span>

          <input
            type="email"
            name="login_email"
            autoComplete="off"
            required
            autoFocus
            placeholder="Enter Email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
        </div>

        <div className="input-group password-group">
          <span className="input-icon">🔒</span>

          <input
            type={showPassword ? "text" : "password"}
            name="login_password" // 🔥 add this
            autoComplete="new-password" // 🔥 important
            required
            placeholder="Enter Password"
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />

          <span
            className="toggle-icon"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </span>
        </div>
        <div className="text-end">
          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>
        </div>

        <label className="terms">
          <input
            type="checkbox"
            checked={values.tick}
            onChange={(e) => setValues({ ...values, tick: e.target.checked })}
          />
          <span>You agree with terms & conditions</span>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Logging..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
