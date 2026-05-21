import React, { useEffect, useState, useRef } from "react";
import api from "../utils/api";
import "./EmployeeTasks.css";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/allocations/my");
      console.log("API DATA:", res.data.data);

      if (res.data.status) {
        setTasks(
          res.data.data.map((t) => ({
            ...t,
            percentage: Number(t.percentage) || 0,
          })),
        );
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.log(err);
      setTasks([]);
    }
  };

  // 🔥 Group by project
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.project]) {
      acc[task.project] = [];
    }
    acc[task.project].push(task);
    return acc;
  }, {});

  // 🎯 Status
  const getStatus = (p) => {
    if (p === 100) return "Completed";
    if (p > 0) return "In Progress";
    return "Not Started";
  };

  // 🎨 Color
  const getColor = (p) => {
    if (p === 100) return "#4caf50";
    if (p > 0) return "#ff9800";
    return "#f44336";
  };

  // 🔁 Update %
  const handleChange = (taskId, value) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, percentage: value } : t,
    );
    setTasks(updated);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await api.put("/employee/update-percentage", {
          task_id: taskId,
          percentage: value,
        });

        toast.success("Saved successfully ✅");
      } catch (err) {
        toast.error("Update failed ❌");
      }
    }, 500);
  };

  // 📊 Overall Progress
  const total = tasks.reduce((sum, t) => sum + (Number(t.percentage) || 0), 0);
  const avg = tasks.length ? Math.round(total / tasks.length) : 0;

  return (
    <div className="tasks-page">
      <h2>My Tasks</h2>
      <h3 style={{ marginTop: "10px" }}>Overall Progress: {avg}%</h3>

      {Object.keys(groupedTasks).length > 0 ? (
        Object.entries(groupedTasks).map(([project, list]) => (
          <div key={project} className="project-block">
            <h3 className="project-title">{project}</h3>

            {list.map((t) => {
              // ✅ SAFE VALUE (MAIN FIX)
              const safe = Math.min(
                Math.max(Number(t.percentage) || 0, 0),
                100,
              );

              return (
                <div
                  key={t.id}
                  className={`task-card ${safe === 100 ? "completed" : ""}`}
                  style={{
                    border: safe === 100 ? "2px solid #4caf50" : "",
                  }}
                >
                  {/* HEADER */}
                  <div className="task-header">
                    <p>
                      <b>Task:</b> {t.task_name}
                    </p>

                    <span
                      className="status-badge"
                      style={{ background: getColor(safe) }}
                    >
                      {getStatus(safe)}
                    </span>
                  </div>

                  {/* BODY */}
                  <div className="task-body">
                    <input
                      className="progress-input"
                      type="number"
                      value={String(safe)}
                      min="0"
                      max="100"
                      onChange={(e) => {
                        let value = Number(e.target.value);

                        if (isNaN(value)) value = 0;
                        if (value > 100) value = 100;
                        if (value < 0) value = 0;

                        handleChange(t.id, value);
                      }}
                    />

                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.min(safe, 100)}%`,
                          background: getColor(safe),
                        }}
                      >
                        {Math.min(safe, 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <p>No Tasks Assigned</p>
      )}
    </div>
  );
};

export default EmployeeTasks;
