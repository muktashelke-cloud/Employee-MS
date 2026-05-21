import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Email sending:", email);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      console.log("Response:", res.data);

      if (res.data.status) {
        setMessage("Reset link sent. Check console for token.");
        navigate(`/reset-password/${res.data.token}`);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage("Server error");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <span className="close-btn" onClick={() => navigate("/login")}>
          ✕
        </span>
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email Address</label>
          </div>
          <p className="helper-text">
            We’ll send you a reset link to your email
          </p>

          <button type="submit">Send Reset Link</button>
        </form>

        {message && <p className="info-text">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
