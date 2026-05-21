import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../utils/api";

import "./HRDashboard.css";

const HRDashboard = () => {

  const navigate = useNavigate();

  const [stats, setStats] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {

    Promise.all([
      api.get("/auth/hr/total-employees"),
      api.get("/attendance/today-count"),
      api.get("/attendance/pending-leaves"),
      api.get("/attendance/on-leave-count"),
    ])

      .then(([emp, today, pending, leave]) => {

        setStats({
          totalEmployees:
            emp.data?.result?.totalEmployees || 0,

          presentToday:
            today.data?.result?.presentToday || 0,

          pendingRequests:
            pending.data?.result?.pending || 0,

          onLeave:
            leave.data?.result?.onLeave || 0,
        });

      })

      .catch((err) => {

        console.log(err);

        setError(
          "Server error while loading HR dashboard"
        );
      });

  }, []);

  /* ERROR */

  if (error) {

    return (

      <div className="hr-dashboard">

        <h4>{error}</h4>

        <button
          className="dashboard-btn"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>

      </div>
    );
  }

  /* LOADING */

  if (!stats) {

    return (

      <div className="hr-dashboard">

        <h5>Loading HR Dashboard...</h5>

      </div>
    );
  }

  /* MAIN UI */

  return (

    <div className="hr-dashboard">

      <div className="dashboard-content">


        <div className="dashboard-cards">

          {/* Total Employees */}

          <div
            className="
              stat-card
              bg-primary
              clickable
            "
            onClick={() =>
              navigate("/hr/employees")
            }
          >
            <h6>Total Employees</h6>

            <h2>
              {stats.totalEmployees}
            </h2>
          </div>

          {/* Today Present */}

          <div
            className="
              stat-card
              bg-success
              clickable
            "
            onClick={() =>
              navigate(
                "/hr/attendance-management"
              )
            }
          >
            <h6>Today Present</h6>

            <h2>
              {stats.presentToday}
            </h2>
          </div>

          {/* Pending Leaves */}

          <div
            className="
              stat-card
              bg-warning
              clickable
            "
            onClick={() =>
              navigate(
                "/hr/leave?status=pending"
              )
            }
          >
            <h6>Pending Leaves</h6>

            <h2>
              {stats.pendingRequests}
            </h2>
          </div>

          {/* On Leave */}

          <div
            className="
              stat-card
              bg-danger
              clickable
            "
            onClick={() =>
              navigate(
                "/hr/leave?status=approved"
              )
            }
          >
            <h6>On Leave</h6>

            <h2>
              {stats.onLeave}
            </h2>
          </div>

        </div>

      </div>

    </div>
  );
};

export default HRDashboard;