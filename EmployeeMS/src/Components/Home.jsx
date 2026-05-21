import React, { useEffect, useState } from "react";
import api from "../utils/api";

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    adminCount();
    employeeCount();
    salaryCount();
    AdminRecords();
  }, []);

  // ✅ Admin Records
  const AdminRecords = () => {
    api.get("/auth/admin_records")
      .then((result) => {
        if (result.data.status) {
          setAdmins(result.data.result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  // ✅ Admin Count
  const adminCount = () => {
    api.get("/auth/admin_count")
      .then((result) => {
        if (result.data.status) {
          setAdminTotal(result.data.result[0].admin);
        }
      })
      .catch((err) => console.log(err));
  };

  // ✅ Employee Count
  const employeeCount = () => {
    api.get("/auth/employee_count")
      .then((result) => {
        if (result.data.status) {
          setEmployeeTotal(result.data.result[0].employee);
        }
      })
      .catch((err) => console.log(err));
  };

  // ✅ Salary Count
  const salaryCount = () => {
    api.get("/auth/salary_count")
      .then((result) => {
        if (result.data.status) {
          setSalaryTotal(result.data.result[0].salary);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="p-3 d-flex justify-content-around mt-3">
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Admin</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total: </h5>
            <h5>{adminTotal}</h5>
          </div>
        </div>

        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Employee</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>

        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Salary</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>${salaryTotal}</h5>
          </div>
        </div>
      </div>

      <div className="mt-4 px-5 pt-3">
        <h3>List of Admins</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.email}>
                <td>{a.email}</td>
                <td>
                  <button className="btn btn-info btn-sm me-2">Edit</button>
                  <button className="btn btn-warning btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;