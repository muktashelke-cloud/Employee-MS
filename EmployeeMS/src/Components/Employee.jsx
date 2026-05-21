import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Employee.css";
import { useAuth } from "../context/AuthContext";
import { FiEdit2 } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [preview, setPreview] = useState(null);
  const [employeesPerPage, setEmployeesPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDept, setFilterDept] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role || localStorage.getItem("role");

  /* Fetch Employees */
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/auth/employee");
      if (res.data.status) {
        setEmployee(res.data.result);
      } else {
        alert(res.data.message || "No data found");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* Delete */
  const handleDelete = async (id) => {
    if (window.confirm("Delete employee?")) {
      try {
        const res = await api.delete(`/auth/delete_employee/${id}`);
        if (res.data.status) fetchEmployees();
      } catch (err) {
        console.log(err);
      }
    }
  };

  /* Preview */
  const handlePreview = (file) => {
    setPreview(`http://localhost:5000/${file}`);
  };

  /* 🔍 Search Filter */
  const filteredEmployees = employee.filter((emp) => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase()) ||
      emp.address?.toLowerCase().includes(search.toLowerCase());

    const matchesDept = filterDept === "" || emp.department === filterDept;

    return matchesSearch && matchesDept;
  });

  const handleEdit = (emp) => {
    console.log(emp);
    navigate(`/admin/edit-employee/${emp.id}`);
  };

  /* 📄 Pagination */
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee,
  );

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  return (
    <div className="emp-page px-2 mt-2">
      <div className="emp-header">
        {/* LEFT */}
        <div className="emp-header-left">
          <button
            className="emp-add-btn"
            onClick={() => navigate("/admin/add-employee")}
          >
            Add Employee
          </button>
        </div>

        {/* RIGHT */}
        <div className="emp-header-right">
          <input
            className="emp-search-input"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            className="emp-filter"
            value={filterDept}
            onChange={(e) => {
              setFilterDept(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Departments</option>
            <option value="Development">Development</option>
            <option value="Designing">Designing</option>
            <option value="IT">IT</option>
          </select>

          <select
            className="emp-entries-select"
            value={employeesPerPage}
            onChange={(e) => {
              setEmployeesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {/* 📊 Table */}
      <div className="common-table-wrapper">
        <table className="common-table employee-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Documents</th>
              {(role === "admin" || role === "hr" || role === "superadmin") && (
                <th>Action</th>
              )}
            </tr>
          </thead>

          <tbody>
            {currentEmployees.map((e, index) => (
              <tr key={e.id}>
                <td className="emp-user">
                  <img
                    className="emp-avatar"
                    src={`http://localhost:5000/${
                      e.image?.startsWith("uploads/")
                        ? e.image
                        : "uploads/images/" + e.image
                    }`}
                    alt="employee"
                  />

                  <div className="emp-user-info">
                    <div className="emp-name">{e.name}</div>
                    <div className="emp-email">{e.email}</div>
                  </div>
                </td>
                <td>
                  <span
                    className={`emp-badge ${e.department?.toLowerCase().replace(" ", "")}`}
                  >
                    {e.department}
                  </span>
                </td>
                <td>{e.address}</td>
                <td>{e.salary}</td>

                <td>
                  {e.documents ? (
                    (() => {
                      let docs = [];

                      try {
                        docs = JSON.parse(e.documents);
                      } catch {
                        docs = e.documents.split(",");
                      }

                      docs = docs.filter((d) => d && d.trim() !== "");

                      if (docs.length === 0) {
                        return <span className="no-docs">No Documents</span>;
                      }

                      return docs.map((doc, i) => (
                        <div key={i}>
                          <button
                            className="emp-view-btn mb-1"
                            onClick={() =>
                              handlePreview(
                                doc.trim().startsWith("uploads/")
                                  ? doc.trim()
                                  : "uploads/documents/" + doc.trim(),
                              )
                            }
                          >
                            View
                          </button>
                        </div>
                      ));
                    })()
                  ) : (
                    <span className="no-docs">No Documents</span>
                  )}
                </td>

                {(role === "admin" ||
                  role === "hr" ||
                  role === "superadmin") && (
                  <td>
                    <div className="emp-actions">
                      <button
                        className="emp-icon-btn edit"
                        onClick={() => {
                          console.log("ROW DATA:", e);

                          if (!e) {
                            alert("No data");
                            return;
                          }

                          navigate(`/admin/edit-employee/${e.id}`);
                        }}
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        className="emp-icon-btn delete"
                        onClick={() => handleDelete(e.id)}
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔢 Pagination */}
      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* 🔍 Preview Modal */}
      {preview && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setPreview(null)}>
              ✖
            </span>

            {preview.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img className="emp-img" src={preview} alt="preview" />
            ) : (
              <iframe
                src={preview}
                title="doc"
                className="preview-doc"
              ></iframe>
            )}

            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <a href={preview} download className="btn btn-primary">
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
