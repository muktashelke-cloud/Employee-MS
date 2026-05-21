import { useState, useEffect } from "react";
import api from "../utils/api";
import { useLocation } from "react-router-dom";

import CommonTable from "../components/CommonTable/CommonTable";

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
    try {
      const res = await api.get(
        `/attendance/attendance-by-date?date=${selectedDate}`
      );

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
      const res = await api.put(
        `/attendance/manual-correction/${id}`,
        {
          punch_in: editPunchIn,
          punch_out: editPunchOut,
        }
      );

      if (res.data.status) {
        setEditId(null);

        fetchAttendance(date);
      }
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  // filter status
  const filteredData = statusFilter
    ? data.filter(
        (item) =>
          item.status &&
          item.status.toLowerCase() ===
            statusFilter.toLowerCase()
      )
    : data;

  // load today's attendance first time
  useEffect(() => {
    const today = new Date()
      .toISOString()
      .split("T")[0];

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
              onChange={(e) =>
                setDate(e.target.value)
              }
            />

            <button
              onClick={() =>
                fetchAttendance(date)
              }
            >
              Load
            </button>

          </div>

        </div>

        <CommonTable
          columns={[
            "Name",
            "Punch In",
            "Punch Out",
            "Status",
            "Action",
          ]}
          data={filteredData}
          renderRow={(row) => (
            <>
              <td>{row.name}</td>

              <td>
                {editId === row.id ? (
                  <input
                    type="time"
                    value={editPunchIn}
                    onChange={(e) =>
                      setEditPunchIn(
                        e.target.value
                      )
                    }
                  />
                ) : row.punch_in ? (
                  row.punch_in.slice(0, 5)
                ) : (
                  "-"
                )}
              </td>

              <td>
                {editId === row.id ? (
                  <input
                    type="time"
                    value={editPunchOut}
                    onChange={(e) =>
                      setEditPunchOut(
                        e.target.value
                      )
                    }
                  />
                ) : row.punch_out ? (
                  row.punch_out.slice(0, 5)
                ) : (
                  "-"
                )}
              </td>

              <td>
                <span
                  className={`status-badge ${
                    row.status?.toLowerCase() ===
                    "present"
                      ? "status-active"
                      : row.status?.toLowerCase() ===
                        "late"
                      ? "status-pending"
                      : "status-rejected"
                  }`}
                >
                  {row.status}
                </span>
              </td>

              <td>
                {editId === row.id ? (
                  <button
                    className="action-btn"
                    onClick={() =>
                      handleSave(row.id)
                    }
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="action-btn"
                    onClick={() => {
                      setEditId(row.id);

                      setEditPunchIn(
                        row.punch_in?.slice(0, 5) ||
                          ""
                      );

                      setEditPunchOut(
                        row.punch_out?.slice(
                          0,
                          5
                        ) || ""
                      );
                    }}
                  >
                    Edit
                  </button>
                )}
              </td>
            </>
          )}
        />

      </div>

    </div>
  );
};

export default AttendanceManagement;