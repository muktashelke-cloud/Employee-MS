import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import "./ManageHR.css";
import { Pencil, Trash2 } from "lucide-react";
import CommonTable from "../Components/CommonTable/CommonTable";


const ManageHR = () => {
  const [hrs, setHrs] = useState([]);
  const role = localStorage.getItem("role");

  const fetchHR = async () => {
    try {
      const res = await api.get("/auth/hr_records");

      if (res.data.status) {
        setHrs(res.data.result);
      } else {
        setHrs([]);
      }
    } catch (err) {
      console.log("Fetch HR Error:", err);
    }
  };

  useEffect(() => {
    fetchHR();
  }, []);

  const deleteHR = async (id) => {
    if (!window.confirm("Delete HR?")) return;

    try {
      const res = await api.delete(`/auth/delete_hr/${id}`);

      if (res.data.status) {
        fetchHR();
      }
    } catch (err) {
      console.log("Delete HR Error:", err);
    }
  };
  return (
    <div className="managehr-page">
      <div className="managehr-card">
        <CommonTable
          tableClass="managehr-table"
          leftContent={
            (role === "admin" || role === "superadmin") && (
              <Link to="/admin/add-hr" className="add-hr-btn">
                + Add HR
              </Link>
            )
          }
          columns={["#", "Name", "Email", "Phone", "Status", "Action"]}
          data={hrs}
          renderRow={(hr, index) => (
            <tr key={hr.id}>
            <td className="col-index">{index + 1}</td>

              <td>{hr.name}</td>

              <td className="col-email">{hr.email}</td>

             <td className="col-phone">{hr.phone}</td>

              <td>
                <span className="status-badge status-active">{hr.status}</span>
              </td>

              <td>
                <div className="action-buttons">
                  <Link to={`/admin/edit-hr/${hr.id}`} className="action-btn">
                    <Pencil size={18} />
                  </Link>

                  <button
                    type="button"
                    className="action-btn"
                    onClick={() => deleteHR(hr.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};

export default ManageHR;
