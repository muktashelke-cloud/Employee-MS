import express from "express";
import { conUser } from "../utils/db.js";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { sendResetEmail } from "../utils/mailer.js";
import verifyUser from "../middleware/verifyUser.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // 🔥 Step 1: check employee table
  const empSql = "SELECT * FROM employee WHERE email = ?";

  conUser.query(empSql, [email], async (err, empResult) => {
    if (err) return res.json({ status: false });

    // 👉 If employee found
    if (empResult.length > 0) {
      const user = empResult[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.json({ status: false, message: "Wrong password" });
      }

      const role = user.role || "employee";

      const token = jwt.sign(
        { id: user.id, email: user.email, roles: [role] },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
      });

      return res.json({
        status: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role,
        },
      });
    }

    // 🔥 Step 2: check admin table
    const adminSql = "SELECT * FROM admin WHERE email = ?";

    conUser.query(adminSql, [email], async (err, adminResult) => {
      if (err) return res.json({ status: false });

      if (adminResult.length === 0) {
        return res.json({
          status: false,
          message: "User not found",
        });
      }

      const user = adminResult[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({ status: false, message: "Wrong password" });
      }

      const role = user.role || "admin";

      const token = jwt.sign(
        { id: user.id, roles: [role] },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });

      return res.json({
        status: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role,
        },
      });
    });
  });
});

router.get("/category", (req, res) => {
  const sql = "SELECT * fROM category";
  conUser.query(sql, (err, result) => {
    if (err) {
      return res.json({ status: false, message: "Query Error" });
    }
    return res.json({ status: true, result: result });
  });
});

router.post("/add_category", (req, res) => {
  const sql = "INSERT INTO category (`name`) VALUES (?)";
  conUser.query(sql, [req.body.category], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

router.post(
  "/add_employee",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  async (req, res) => {
    // ✅ async added
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    let { name, email, password, phone, address, salary, category_id } =
      req.body;
    console.log("👉 RAW BODY:", req.body);

    // ❗ REQUIRED VALIDATION
    if (!name || !email || !password || !category_id) {
      return res.status(400).json({
        status: false,
        message: "Name, Email, Password and Department required",
      });
    }

    // HASH PASSWORD (VERY IMPORTANT 🔐)
    const hashedPassword = await bcrypt.hash(password, 10);

    //SAFE DEFAULT VALUES
    phone = phone || null;
    address = address && address.trim() !== "" ? address : "N/A";
    salary = salary ? Number(salary) : 0; // 🔥 null → 0 fix
    category_id = Number(category_id);
    console.log("👉 FINAL VALUES:", {
      name,
      email,
      password,
      phone,
      address,
      salary,
      category_id,
    });

    //IMAGE
    const image = req.files?.image
      ? "uploads/images/" + req.files.image[0].filename
      : "uploads/images/default.png";

    //DOCUMENTS
    const documents = req.files?.documents
      ? req.files.documents.map((file) => "uploads/documents/" + file.filename)
      : [];

    const docs = JSON.stringify(documents);

    // SQL QUERY
    const sql = `
      INSERT INTO employee
      (name,email,password,phone,address,salary,image,documents,category_id)
      VALUES (?,?,?,?,?,?,?,?,?)
    `;
    console.log("👉 DATA GOING TO DB:", [
      name,
      email,
      hashedPassword,
      phone,
      address,
      salary,
      image,
      docs,
      category_id,
    ]);
    conUser.query(
      sql,
      [
        name,
        email,
        hashedPassword, // 🔥 use hashed password
        phone,
        address,
        salary,
        image,
        docs,
        category_id,
      ],
      (err, result) => {
        if (err) {
          console.log("DB ERROR:", err);
          return res.status(500).json({
            status: false,
            error: err,
          });
        }

        return res.json({ status: true });
      },
    );
  },
);
router.get("/employee", (req, res) => {
  const sql = `
    SELECT e.*, c.name AS department
    FROM employee e
    LEFT JOIN category c ON e.category_id = c.id
  `;

  conUser.query(sql, (err, result) => {
    if (err) {
      console.log("DB ERROR:", err); // 👈 ADD THIS
      return res.json({ status: false, Error: "Query Error" });
    }

    return res.json({ status: true, result: result });
  });
});

router.get("/employee/:id", (req, res) => {
  const sql = "SELECT * FROM employee WHERE id=?";

  conUser.query(sql, [req.params.id], (err, result) => {
    if (err) return res.json({ status: false });

    const emp = result[0];

    if (!emp) {
      return res.json({ status: false, message: "Employee not found" });
    }

    emp.documents = emp.documents
      ? (() => {
          try {
            return JSON.parse(emp.documents);
          } catch {
            return [emp.documents];
          }
        })()
      : [];

    return res.json({
      status: true,
      result: emp,
    });
  });
});

router.put(
  "/edit_employee/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  (req, res) => {
    const id = req.params.id;

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    console.log("CATEGORY ID:", req.body.category_id);

    conUser.query(
      "SELECT image, documents FROM employee WHERE id = ?",
      [id],
      (err, result) => {
        if (err) return res.json({ status: false });

        const oldImage = result[0]?.image;
        const oldDocs = result[0]?.documents
          ? JSON.parse(result[0].documents)
          : [];

        // 🔥 DELETE OLD IMAGE
        if (req.files?.image && oldImage) {
          const path = `public/${oldImage}`;
          if (fs.existsSync(path)) {
            fs.unlinkSync(path);
          }
        }

        // 🔥 DELETE OLD DOCUMENTS
        if (req.files?.documents && oldDocs.length > 0) {
          oldDocs.forEach((doc) => {
            const path = `public/${doc}`;
            if (fs.existsSync(path)) {
              fs.unlinkSync(path);
            }
          });
        }

        // ✅ NEW IMAGE
        const image = req.files?.image
          ? "uploads/images/" + req.files.image[0].filename
          : oldImage;

        // ✅ NEW DOCUMENTS
        let documents;
        if (req.files?.documents) {
          const docs = req.files.documents.map(
            (file) => "uploads/documents/" + file.filename,
          );
          documents = JSON.stringify(docs);
        } else {
          documents = result[0]?.documents || null;
        }

        const sql = `
          UPDATE employee 
          SET name=?, salary=?, address=?, category_id=?, phone=?, image=?, documents=?
          WHERE id=?`;

        const values = [
          req.body.name || null,
          req.body.salary || null,
          req.body.address || null,
          req.body.category_id || null,
          req.body.phone || null,
          image,
          documents,
          id,
        ];

        conUser.query(sql, values, (err) => {
          if (err) {
            console.log("UPDATE ERROR:", err);
            return res.json({ status: false });
          }

          return res.json({ status: true });
        });
      },
    );
  },
);
router.delete("/delete_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from employee where id = ?";
  conUser.query(sql, [id], (err, result) => {
    if (err) return res.json({ status: false, message: "Query Error" + err });

    return res.json({ status: true, result: result });
  });
});

router.get("/admin_count", (req, res) => {
  const sql = "select count(id) as admin from admin";
  conUser.query(sql, (err, result) => {
    if (err) return res.json({ status: false, message: "Query Error" + err });
    return res.json({ status: true, result: result });
  });
});

router.get("/employee_count", (req, res) => {
  const sql = "select count(id) as employee from employee";
  conUser.query(sql, (err, result) => {
    if (err) return res.json({ status: false, message: "Query Error" + err });
    return res.json({ status: true, result: result });
  });
});

router.get("/salary_count", (req, res) => {
  const sql = "select sum(salary) as salary from employee";
  conUser.query(sql, (err, result) => {
    if (err) return res.json({ status: false, message: "Query Error" + err });
    return res.json({ status: true, result: result });
  });
});

router.get(
  "/admin_records",
  verifyUser(["admin", "superadmin"]),
  (req, res) => {
    const sql = "SELECT * FROM admin WHERE role = 'admin'";
    conUser.query(sql, (err, result) => {
      if (err) return res.json({ status: false, message: "Query Error" + err });
      return res.json({ status: true, result: result });
    });
  },
);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: true });
});
router.post(
  "/add_admin",
  verifyUser(["admin", "superadmin"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, email, password, phone, status } = req.body;

      // 1️⃣ Basic Validation
      if (!name || !email || !password) {
        return res.json({
          status: false,
          message: "Name, Email and Password are required",
        });
      }

      // 2️⃣ Check if admin already exists
      const checkSql = "SELECT * FROM admin WHERE email = ?";
      conUser.query(checkSql, [email], async (err, result) => {
        if (err) {
          console.log(err);
          return res.json({ status: false, message: "Database error" });
        }

        if (result.length > 0) {
          return res.json({
            status: false,
            message: "Admin already exists",
          });
        }

        //  Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        //  Image handling
        const image = req.file ? req.file.filename : null;

        // Insert Admin
        const insertSql = `
          INSERT INTO admin 
          (name, email, password, phone, status, role, image)
          VALUES (?, ?, ?, ?, ?, 'admin', ?)
        `;

        conUser.query(
          insertSql,
          [
            name,
            email,
            hashedPassword,
            phone || null,
            status || "active",
            image,
          ],
          (err2) => {
            if (err2) {
              console.log(err2);
              return res.json({
                status: false,
                message: "Insert failed",
              });
            }

            return res.json({
              status: true,
              message: "Admin added successfully",
            });
          },
        );
      });
    } catch (error) {
      console.log(error);
      return res.json({
        status: false,
        message: "Server error",
      });
    }
  },
);
router.get("/dashboard-count", (req, res) => {
  const result = {};

  // Total Admin (role = admin)
  conUser.query(
    "SELECT COUNT(*) AS total FROM admin WHERE role = 'admin'",
    (err, adminRes) => {
      if (err) return res.status(500).json(err);
      result.admin = adminRes[0].total;

      // Total HR (role = hr)
      conUser.query(
        "SELECT COUNT(*) AS total FROM admin WHERE role = 'hr'",
        (err, hrRes) => {
          if (err) return res.status(500).json(err);
          result.hr = hrRes[0].total;

          // Total Employees
          conUser.query(
            "SELECT COUNT(*) AS total FROM employee",
            (err, empRes) => {
              if (err) return res.status(500).json(err);
              result.emp = empRes[0].total;

              return res.json(result);
            },
          );
        },
      );
    },
  );
});

router.delete(
  "/delete_admin/:id",
  verifyUser(["admin", "superadmin"]),
  (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM admin WHERE id = ?";
    conUser.query(sql, [id], (err, result) => {
      if (err) {
        return res.json({ status: false, message: "Delete failed" });
      }
      return res.json({ status: true });
    });
  },
);
router.get("/admin/:id", (req, res) => {
  const sql = `
  SELECT 
    id,
    name,
    email,
    phone,
    status,
    image
  FROM admin 
  WHERE id = ?
`;
  conUser.query(sql, [req.params.id], (err, result) => {
    if (err) return res.json({ status: false });
    return res.json({ status: true, result: result[0] });
  });
});
router.put(
  "/edit_admin/:id",
  verifyUser(["admin", "superadmin"]),
  upload.fields([{ name: "image", maxCount: 1 }]),
  (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { name, email, phone, status } = req.body;

    let sql;
    let values;

    if (req.file) {
      sql = `
        UPDATE admin
        SET name=?, email=?, phone=?, status=?, image=?
        WHERE id=?
      `;
      values = [name, email, phone, status, req.file.filename, req.params.id];
    } else {
      sql = `
        UPDATE admin
        SET name=?, email=?, phone=?, status=?
        WHERE id=?
      `;
      values = [name, email, phone, status, req.params.id];
    }

    conUser.query(sql, values, (err) => {
      if (err) {
        console.log("SQL ERROR:", err);
        return res.json({ status: false });
      }
      return res.json({ status: true });
    });
  },
);

router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  const checkSql = "SELECT * FROM admin WHERE email = ?";
  conUser.query(checkSql, [email], (err, result) => {
    if (err) return res.json({ status: false, message: "DB error" });

    if (result.length === 0) {
      return res.json({ status: false, message: "Email not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 15 * 60 * 1000;
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const updateSql =
      "UPDATE admin SET reset_token=?, reset_token_expiry=? WHERE email=?";

    conUser.query(updateSql, [token, expiry, email], async (err2) => {
      if (err2)
        return res.json({ status: false, message: "Token save failed" });

      await sendResetEmail(email, resetLink);

      return res.json({
        status: true,
        message: "Reset link generated",
        token,
      });
    });
  });
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  const sql =
    "SELECT * FROM admin WHERE reset_token=? AND reset_token_expiry > ?";

  conUser.query(sql, [token, Date.now()], async (err, result) => {
    if (err) return res.json({ status: false });

    if (result.length === 0) {
      return res.json({
        status: false,
        message: "Token expired or invalid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateSql =
      "UPDATE admin SET password=?, reset_token=NULL, reset_token_expiry=NULL WHERE id=?";

    conUser.query(updateSql, [hashedPassword, result[0].id], () => {
      return res.json({
        status: true,
        message: "Password reset success",
      });
    });
  });
});
// get all HR users
router.get("/hr_records", verifyUser(["admin", "superadmin"]), (req, res) => {
  const sql =
    "SELECT id, name, email, phone, status FROM admin WHERE role = 'hr'";
  conUser.query(sql, (err, result) => {
    if (err) return res.json({ status: false, message: "Query error" });
    return res.json({ status: true, result });
  });
});
// add HR
router.post(
  "/add_hr",
  verifyUser(["admin", "superadmin"]),
  upload.single("image"),
  (req, res) => {
    const { name, email, phone, password, status } = req.body;

    if (!password) {
      return res.json({ status: false, message: "Password missing" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = `
    INSERT INTO admin (name, email, phone, password, role, status)
    VALUES (?, ?, ?, ?, 'hr', ?)
  `;

    conUser.query(sql, [name, email, phone, hashedPassword, status], (err) => {
      if (err) return res.json({ status: false });
      return res.json({ status: true });
    });
  },
);

//delete hr
router.delete(
  "/delete_hr/:id",
  verifyUser(["admin", "superadmin"]),
  (req, res) => {
    const sql = "DELETE FROM admin WHERE id=? AND role= 'hr'";
    conUser.query(sql, [req.params.id], (err) => {
      if (err) return res.json({ status: false });
      return res.json({ status: true });
    });
  },
);
// TOTAL EMPLOYEES (HR + ADMIN)
router.get("/hr/total-employees", (req, res) => {
  const sql = "SELECT COUNT(*) AS totalEmployees FROM employee";

  conUser.query(sql, (err, result) => {
    if (err) {
      return res.json({ status: false });
    }

    res.json({
      status: true,
      result: result[0],
    });
  });
});
// get single HR
router.get("/hr/:id", verifyUser(["admin", "superadmin"]), (req, res) => {
  const sql = "SELECT * FROM admin WHERE id=? AND role='hr'";

  conUser.query(sql, [req.params.id], (err, result) => {
    if (err || result.length === 0) return res.json({ status: false });

    return res.json({ status: true, result: result[0] });
  });
});

// update HR
router.put(
  "/edit_hr/:id",
  verifyUser(["admin", "superadmin"]),
  upload.single("image"),
  (req, res) => {
    try {
      // 🔍 DEBUG (optional but useful)
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      // ✅ Safe destructuring (no undefined crash)
      const {
        name,
        email,
        phone = "",
        status = "active",
        oldImage = null,
      } = req.body;

      // ✅ Image handling (new OR old)
      const image = req.file?.filename || oldImage || null;

      // ✅ SQL Query
      const sql = `
        UPDATE admin
        SET name=?, email=?, phone=?, status=?, image=?
        WHERE id=? AND role='hr'
      `;

      // ✅ Execute query (IMPORTANT FIX: image included)
      conUser.query(
        sql,
        [name, email, phone, status, image, req.params.id],
        (err) => {
          if (err) {
            console.log("SQL ERROR:", err); // 🔥 debugging
            return res.json({ status: false, message: "DB error" });
          }

          return res.json({
            status: true,
            message: "HR updated successfully",
          });
        },
      );
    } catch (err) {
      console.log("SERVER ERROR:", err);
      return res.status(500).json({ status: false });
    }
  },
);
router.get("/me", verifyUser(), (req, res) => {
  const { id, role, roles } = req.user;
  const finalRole = roles ? roles[0] : role;

  let sql = "";

  if (finalRole === "employee") {
    sql = `
    SELECT 
      e.id,
      e.name,
      e.email,
      e.phone,
      e.address,
      e.image,
      e.salary,
      e.gender,
      e.dob,
      e.joining_date,
      c.name AS department
    FROM employee e
    LEFT JOIN category c ON e.category_id = c.id
    WHERE e.id = ?
  `;
  } else if (
    finalRole === "admin" ||
    finalRole === "hr" ||
    finalRole === "superadmin"
  ) {
    sql = `
      SELECT id, name, email, phone, address, image
      FROM admin
      WHERE id = ?
    `;
  } else {
    return res.status(401).json({ status: false });
  }

  console.log("FINAL ROLE:", finalRole);
  console.log("SQL:", sql);
  console.log("ID:", id);

  conUser.query(sql, [id], (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ status: false });
    }

    if (result.length === 0) {
      return res.status(404).json({ status: false });
    }

    let imagePath = result[0].image;

    if (imagePath && !imagePath.startsWith("uploads/")) {
      imagePath = `uploads/images/${imagePath}`;
    }

    return res.json({
      status: true,
      user: {
        ...result[0],
        image: imagePath,
        role: finalRole,
      },
    });
  });
});

router.get("/hr/dashboard", verifyUser(["admin", "hr"]), (req, res) => {
  const sql = `
      SELECT
        (SELECT COUNT(*) FROM employee) AS totalEmployees
    `;

  conUser.query(sql, (err, result) => {
    if (err) {
      console.log("HR Dashboard Error:", err);
      return res.json({ status: false });
    }

    return res.json({
      status: true,
      result: {
        totalEmployees: result[0].totalEmployees,
        presentToday: 0,
        pendingRequests: 0,
        onLeave: 0,
      },
    });
  });
});
router.get("/recover-admin", async (req, res) => {
  const hash = await bcrypt.hash("admin123", 10);

  conUser.query(
    "INSERT INTO admin (email, password, role) VALUES (?, ?, 'admin')",
    ["admin@gmail.com", hash],
    (err) => {
      if (err) {
        console.log(err);
        return res.json({ status: false });
      }
      return res.json({ status: true });
    },
  );
});

router.get("/employee-profile", verifyUser(["employee"]), (req, res) => {
  const sql = "SELECT id, name, email, address FROM employee WHERE email = ?";
  conUser.query(sql, [req.user.email], (err, result) => {
    if (err) return res.json({ status: false });
    return res.json({ status: true, result: result[0] });
  });
});
router.get(
  "/employee-profile/:id",
  verifyUser(["admin", "hr", "superadmin"]),
  (req, res) => {
    const sql = `
    SELECT 
      e.id,
      e.name,
      e.email,
      e.phone,
      e.address,
      e.salary,
      e.image,
      c.name AS department
    FROM employee e
    LEFT JOIN category c
    ON e.category_id = c.id
    WHERE e.id = ?
  `;

    conUser.query(sql, [req.params.id], (err, result) => {
      if (err || result.length === 0) {
        return res.json({ status: false });
      }

      return res.json({
        status: true,
        user: {
          ...result[0],
          role: "employee",
        },
      });
    });
  },
);

router.get("/my-leaves", verifyUser(["employee"]), (req, res) => {
  const sql = `
    SELECT * FROM leave_requests 
    WHERE employee_email = ?
    ORDER BY id DESC
  `;

  conUser.query(sql, [req.user.email], (err, result) => {
    if (err) return res.json({ status: false });

    return res.json({
      status: true,
      result,
    });
  });
});
// HR - Get all leave requests
router.get("/all-leaves", verifyUser(["admin", "hr"]), (req, res) => {
  const sql = `
    SELECT * FROM leave_requests
    ORDER BY id DESC
  `;

  conUser.query(sql, (err, result) => {
    if (err) {
      console.log("Fetch All Leaves Error:", err);
      return res.json({ status: false });
    }

    return res.json({
      status: true,
      result,
    });
  });
});
// HR - Update Leave Status
router.put(
  "/update-leave-status/:id",
  verifyUser(["admin", "hr"]),
  (req, res) => {
    const { status } = req.body;

    const sql = `
    UPDATE leave_requests
    SET status = ?
    WHERE id = ?
  `;

    conUser.query(sql, [status, req.params.id], (err) => {
      if (err) {
        console.log("Update Leave Error:", err);
        return res.json({ status: false });
      }

      return res.json({ status: true });
    });
  },
);
router.put(
  "/change-password",
  verifyUser(["admin", "hr", "employee"]),
  async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const email = req.user.email;
    const role = req.user.role;

    let tableName;

    if (role === "admin" || role === "hr") {
      tableName = "admin";
    } else if (role === "employee") {
      tableName = "employee";
    } else {
      return res.json({ status: false, message: "Invalid role" });
    }

    const sql = `SELECT * FROM ${tableName} WHERE email = ?`;

    conUser.query(sql, [email], async (err, result) => {
      if (err) return res.json({ status: false });

      if (result.length === 0) {
        return res.json({ status: false, message: "User not found" });
      }

      const match = await bcrypt.compare(oldPassword, result[0].password);

      if (!match) {
        return res.json({ status: false, message: "Old password incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updateSql = `UPDATE ${tableName} SET password = ? WHERE email = ?`;

      conUser.query(updateSql, [hashedPassword, email], (err2) => {
        if (err2) return res.json({ status: false });

        res.json({ status: true, message: "Password updated successfully" });
      });
    });
  },
);
router.get(
  "/sidebar-menu",
  verifyUser(["superadmin", "admin", "hr", "employee"]),
  (req, res) => {
    const role = req.user.role;

    let menu = [];

    if (role === "superadmin") {
      menu = [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Employees", path: "/admin/employees" },
        { label: "Monthly Report", path: "/admin/monthly-report" },
        {
          label: "Attendance Management",
          path: "/admin/attendance-management",
        },
        { label: "Manage Admin", path: "/admin/manage-admin" },
        { label: "Manage HR", path: "/admin/manage-hr" },
      ];
    } else if (role === "admin") {
      menu = [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Employees", path: "/admin/employees" },
        { label: "Monthly Report", path: "/admin/monthly-report" },
        {
          label: "Attendance Management",
          path: "/admin/attendance-management",
        },
      ];
    } else if (role === "hr") {
      menu = [
        { label: "Dashboard", path: "/hr/dashboard" },
        { label: "Employees", path: "/hr/employees" },
        { label: "Leaves", path: "/hr/leaves" },
        { label: "Attendance Management", path: "/hr/attendance-management" },
      ];
    } else if (role === "employee") {
      menu = [
        { label: "Dashboard", path: "/employee/dashboard" },
        { label: "Profile", path: "/employee/profile" },
        { label: "Leave", path: "/employee/leave" },
        { label: "Attendance", path: "/employee/attendance" },
      ];
    }

    res.json({
      status: true,
      role,
      menu,
    });
  },
);
router.get(
  "/all-employees",
  verifyUser(["admin", "hr", "superadmin"]),
  (req, res) => {
    const sql = "SELECT id, name FROM employee";

    conUser.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ status: false, message: "Database error" });
      }

      return res.json({
        status: true,
        result: result,
      });
    });
  },
);
// 🔥 NEW API - Employee assigned projects + tasks
router.get("/employee/assigned/:id", (req, res) => {
  const employeeId = req.params.id;

  const sql = `
  SELECT DISTINCT 
    p.id AS project_id,
    p.name AS project_name
  FROM allocations a
  JOIN projects p ON p.id = a.project_id
  WHERE a.employee_id = ?
`;

  conUser.query(sql, [employeeId], (err, result) => {
    if (err) {
      console.log("Assigned Fetch Error:", err);
      return res.json({ status: false });
    }

    return res.json({
      status: true,
      data: result,
    });
  });
});
router.put("/update-profile", verifyUser(), (req, res) => {
  const { id, role, roles } = req.user;
  const finalRole = roles ? roles[0] : role;

  const {
    name,
    email,
    phone,
    address,
    department,
    salary,
    gender,
    dob,
    joining_date,
  } = req.body;

  let sql = "";
  let values = [];

  if (finalRole === "employee") {
    sql = `
  UPDATE employee
  SET 
    name = ?, 
    email = ?, 
    phone = ?, 
    address = ?,
    department = ?,
    salary = ?,
    gender = ?,
    dob = ?,
    joining_date = ?
  WHERE id = ?
`;

    values = [
      name,
      email,
      phone,
      address,
      department,
      salary,
      gender,
      dob,
      joining_date,
      id,
    ];
  } else {
    sql = `
      UPDATE admin
      SET name = ?, email = ?, phone = ?, address = ?
      WHERE id = ?
    `;
    values = [name, email, phone, address, id];
  }

  conUser.query(sql, values, (err) => {
    if (err) {
      console.log("UPDATE ERROR:", err);
      return res.status(500).json({ status: false });
    }

    // ✅ UPDATED USER FETCH करा (IMPORTANT)
    let selectSql =
      finalRole === "employee"
        ? "SELECT * FROM employee WHERE id = ?"
        : "SELECT * FROM admin WHERE id = ?";

    conUser.query(selectSql, [id], (err, result) => {
      if (err) {
        console.log("FETCH ERROR:", err);
        return res.status(500).json({ status: false });
      }

      return res.json({
        status: true,
        user: result[0], // 🔥 THIS FIXES YOUR ISSUE
      });
    });
  });
});

export default router;
