import api from "../utils/api";
import "./Leave.css";
import { useState, useEffect } from "react";

const Leave = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

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
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;

  const currentLeaves = filteredLeaves.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredLeaves.length / entriesPerPage);

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

        fetchLeaves(); // 🔥 auto refresh
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
    <div className="page-container">
      <div className="page-card">
        <div className="leave-container">
          {/* ===== FORM CARD ===== */}
          <div className="leave-card">
            <h5>Apply Leave</h5>

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
                Apply Leave
              </button>
            </form>
          </div>
          <div className="table-controls">
            <div>
              <select
                className="emp-entries-select"
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Search by reason, status, date..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* ===== TABLE CARD ===== */}
          <div className="leave-card">
            <h5>My Leave Requests</h5>

            <table className="leave-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Document</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeaves.length > 0 ? (
                  currentLeaves.map((leave) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No Leave Requests Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leave;
