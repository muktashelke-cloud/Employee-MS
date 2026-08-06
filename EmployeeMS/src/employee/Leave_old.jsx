import api from "../utils/api";
import "./Leave.css";
import { useState, useEffect } from "react";
import CommonTable from "../Components/CommonTable/CommonTable";

const Leave = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  /* ================= FILTER ================= */

  const filteredLeaves = leaves.filter((leave) => {
    const searchText = search.toLowerCase();

    return (
      leave.reason.toLowerCase().includes(searchText) ||
      leave.status.toLowerCase().includes(searchText) ||
      new Date(leave.from_date)
        .toLocaleDateString("en-IN")
        .includes(searchText) ||
      new Date(leave.to_date).toLocaleDateString("en-IN").includes(searchText)
    );
  });

  /* ================= APPLY LEAVE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("from_date", fromDate);
    formData.append("to_date", toDate);
    formData.append("reason", reason);

    for (let i = 0; i < files.length; i++) {
      formData.append("documents", files[i]);
    }

    try {
      const res = await api.post("/attendance/apply-leave", formData);

      if (res.data.status) {
        alert("Leave Applied Successfully");

        setFromDate("");
        setToDate("");
        setReason("");
        setFiles([]);

        setShowModal(false);

        fetchLeaves();
      } else {
        alert("Leave Apply Failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FETCH LEAVES ================= */

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/attendance/all-leaves");

      if (res.data.status) {
        setLeaves(res.data.result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* ================= DATE FORMAT ================= */

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ================= UI ================= */

  return (
    <div
      className="page-container"
      style={{
        padding: 0,
        margin: 0,
        width: "100%",
      }}
    >
      <div
        className="employee-page-card"
        style={{
          padding: 0,
          margin: 0,
          background: "transparent",
          boxShadow: "none",
          border: "none",
        }}
      >
        <div
          className="leave-container"
          style={{
            background: "transparent",
            padding: "0",
          }}
        >
          {/* ===== TOPBAR ===== */}

          <div className="leave-topbar">
            <div className="leave-actions">
                 <button
                className="open-modal-btn"
                onClick={() => setShowModal(true)}
              >
                + Apply Leave
              </button>
              <input
                type="text"
                placeholder="Search..."
                className="leave-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

           
            </div>
          </div>

          {/* ===== MODAL ===== */}

          {showModal && (
            <div className="modal-overlay">
              <div className="leave-modal">
                <div className="modal-header">
                  <h3>Apply Leave</h3>

                  <button
                    className="close-btn"
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="leave-form">
                  <div className="form-row">
                    <div>
                      <label>From Date</label>

                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label>To Date</label>

                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label>Reason</label>

                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter reason..."
                      required
                    />
                  </div>

                  <div>
                    <label>Upload Documents</label>

                    <input
                      type="file"
                      multiple
                      onChange={(e) => setFiles(e.target.files)}
                    />
                  </div>

                  <button type="submit" className="apply-btn">
                    Submit Leave
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ===== TABLE ===== */}
<div className="leave-table-section"></div>
          <CommonTable
            columns={[
              { header: "From" },
              { header: "To" },
              { header: "Reason" },
              { header: "Document" },
              { header: "Status" },
            ]}
            data={filteredLeaves}
            tableClass="leave-table"
            cardClass="leave-common-table"
            renderRow={(leave) => (
              <tr key={leave.id}>
                <td>{formatDate(leave.from_date)}</td>

                <td>{formatDate(leave.to_date)}</td>

                <td>{leave.reason}</td>

                <td>
                  {leave.document
                    ? leave.document.split(",").map((doc, i) => (
                        <a
                          key={i}
                          href={`http://localhost:5000/${doc}`}
                          target="_blank"
                          rel="noreferrer"
                          className="doc-btn"
                        >
                          View
                        </a>
                      ))
                    : "No File"}
                </td>

                <td>
                  <span className={`leave-status ${leave.status}`}>
                    {leave.status}
                  </span>
                </td>
              </tr>
            )}
          />
          </div>
        </div>
      </div>
    
  );
};

export default Leave;
