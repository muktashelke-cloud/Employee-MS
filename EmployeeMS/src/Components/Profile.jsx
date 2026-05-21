import { useEffect, useState } from "react";
import api from "../utils/api";
import "./Profile.css";
import { createPortal } from "react-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const role = user?.role

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        if (res.data.status) {
          setUser(res.data.user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    console.log("UPDATED USER:", user);
    console.log("IMAGE PATH 👉", user?.image);
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        department: user.department || "",
        salary: user.salary || "",
        gender: user.gender || "",
        dob: user.dob ? user.dob.split("T")[0] : "",
        joining_date: user.joining_date ? user.joining_date.split("T")[0] : "",
      });
    }
  }, [user]);
  useEffect(() => {
    if (editMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [editMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put("/auth/update-profile", formData);
      console.log("RESPONSE 👉", res.data);

      if (res.data.status) {
        alert("Profile updated successfully ✅");

        // 🔥 MOST IMPORTANT FIX
        const updated = await api.get("/auth/me");

        console.log("NEW DATA 👉", updated.data.user);
        console.log("SENDING DATA 👉", formData);

        setUser(updated.data.user);

        setEditMode(false);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong ❌");
    }
  };

  // ✅ loading condition (ONLY ONCE)
  if (!user) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <>
    
      <div className="profile-page">
        <div className={`profile-page role-${user.role}`}>
          <div className="card p-3 shadow profile-card">
            <div className="profile-avatar">
              {user.image ? (
                <img
                  src={`http://localhost:5000/${user.image}`}
                  alt="profile"
                  className="profile-img"
                />
              ) : (
                <span className="avatar-text">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <hr />
            <>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>

              {user?.phone && (
                <p>
                  <strong>Phone:</strong> {user.phone}
                </p>
              )}
              {user?.address && (
                <p>
                  <strong>Address:</strong> {user.address}
                </p>
              )}

              {user.role === "employee" && (
                <>
                  {user.department && (
                    <p>
                      <strong>Department:</strong> {user.department}
                    </p>
                  )}
                  {user.salary !== null && (
                    <p>
                      <strong>Salary:</strong> ₹{user.salary}
                    </p>
                  )}
                  {user.gender && (
                    <p>
                      <strong>Gender:</strong> {user.gender}
                    </p>
                  )}
                  {user.dob && (
                    <p>
                      <strong>DOB:</strong>{" "}
                      {new Date(user.dob).toLocaleDateString()}
                    </p>
                  )}
                  {user.joining_date && (
                    <p>
                      <strong>Joining Date:</strong>{" "}
                      {new Date(user.joining_date).toLocaleDateString()}
                    </p>
                  )}
                </>
              )}

              <p>
                <strong>Role:</strong>
                <span className="badge bg-success ms-2 text-uppercase">
                  {user?.role || "—"}
                </span>
              </p>

              <button
                className="edit-btn mt-3"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </>
          </div>
        </div>
        {editMode &&
          createPortal(
            <>
              {/* BACKDROP */}
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  zIndex: 9998,
                }}
              />

              {/* MODAL */}
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="modal-content profile-modal p-3"
                  style={{
                    width: "720px",
                    maxWidth: "90%",
                    overflow: "hidden",
                    borderRadius: "16px",
                    margin: "auto",
                    padding: "24px",
                  }}
                >
                  <div className="modal-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Edit Profile</h5>
                    <button
                      onClick={() => setEditMode(false)}
                      style={{
                        border: "none",
                        background: "transparent",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-center mb-3">
                    {user.image ? (
                      <img
                        src={`http://localhost:5000/${user.image}`}
                        alt="profile"
                        className="profile-img"
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <div className="avatar-text">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleUpdate}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "7px",
                      }}
                    >
                      {/* ✅ COMMON FIELDS (ALL ROLES) */}

                      <div>
                        <label>Name</label>
                        <input
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label>Email</label>
                        <input
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label>Phone</label>
                        <input
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label>Address</label>
                        <input
                          className="form-control"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>

                      {/* 🔥 ONLY FOR EMPLOYEE */}
                      {role === "employee" && (
                        <>
                          <div>
                            <label>Department</label>
                            <input
                              className="form-control"
                              name="department"
                              value={formData.department}
                              onChange={handleChange}
                            />
                          </div>

                          <div>
                            <label>Salary</label>
                            <input
                              className="form-control"
                              name="salary"
                              value={formData.salary}
                              onChange={handleChange}
                            />
                          </div>

                          <div>
                            <label>Gender</label>
                            <select
                              className="form-control"
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>

                          <div>
                            <label>DOB</label>
                            <input
                              type="date"
                              className="form-control"
                              name="dob"
                              value={formData.dob}
                              onChange={handleChange}
                            />
                          </div>

                          <div>
                            <label>Joining Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="joining_date"
                              value={formData.joining_date}
                              onChange={handleChange}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </button>

                      <button type="submit" className="btn btn-success">
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>,
            document.body,
          )}
      </div>
    </>
  );
};

export default Profile;
