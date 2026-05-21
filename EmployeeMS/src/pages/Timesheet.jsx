import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "./Timesheet.css";
import { useAuth } from "../context/AuthContext";
import { FaEdit, FaTrash, FaFilter, FaTimes } from "react-icons/fa";
import CommonTable from "../Components/CommonTable/CommonTable";
const Timesheet = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  // ✅ INITIAL STATE (NO user here)
  const [formData, setFormData] = useState({
    employee_id: "",
    project_id: "",
    task_id: "",
    hours: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [projects, setProjects] = useState([]);
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ✅ SET employee_id AFTER user loads
  useEffect(() => {
    if (user?.id) {
      setFormData((prev) => ({
        ...prev,
        employee_id: user.id,
      }));
    }
  }, [user]);

  // ✅ FETCH DATA WHEN USER AVAILABLE
  useEffect(() => {
    if (user?.id) {
      fetchProjects();
      fetchTimesheet();
    }
  }, [user]);
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    setFormData((prev) => ({
      ...prev,
      date: today,
    }));
  }, []);

  // 🔹 FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/auth/employee/assigned/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("PROJECTS API:", res.data);

      if (res.data.status) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.log("PROJECT ERROR:", err);
    }
  };

  // 🔹 FETCH TIMESHEET
  const fetchTimesheet = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      let url = "/timesheets/my";

      if (fromDate && toDate) {
        url += `?from=${fromDate}&to=${toDate}`;
      }

      const res = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status) {
        setEntries(res.data.data);
      }
    } catch (err) {
      console.log("TIMESHEET ERROR:", err);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/tasks/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("TASKS API 👉", res.data);
      console.log("PROJECTS:", res.data);
      console.log("SELECTED PROJECT ID:", projectId);

      setTasks(res.data.data);
    } catch (err) {
      console.log("Task fetch error:", err);
    }
  };

  // 🔹 HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleProjectChange = (e) => {
    const projectId = e.target.value;

    // form update
    setFormData((prev) => ({
      ...prev,
      project_id: projectId,
      task_id: "", // reset task
    }));

    // 🔥 filter tasks
    fetchTasks(projectId);
  };

  // 🔹 SUBMIT
  const handleSubmit = async () => {
    console.log("FORM DATA 👉", formData);

    try {
      if (!user?.id) {
        setMessage("User not loaded ❌");
        return;
      }

      if (
        !formData.project_id ||
        !formData.task_id ||
        !formData.hours ||
        !formData.date
      ) {
        setMessage("All fields are required ⚠️");
        return;
      }

      const payload = {
        employee_id: user.id,
        project_id: Number(formData.project_id),
        task_id: Number(formData.task_id),
        hours: Number(formData.hours),
        date: new Date(formData.date).toISOString().split("T")[0],
      };

      console.log("PAYLOAD 👉", payload);

      let res;

      if (editId) {
        res = await api.put(`/timesheets/${editId}`, payload);
      } else {
        res = await api.post("/timesheets", payload);
      }

      console.log("API RESPONSE 👉", res.data); // ✅ correct place

      if (res.data.status) {
        setMessage("Timesheet submitted ✅");
        setEditId(null);

        setFormData((prev) => ({
          ...prev,
          project_id: "",
          task_id: "",
          hours: "",
          date: new Date().toISOString().split("T")[0],
        }));

        fetchTimesheet();
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      console.log("SUBMIT ERROR:", err);
      setMessage("Something went wrong ❌");
    }
  };
  const handleDelete = async (id) => {
    try {
      await api.delete(`/timesheets/${id}`);

      setEntries((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log("Delete error:", err);
    }
  };
 const handleEdit = async (item) => {
  console.log("EDIT CLICKED 🔥", item);
  console.log("TASK ID 👉", item.task_id);

  await fetchTasks(item.project_id);

  setEditId(item.id);

  setTimeout(() => {
    setFormData({
      employee_id: user.id,
      project_id: item.project_id,
      task_id: item.task_id,
      hours: item.hours,
      date: item.date.split("T")[0],
    });
  }, 200); // 🔥 wait for tasks load
};

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  const grouped = {};

  entries.forEach((e) => {
    const date = e.date.split("T")[0];
    if (!grouped[date]) grouped[date] = 0;
    grouped[date] += e.hours;
  });
  const columns = [
  { header: "Date" },
  { header: "Project" },
  { header: "Task" },
  { header: "Hours" },
  { header: "Action" },
];
  let lastDate = "";

  const renderRow = (e) => (
  <tr key={e.id}>
    <td>
      {new Date(e.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}

      {(() => {
        const currentDate = e.date.split("T")[0];

        if (lastDate !== currentDate) {
          lastDate = currentDate;

          return (
            <>
              <br />

              <small style={{ color: "#666" }}>
                Total: {grouped[currentDate]} hrs
              </small>
            </>
          );
        }

        return null;
      })()}
    </td>

    <td>
      <span
        className={`project-badge ${
          e.project === "EMS Project" ? "green" : "blue"
        }`}
      >
        {e.project}
      </span>
    </td>

    <td>{e.task_name || e.name}</td>

    <td>{e.hours}</td>

    <td>
      <div className="action-buttons">

        <button
          type="button"
          className="action-btn"
          onClick={() => handleEdit(e)}
        >
          <FaEdit />
        </button>

        <button
          type="button"
          className="action-btn"
          onClick={() => handleDelete(e.id)}
        >
          <FaTrash />
        </button>

      </div>
    </td>
  </tr>
);

  return (
    <div className="timesheet-container">
     

      {message && <p className="message">{message}</p>}

      <div className="filter-section">
        <input
          type="date"
          value={fromDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          value={toDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button
          title="Apply Filter"
          onClick={fetchTimesheet}
          disabled={!fromDate || !toDate}
          style={{ opacity: !fromDate || !toDate ? 0.5 : 1 }}
        >
          <FaFilter />
        </button>
        {fromDate && toDate && (
          <p style={{ color: "#2d6cdf", marginTop: "5px" }}>
            Showing data from {fromDate} to {toDate}
          </p>
        )}

        <button
          title="Clear Filter"
          onClick={() => {
            setFromDate("");
            setToDate("");
            fetchTimesheet();
          }}
        >
          <FaTimes />
        </button>
      </div>

      {/* FORM */}
      <div className="timesheet-form">
        <select
          name="project_id"
          value={formData.project_id}
          onChange={handleProjectChange}
        >
          <option value="">Select Project</option>

          {projects.map((p) => (
            <option key={p.project_id} value={p.project_id}>
              {p.project_name}
            </option>
          ))}
        </select>

        <select
          name="task_id"
          disabled={!formData.project_id}
          value={formData.task_id}
          onChange={handleChange}
        >
          <option value="">Select Task</option>

          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="hours"
          min="0"
          max="24"
          placeholder="Hours"
          value={formData.hours}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      

      {/* TABLE */}
  <CommonTable
  columns={columns}
  data={entries}
  renderRow={renderRow}
  tableClass="manage-table"
  leftContent={
    <div className="filter-section">

      <input
        type="date"
        value={fromDate}
        max={new Date().toISOString().split("T")[0]}
        onChange={(e) => setFromDate(e.target.value)}
      />

      <input
        type="date"
        value={toDate}
        max={new Date().toISOString().split("T")[0]}
        onChange={(e) => setToDate(e.target.value)}
      />

      <button
        title="Apply Filter"
        onClick={fetchTimesheet}
        disabled={!fromDate || !toDate}
        style={{ opacity: !fromDate || !toDate ? 0.5 : 1 }}
      >
        <FaFilter />
      </button>

      <button
        title="Clear Filter"
        onClick={() => {
          setFromDate("");
          setToDate("");
          fetchTimesheet();
        }}
      >
        <FaTimes />
      </button>

    </div>
  }
/>
    </div>
  );
};

export default Timesheet;
