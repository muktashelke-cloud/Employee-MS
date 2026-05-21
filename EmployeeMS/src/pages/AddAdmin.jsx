import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const AddAdmin = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    status: "active"
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name || !data.email || !data.password) {
      return alert("Please fill all required fields");
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("status", data.status);
    if (image) formData.append("image", image);

    try {
      const res = await api.post("/auth/add_admin", formData);

      if (res.data.status) {
        alert("Admin added successfully");
        navigate("/admin/admins");
      } else {
        alert(res.data.message || "Error");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className="form-container">
      <h2>Add Admin</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />

        <select name="status" onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button type="submit">Add Admin</button>
      </form>
    </div>
  );
};

export default AddAdmin;