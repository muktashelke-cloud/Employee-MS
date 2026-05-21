import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./ManageAdmin.css";
import { FiPlus, FiEdit2, FiEye } from "react-icons/fi";
import CommonTable from "../Components/CommonTable/CommonTable";

import { HiOutlineTrash } from "react-icons/hi";

const ManageAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  const fetchAdmins = () => {
    api
      .get("/auth/admin_records")
      .then((res) => {
        if (res.data.status) {
          setAdmins(res.data.result);
        } else {
          setAdmins([]);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchAdmins();
  }, []);
  const columns = [
    { header: "Name" },
    { header: "Email" },
    { header: "Phone" },
    { header: "Status" },
    { header: "Action" },
  ];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      api
        .delete(`/auth/delete_admin/${id}`)
        .then((res) => {
          if (res.data.status) {
            alert("Admin deleted successfully");
            fetchAdmins();
          } else {
            alert("Delete failed");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const renderRow = (admin) => (
    <tr key={admin.id}>
      <td>
        <strong>{admin.name}</strong>
      </td>

      <td>{admin.email}</td>

      <td>{admin.phone || "-"}</td>

      <td>
        <span className="status-badge status-active">
          {admin.status || "active"}
        </span>
      </td>

      <td>
        <div className="action-buttons">
          <button
            className="action-btn"
            onClick={() => navigate(`/admin/edit-admin/${admin.id}`)}
          >
            <FiEdit2 />
          </button>

          <button className="action-btn" onClick={() => handleDelete(admin.id)}>
            <HiOutlineTrash />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="manage-page">
      <div className="manage-card">
        <CommonTable
          columns={columns}
          data={admins}
          renderRow={renderRow}
          tableClass="manage-table"
          leftContent={
            <button
              className="table-add-btn"
              onClick={() => navigate("/admin/add-admin")}
            >
              <FiPlus />
              Add Admin
            </button>
          }
        />
      </div>
    </div>
  );
};

export default ManageAdmin;
