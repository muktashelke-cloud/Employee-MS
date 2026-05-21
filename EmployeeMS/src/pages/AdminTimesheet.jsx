import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "./AdminTimesheet.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import CommonTable from "../Components/CommonTable/CommonTable";

const AdminTimesheet = () => {
  const [data, setData] = useState([]);
  const role = JSON.parse(localStorage.getItem("user"))?.role;

  // ✅ NEW STATE
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [remark, setRemark] = useState("");
  const [modalType, setModalType] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
 
  

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await api.get("/timesheets/all");
      setData(res.data.data || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ UPDATED FUNCTION (remarks support)
  const updateStatus = async (id, status, remarks = "") => {
    console.log("SENDING 👉", status, remarks);
    try {
      const res = await api.put(`/timesheets/update-status/${id}`, {
        status,
        remarks,
      });

      if (res.data.status || res.data.Status) {
        fetchAll();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleView = (e) => {
    setSelectedData(e);
    setModalType("view");
    setShowModal(true);
  };

  const filteredData =
    filterStatus === "all"
      ? data
      : data.filter((e) => e.status === filterStatus);


  const columns = [
    { header: "Date" },
    { header: "Employee" },
    { header: "Project" },
    { header: "Task" },
    { header: "Hours" },
    { header: "Status" },
    { header: "Action" },
  ];

  const renderRow = (e) => (
    <tr key={e.id}>
      <td>
        {new Date(e.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>

      <td className="employee-highlight">{e.employee_name}</td>

      <td>{e.project}</td>

      <td>{e.task_name}</td>

      <td>{e.hours}</td>

      <td>
        <span className={`status-badge ${e.status}`}>{e.status}</span>
      </td>

      <td>
        {role === "superadmin" && e.status === "pending" ? (
          <div className="action-buttons">
            <button
              className="action-btn approve-btn"
              onClick={() => updateStatus(e.id, "approved")}
            >
              <FaCheck />
            </button>

            <button
              className="action-btn reject-btn"
              onClick={() => {
                setSelectedId(e.id);
                setSelectedData(e);
                setModalType("reject");
                setShowModal(true);
              }}
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <span className="verified-text" onClick={() => handleView(e)}>
            {e.status === "pending" ? "View" : "Verified"}
          </span>
        )}
      </td>
    </tr>
  );

  return (
    <div className="timesheet-container">
      

      <CommonTable
        columns={columns}
        data={filteredData}
        renderRow={renderRow}
        tableClass="timesheet-table"
        leftContent={
          <div className="filter-box">
            <label>Filter:</label>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>

              <option value="pending">Pending</option>

              <option value="approved">Approved</option>

              <option value="rejected">Rejected</option>
            </select>
          </div>
        }
      />

      {/* 🔥 POPUP MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            {/* 🔹 VIEW MODE */}
            {modalType === "view" && selectedData && (
              <>
                <h4>Timesheet Details</h4>

                <p>
                  <b>Employee:</b> {selectedData.employee_name}
                </p>
                <p>
                  <b>Project:</b> {selectedData.project}
                </p>
                <p>
                  <b>Task:</b> {selectedData.task_name}
                </p>
                <p>
                  <b>Hours:</b> {selectedData.hours}
                </p>
                <p>
                  <b>Status:</b> {selectedData.status}
                </p>

                {selectedData.status === "rejected" && (
                  <p>
                    <b>Reason:</b> {selectedData.remarks || "-"}
                  </p>
                )}

                <div className="modal-actions">
                  <button
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </>
            )}

            {/* 🔹 REJECT MODE */}
            {modalType === "reject" && (
              <>
                <h4>Reject Reason</h4>

                <textarea
                  placeholder="Enter reject reason (mandatory)"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />

                <div className="modal-actions">
                  <button
                    className="submit-btn"
                    onClick={() => {
                      if (!remark.trim()) {
                        alert("Please enter reason");
                        return;
                      }

                      updateStatus(selectedId, "rejected", remark);
                      setShowModal(false);
                      setRemark("");
                    }}
                  >
                    Submit
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setShowModal(false);
                      setRemark("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTimesheet;
