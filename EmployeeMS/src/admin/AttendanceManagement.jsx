import { useState, useEffect } from "react";
import api from "../utils/api";
import { useLocation } from "react-router-dom";

import CommonTable from "../components/CommonTable/CommonTable";
import { FiEdit2 } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
import "./AttendanceManagement.css";

const AttendanceManagement = () => {
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editPunchIn, setEditPunchIn] = useState("");
  const [editPunchOut, setEditPunchOut] = useState("");

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const statusFilter = queryParams.get("status");

  // fetch attendance
  const fetchAttendance = async (selectedDate) => {
    console.log("Selected Date:", selectedDate);

    try {
      const res = await api.get(
        `/attendance/attendance-by-date?date=${selectedDate}`,
      );

      console.log(res.data);

      if (res.data.status) {
        setData(res.data.result);
      }
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };
  // save manual correction
  const handleSave = async (id) => {
    try {
      const res = await api.put(`/attendance/manual-correction/${id}`, {
        punch_in: editPunchIn,
        punch_out: editPunchOut,
      });

      if (res.data.status) {
        setEditId(null);

        fetchAttendance(date);
      }
    } catch (err) {
      console.log("Save error:", err);
    }
  };
  // delete attendance
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");

    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/attendance/delete-attendance/${id}`);

      if (res.data.status) {
        fetchAttendance(date);
      }
    } catch (err) {
      console.log("Delete error:", err);
    }
  };
  // filter status
  const filteredData = statusFilter
    ? data.filter(
        (item) =>
          item.status &&
          item.status.toLowerCase() === statusFilter.toLowerCase(),
      )
    : data;

  // load today's attendance first time
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    setDate(today);

    fetchAttendance(today);
  }, []);

  return (
    <div className="attendance-page">
      <div className="attendance-management-wrapper">
        <div className="attendance-management-top">
          <div className="attendance-management-title">
            Attendance Management
          </div>

          <div className="attendance-filters">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button
              type="button"
              onClick={() => {
                const formattedDate = new Date(date)
                  .toISOString()
                  .split("T")[0];

                fetchAttendance(formattedDate);
              }}
            >
              Load
            </button>
          </div>
        </div>
        <div className="attendance-table-wrapper">
          <CommonTable
            columns={["Name", "Punch In", "Punch Out", "Status", "Action"]}
            data={filteredData}
            renderRow={(row) => (
              <tr key={row.id}>
                {/* NAME */}
                <td>{row.name}</td>

                {/* PUNCH IN */}
                <td>
                  {editId === row.id ? (
                    <input
                      type="time"
                      value={editPunchIn}
                      onChange={(e) => setEditPunchIn(e.target.value)}
                    />
                  ) : row.punch_in ? (
                    row.punch_in.slice(0, 5)
                  ) : (
                    "-"
                  )}
                </td>

                {/* PUNCH OUT */}
                <td>
                  {editId === row.id ? (
                    <input
                      type="time"
                      value={editPunchOut}
                      onChange={(e) => setEditPunchOut(e.target.value)}
                    />
                  ) : row.punch_out ? (
                    row.punch_out.slice(0, 5)
                  ) : (
                    "-"
                  )}
                </td>

                {/* STATUS */}
                <td>
                  <span
                    className={`status-badge ${
                      row.status?.toLowerCase() === "present"
                        ? "status-active"
                        : row.status?.toLowerCase() === "late"
                          ? "status-pending"
                          : "status-rejected"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="action-buttons">
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => {
                      setEditId(row.id);

                      setEditPunchIn(row.punch_in?.slice(0, 5) || "");

                      setEditPunchOut(row.punch_out?.slice(0, 5) || "");
                    }}
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    className="icon-btn delete-btn"
                    onClick={() => handleDelete(row.id)}
                  >
                    <HiOutlineTrash />
                  </button>
                </td>
              </tr>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
