import { useState, useEffect } from "react";
import api from "../utils/api";
import "./HRLeave.css";
import { useLocation } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CommonTable from "../Components/CommonTable/CommonTable";

const HRLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("all");
  const location = useLocation();

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [search, setSearch] = useState("");

  // fetch leaves
  const fetchLeaves = async () => {
    const res = await api.get("/attendance/all-leaves");

    console.log("LEAVE API RESPONSE:", res.data);

    if (res.data.status) {
      setLeaves(res.data.result);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // URL filter
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get("status");

    if (status) {
      setFilter(status);
    }
  }, [location.search]);

  // update status
  const updateStatus = async (id, status) => {
    let reason = "";

    if (status === "rejected") {
      reason = prompt("Enter rejection reason");
      if (!reason) return;
    }

    const res = await api.put(`/attendance/update_status/${id}`, {
      status,
      reject_reason: reason,
    });

    if (res.data.status) {
      fetchLeaves();
    }
  };

  // filter
  const filteredLeaves =
    filter === "all"
      ? leaves
      : leaves.filter((leave) => leave.status?.toLowerCase().trim() === filter);
  // 🔍 search (IMPORTANT: pagination च्या आधी)
  const searchedLeaves = filteredLeaves.filter((leave) =>
    (leave.employee_email || "").toLowerCase().includes(search.toLowerCase()),
  );
  console.log("ALL DATA:", leaves);
  console.log("FILTER:", filter);
  console.log("FILTERED:", filteredLeaves);

  // calculate days
  const calculateDays = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    const diffTime = end - start;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 ? diffDays + 1 : 0;
  };

  return (
    <div className="leave-container">


      {/* Table */}
      <CommonTable
        leftContent={
          <div className="leave-toolbar">
            <div className="left-tools">
              {/* Search */}
              <div className="leave-search-box">
                <span className="search-icon">🔍</span>

                <input
                  type="text"
                  placeholder="Search by email..."
                  className="leave-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="filter-buttons">
                <button
                  className={filter === "all" ? "active" : ""}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>

                <button
                  className={filter === "pending" ? "active" : ""}
                  onClick={() => setFilter("pending")}
                >
                  Pending
                </button>

                <button
                  className={filter === "approved" ? "active" : ""}
                  onClick={() => setFilter("approved")}
                >
                  Approved
                </button>

                <button
                  className={filter === "rejected" ? "active" : ""}
                  onClick={() => setFilter("rejected")}
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>
        }
        tableClass="leave-table"
        columns={[
          {
            header: "Email",
            render: (leave) => leave.employee_email || "N/A",
          },
          {
            header: "From",
            render: (leave) =>
              new Date(leave.from_date).toLocaleDateString("en-GB"),
          },
          {
            header: "To",
            render: (leave) =>
              new Date(leave.to_date).toLocaleDateString("en-GB"),
          },
          {
            header: "Total Days",
            render: (leave) => calculateDays(leave.from_date, leave.to_date),
          },
          {
            header: "Reason",
            render: (leave) => leave.reason,
          },
          {
            header: "Document",
            render: (leave) =>
              leave.document ? (
                <button
                  className="view-btn"
                  onClick={() => setSelectedDoc(leave.document)}
                >
                  View
                </button>
              ) : (
                <span className="no-file">No File</span>
              ),
          },
          {
            header: "Reject Reason",
            render: (leave) => leave.reject_reason || "-",
          },
          {
            header: "Status",
            render: (leave) => (
              <span className={`status ${leave.status}`}>{leave.status}</span>
            ),
          },
          {
            header: "Action",
            render: (leave) =>
              leave.status === "pending" ? (
                <div className="action-buttons">
                  <button
                    className="approve-btn"
                    onClick={() => updateStatus(leave.id, "approved")}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => updateStatus(leave.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                "-"
              ),
          },
        ]}
        data={searchedLeaves}
      />

      {/* 📂 Modal */}
      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h4>Document Preview</h4>

            {selectedDoc.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={`http://localhost:5000/${selectedDoc}`}
                width="100%"
                height="400px"
              />
            ) : (
              <img
                src={`http://localhost:5000/${selectedDoc}`}
                alt="Document"
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
              />
            )}

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setSelectedDoc(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRLeave;
