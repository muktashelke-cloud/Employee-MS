import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import "./UserForm.css";
import CommonForm from "../Components/CommonForm/CommonForm";

import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  IndianRupee,
  Building2,
  ImagePlus,
  FileText,
} from "lucide-react";

const UserForm = ({ type }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { user } = useContext(AuthContext); // ✅ auth user

  const [errors, setErrors] = useState({});

  // ✅ FIX: rename form state
  const [formUser, setFormUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    salary: "",
    category_id: "",
    status: "active",
    image: null,
    oldImage: "",
    documents: [],
  });

  const [departments, setDepartments] = useState([]);
  console.log(departments);

  useEffect(() => {
    if (type === "employee") fetchDepartments();
    if (id) fetchUser();
  }, [id, type]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/auth/category");
      if (res.data.status) setDepartments(res.data.result);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get(`/auth/${type}/${id}`);

      if (res.data.status && res.data.result) {
        const data = Array.isArray(res.data.result)
          ? res.data.result[0]
          : res.data.result;

        // 🔥 documents safe parsing
        let docs = [];

        if (data?.documents) {
          try {
            // case: JSON string
            docs = JSON.parse(data.documents);

            // जर parse केल्यावर object मिळाला तर array मध्ये convert
            if (!Array.isArray(docs)) {
              docs = [docs];
            }
          } catch {
            // case: single string
            docs = [data.documents];
          }
        }

        // ✅ set state
        setFormUser({
          name: data.name || "",
          email: data.email || "",
          password: "",
          phone: data.phone || "",
          address: data.address || "",
          salary: data.salary || "",
          category_id: data.category_id || "",
          status: data.status || "active",
          image: null,
          oldImage: data.image || "",
          documents: docs, // ✅ final correct
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ VALIDATION
  const validate = () => {
    let newErrors = {};

    if (!formUser.name.trim()) {
      newErrors.name = "Name required";
    }

    if (!formUser.email.trim()) {
      newErrors.email = "Email required";
    }

    if (formUser.email && !/\S+@\S+\.\S+/.test(formUser.email)) {
      newErrors.email = "Invalid email";
    }

    if (!id && !formUser.password) {
      newErrors.password = "Password is required";
    }

    if (formUser.phone && String(formUser.phone).trim().length !== 10) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (formUser.salary && isNaN(formUser.salary)) {
      newErrors.salary = "Salary must be number";
    }

    console.log("VALIDATION ERRORS:", newErrors);

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ✅ SUBMIT
 const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("submit started");

  const isValid = validate();

  console.log(isValid);

  if (!isValid) {
    console.log(errors);
    return;
  }

  console.log(formUser);

  try {
    console.log("before api call");
    console.log(formUser.category_id);

    const formData = new FormData();

    // BASIC FIELDS
    formData.append("name", formUser.name);
    formData.append("email", formUser.email);
    formData.append("status", formUser.status || "active");

    // PHONE
    if (formUser.phone) {
      formData.append("phone", formUser.phone);
    }

    // EMPLOYEE EXTRA FIELDS
    if (type === "employee") {

      if (formUser.address) {
        formData.append("address", formUser.address);
      }

      if (formUser.salary) {
        formData.append("salary", formUser.salary);
      }

      if (formUser.category_id) {
        formData.append("category_id", formUser.category_id);
      }

      console.log(
        "CATEGORY IN FORMDATA:",
        formData.get("category_id")
      );
    }

    // PASSWORD
    if (!id) {
      formData.append("password", formUser.password);
    }

    // IMAGE
    if (formUser.image) {
      formData.append("image", formUser.image);
    }

    // OLD IMAGE
    if (id && formUser.oldImage) {
      formData.append("oldImage", formUser.oldImage);
    }

    // DOCUMENTS
    if (
      type === "employee" &&
      formUser.documents.length > 0 &&
      formUser.documents[0] instanceof File
    ) {
      formUser.documents.forEach((doc) => {
        formData.append("documents", doc);
      });
    }

    // API CALL
    let res = id
      ? await api.put(`/auth/edit_${type}/${id}`, formData)
      : await api.post(`/auth/add_${type}`, formData);

    console.log("after api call");
    console.log(res);

    if (res.data.status) {

  alert(`${type} saved successfully`);

  // NAVIGATION

  if (type === "employee") {

    if (user?.role === "employee") {

      navigate("/employee/profile");

    } else if (user?.role === "hr") {

      navigate("/hr/employees");

    } else if (user?.role === "admin") {

      navigate("/admin/employees");
    }

  } else if (type === "hr") {

    navigate("/admin/manage-hr");

  } else if (type === "admin") {

    navigate("/admin/manage-admin");
  }

} else {

  alert("Operation failed");

}

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};

  return (
    <CommonForm
      title={
  id && user?.role === "employee"
    ? "Edit Profile"
    : id
    ? `Update ${type}`
    : `Add ${type}`
}
      onSubmit={handleSubmit}
      submitText={
  id && user?.role === "employee"
    ? "Save Changes"
    : id
    ? "Update Details"
    : `Add ${type}`
}
    >
      <div className="input-icon">
        <User size={17} className="form-icon" />

        <input
          type="text"
          placeholder="Enter Name"
          className="commonform-input icon-input"
          value={formUser.name}
          onChange={(e) =>
            setFormUser({
              ...formUser,
              name: e.target.value,
            })
          }
        />
      </div>

      <div className="input-icon">
        <Mail size={17} className="form-icon" />

        <input
          type="email"
          placeholder="Enter Email"
          className="commonform-input icon-input"
          value={formUser.email}
          onChange={(e) =>
            setFormUser({
              ...formUser,
              email: e.target.value,
            })
          }
        />
      </div>

      {!id && (
        <div className="input-icon">
          <Lock className="form-icon" size={18} />

          <input
            type="password"
            placeholder="Password"
            className="commonform-input icon-input"
            value={formUser.password}
            onChange={(e) =>
              setFormUser({
                ...formUser,
                password: e.target.value,
              })
            }
          />
        </div>
      )}

      <div className="input-icon">
        <input
          type="text"
          placeholder="Phone"
          className="commonform-input"
          value={formUser.phone}
          onChange={(e) =>
            setFormUser({
              ...formUser,
              phone: e.target.value,
            })
          }
        />
      </div>

      {type === "employee" && (
        <>
          <div className="input-icon">
            <input
              type="text"
              placeholder="Address"
              className="commonform-input"
              value={formUser.address}
              onChange={(e) =>
                setFormUser({
                  ...formUser,
                  address: e.target.value,
                })
              }
            />
          </div>

          {/* Salary */}
          <div className="input-icon">
            <input
              type="number"
              placeholder="Salary"
              className="commonform-input"
              value={formUser.salary}
              onChange={(e) =>
                setFormUser({
                  ...formUser,
                  salary: e.target.value,
                })
              }
            />
          </div>

          {/* Category Dropdown */}
          <div className="input-icon">
            <select
              className="commonform-select"
              value={formUser.category_id}
              onChange={(e) =>
                setFormUser({
                  ...formUser,
                  category_id: e.target.value,
                })
              }
            >
              <option value="">Select Department</option>

              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      <div className="input-icon">
        <input
          type="file"
          className="commonform-file"
          onChange={(e) =>
            setFormUser({
              ...formUser,
              image: e.target.files[0],
            })
          }
        />
      </div>

      {type === "employee" && (
        <div className="input-icon">
          <input
            type="file"
            multiple
            className="commonform-file"
            onChange={(e) =>
              setFormUser({
                ...formUser,
                documents: Array.from(e.target.files),
              })
            }
          />
        </div>
      )}
    </CommonForm>
  );
};

export default UserForm;
