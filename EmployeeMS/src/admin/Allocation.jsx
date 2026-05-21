import React, { useEffect, useState } from "react";
import "./Allocation.css";
import api from "../utils/api";
import { toast } from "react-toastify";
import { FiEdit2 } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
import CommonTable from "../Components/CommonTable/CommonTable";


const Allocation = () => {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  const [employee, setEmployee] = useState("");
  const [project, setProject] = useState("");
  const [percentage, setPercentage] = useState("");

  const [taskName, setTaskName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("Pending");
  const [modalType, setModalType] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  

  // ================= FETCH =================
  useEffect(() => {
    fetchEmployees();
    fetchAllocations();

    api.get("/projects").then((res) => {
      setProjects(res.data.data || res.data.result || []);
    });
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    setStartDate(today);
    setEndDate("");
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const hours = getEstimatedHours();
      setEstimatedTime(hours);
    }
  }, [startDate, endDate]);

  const handleAllocate = async () => {
    if (
      !employee ||
      !project ||
      !taskName ||
      !percentage ||
      !priority ||
      !status
    ) {
      toast.error("Fill all fields ❌");
      return;
    }
    const employeeAllocations = (data || []).filter(
      (item) => item.employee_id === Number(employee),
    );

    const totalAllocated = employeeAllocations.reduce(
      (sum, item) => sum + Number(item.percentage || 0),
      0,
    );

    const newTotal = totalAllocated + Number(percentage);

    console.log("👉 totalAllocated:", totalAllocated);
    console.log("👉 entered percentage:", percentage);
    console.log("👉 newTotal:", newTotal);

    if (newTotal > 100) {
      toast.error(
        `Allocation exceeds 100%! Remaining: ${100 - totalAllocated}%`,
      );
      return;
    }

    try {
      const selectedTask = tasks.find((t) => t.name === taskName);

      console.log("👉 SELECTED TASK:", selectedTask);

      const res = await api.post("/allocations", {
        employee_id: employee,
        project_id: project,
        percentage: Number(percentage),
        task_id: selectedTask?.id,
        task_name: taskName,

        priority: priority,
        status: status,
        description: description,
        start_date: startDate,
        end_date: endDate,
        estimated_time: estimatedTime,
      });

      console.log("👉 ALLOCATE RESPONSE:", res.data);

      if (res.data) {
        toast.success("Allocated successfully ✅");

        // reset
        setEmployee("");
        setProject("");
        setPercentage("");
        setTaskName("");
        setTasks([]);

        setPriority("");
        setStatus("Pending");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setEstimatedTime("");

        // 🔥 VERY IMPORTANT
        await fetchAllocations();

        setModalType(null);
      }
    } catch (err) {
      console.log("❌ ERROR:", err);
      toast.error("Allocation failed ❌");
    }
  };

  const fetchAllocations = async () => {
    try {
      const res = await api.get("/allocations");

      console.log("👉 FETCH DATA:", res.data);

      if (res.data.status) {
        setData(res.data.data || res.data.result || []);
      } else {
        setData([]);
      }
    } catch (err) {
      console.log("❌ ERROR:", err);
      setData([]); // 🔥 VERY IMPORTANT
      toast.error("Fetch failed ❌");
    }
  };

  const fetchEmployees = async () => {
    const res = await api.get("/auth/employee");
    if (res.data.status) setEmployees(res.data.result);
  };

  // ================= TASK =================
  const handleProjectChange = async (projectId) => {
    setProject(projectId);
    setTaskName("");
    setTasks([]);

    try {
      const res = await api.get(`/tasks/project/${projectId}`);
      setTasks(res.data.data || res.data.result || []);
    } catch {
      toast.error("Task load failed ❌");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await api.delete(`/allocations/${id}`);
      if (res.data.status) {
        toast.success("Deleted 🗑️");
        fetchAllocations();
      }
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  // ================= EDIT =================
  const openEdit = async (item) => {
    setEditData(item);

    const res = await api.get(`/tasks/project/${item.project_id}`);
    const taskList = res.data.data || [];

    setTasks(taskList);

    setEditData((prev) => ({
      ...prev,
      task_name: item.task_name,
    }));
  };

  const handleUpdate = async () => {
    try {
      console.log("👉 BEFORE UPDATE:", editData);

      const selectedTask = tasks.find((t) => t.name === editData.task_name);

      console.log("👉 SELECTED TASK:", selectedTask);

      const res = await api.put(`/allocations/${editData.id}`, {
        employee_id: editData.employee_id,
        project_id: editData.project_id,
        percentage: Number(editData.percentage),
        task_id: selectedTask?.id, // 🔥 IMPORTANT
        task_name: editData.task_name,
      });

      console.log("👉 API RESPONSE:", res.data);

      if (res.data.status) {
        toast.success("Updated ✅");
        setEditData(null);
        fetchAllocations();
      }
    } catch (err) {
      console.log(err);
      toast.error("Update failed ❌");
    }
  };
  const getEmployeeTotal = (empName) => {
    return data
      .filter((d) => d.employee === empName)
      .reduce((sum, d) => sum + Number(d.percentage), 0);
  };
  const employeeAllocations = (data || []).filter(
    (item) => item.employee_id === Number(employee),
  );

  const totalAllocated = employeeAllocations.reduce(
    (sum, item) => sum + item.percentage,
    0,
  );

  const getDuration = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diff = end - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  };
  const getWorkingDays = () => {
    if (!startDate || !endDate) return 0;

    let start = new Date(startDate);
    let end = new Date(endDate);

    let count = 0;

    while (start <= end) {
      const day = start.getDay();

      if (day !== 0 && day !== 6) {
        count++; // 🔥 only Mon–Fri
      }

      start.setDate(start.getDate() + 1);
    }

    return count;
  };
  const HOURS_PER_DAY = 8;

  const getEstimatedHours = () => {
    const days = getWorkingDays();
    return days * HOURS_PER_DAY;
  };
  
  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <div className="allocation-container">
      {/* ===== TABLE ===== */}
      <CommonTable
        tableClass="allocation-table"
        leftContent={
          <button className="allocate-btn" onClick={() => setModalType("add")}>
            + Allocate Task
          </button>
        }
        columns={["Employee", "Project", "Task", "%", "Status", "Action"]}
        data={data}
        renderRow={(item) => (
          <tr key={item.id}>
           <td>
  <div className="employee-mini">
    <img
      src={item.image || "/default-avatar.png"}
      alt=""
      className="employee-mini-img"
    />

    <div className="employee-mini-info">
      <span>{item.employee}</span>

      <small>{item.percentage}%</small>
    </div>
  </div>
</td>
            <td className="project-text">{item.project}</td>

            <td>{item.task_name}</td>

            <td className="percent-text">{item.percentage}%</td>

            <td>
              <span className="status-badge status-pending">Pending</span>
            </td>

            <td>
              <div className="action-buttons">
                <button className="action-btn" onClick={() => openEdit(item)}>
                  <FiEdit2 size={18} />
                </button>

                <button
                  className="action-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* ===== ALLOCATE MODAL ===== */}
      {modalType === "add" && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Allocate Task</h2>

            {/* ===== ROW 1 ===== */}
            <div className="row three">
              <div className="field">
                <label>Employee</label>
                <select
                  value={employee}
                  onChange={(e) => setEmployee(e.target.value)}
                >
                  <option value="">Select Employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Project</label>
                <select
                  value={project}
                  onChange={(e) => handleProjectChange(e.target.value)}
                >
                  <option value="">Select Project</option>
                  {(projects || []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Task</label>
                <select
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                >
                  <option value="">Select Task</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {employee && (
              <p className="remaining-text">
                Remaining Allocation: {100 - totalAllocated}%
              </p>
            )}

            {/* ===== ROW 2 ===== */}
            <div className="row two">
              <div className="field">
                <label>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="">Select Priority</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div className="field">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* 🔥 DESCRIPTION MOVED UP */}
            <div className="field">
              <label>Task Description</label>
              <textarea
                placeholder="Enter task details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* ===== ROW 3 ===== */}
            <div className="row two">
              <div className="field">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setEndDate(e.target.value);
                  }}
                />
              </div>

              <div className="field">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                {startDate && endDate && (
                  <>
                    <p className="duration-text">
                      Duration: {getDuration()} days
                    </p>

                    <p className="duration-text working">
                      Working Days: {getWorkingDays()}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* ===== ROW 4 ===== */}
            <div className="row two">
              <div className="field">
                <label>Estimated Time (hrs)</label>
                <input
                  type="number"
                  placeholder="Enter hours"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                />
                {startDate && endDate && (
                  <p className="duration-text">
                    Auto Hours: {getEstimatedHours()} hrs
                  </p>
                )}
              </div>

              <div className="field">
                <label>% Allocation</label>
                <input
                  type="number"
                  placeholder="Enter %"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                />
              </div>
            </div>

            {percentage && Number(percentage) + totalAllocated > 100 && (
              <p className="error-text">
                Exceeds limit! Max allowed: {100 - totalAllocated}%
              </p>
            )}

            {/* ===== ACTIONS ===== */}
            <div className="actions">
              <button className="btn-cancel" onClick={() => setModalType(null)}>
                Cancel
              </button>

              <button
                className="btn-primary"
                disabled={Number(percentage) + totalAllocated > 100}
                onClick={handleAllocate}
              >
                Allocate
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 👁 View + Modal */}
      {showModal && selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setShowModal(false)} // ✅ correct
            >
              ✖
            </button>

            <h2>Task Details</h2>

            {/* ✅ CLEAN DATA (NO NESTED <p>) */}
            <p>
              <b>Employee:</b> {selectedTask.employee || "-"}
            </p>
            <p>
              <b>Project:</b> {selectedTask.project || "-"}
            </p>
            <p>
              <b>Task:</b> {selectedTask.task_name || "-"}
            </p>
            <p>
              <b>Status:</b> {selectedTask.status || "-"}
            </p>
            <p>
              <b>Description:</b> {selectedTask.description || "-"}
            </p>
            <p>
              <b>Start Date:</b> {formatDate(selectedTask.start_date)}
            </p>
            <p>
              <b>End Date:</b> {formatDate(selectedTask.end_date)}
            </p>
            <p>
              <b>Estimated Time:</b> {selectedTask.estimated_time || "-"}
            </p>
            <p>
              <b>Allocation %:</b> {selectedTask.percentage || "-"}
            </p>
          </div>
        </div>
      )}
      {/* ===== EDIT MODAL ===== */}
      {editData && (
        <div className="modal-overlay" onClick={() => setEditData(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Allocation</h3>

            <select
              value={editData.employee_id}
              onChange={(e) =>
                setEditData({ ...editData, employee_id: e.target.value })
              }
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>

            <select
              value={editData.project_id}
              onChange={async (e) => {
                const val = e.target.value;
                setEditData({ ...editData, project_id: val });

                const res = await api.get(`/tasks/project/${val}`);
                setTasks(res.data.data || []);
              }}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={editData?.task_name || ""}
              onChange={(e) =>
                setEditData({ ...editData, task_name: e.target.value })
              }
            >
              {tasks.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={editData.percentage}
              onChange={(e) =>
                setEditData({ ...editData, percentage: e.target.value })
              }
            />

            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={handleUpdate}>
                Update
              </button>

              <button
                className="btn btn-cancel"
                onClick={() => setEditData(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Allocation;
