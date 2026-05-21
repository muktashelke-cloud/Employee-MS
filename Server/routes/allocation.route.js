import express from "express";
import { conUser, conEMS } from "../utils/db.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

// =========================
// ✅ ASSIGN PROJECT
// =========================
router.post("/", (req, res) => {
  let {
    employee_id,
    project_id,
    percentage,
    task_id,
    task_name,
    status,
    description,
    start_date,
    end_date,
    estimated_time,
  } = req.body;

  // 🔥 FORCE NUMBER conversion
  employee_id = Number(employee_id);
  project_id = Number(project_id);
  percentage = Number(percentage);

  const checkSql = `
    SELECT SUM(percentage) AS total 
    FROM allocations 
    WHERE employee_id = ?
  `;

  conEMS.query(checkSql, [employee_id], (err, result) => {
    if (err) return res.json(err);

    const total = Number(result[0].total) || 0;

    console.log("👉 DB TOTAL:", total);
    console.log("👉 NEW PERCENT:", percentage);

    if (total + percentage > 100) {
      return res.json({ message: "Over allocation ❌" });
    }

    const insertSql = `
    INSERT INTO allocations 
    (employee_id, project_id, percentage, task_id, task_name, status, description, start_date, end_date, estimated_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     `;

    conEMS.query(
      insertSql,
      [
        employee_id,
        project_id,
        percentage,
        task_id,
        task_name,
        status || "Pending",
        description,
        start_date,
        end_date,
        estimated_time,
      ],
      (err) => {
        if (err) return res.json(err);

        return res.json({
          status: true,
          message: "Allocated successfully ✅",
        });
      },
    );
  });
});

// =========================
// ✅ GET ALL
// =========================
router.get("/", (req, res) => {
  const sql = `
  SELECT 
    a.id,
    a.employee_id,
    a.project_id,
    e.name AS employee,
    p.name AS project,
    t.name AS task_name,
    a.percentage,
    a.task_id,
    a.status,
    a.description,
    a.start_date,
    a.end_date,
    a.estimated_time
  FROM allocations a
  LEFT JOIN employee e ON a.employee_id = e.id
  LEFT JOIN projects p ON a.project_id = p.id
  LEFT JOIN tasks t ON a.task_id = t.id
`;

  conEMS.query(sql, (err, result) => {
    if (err) return res.json({ status: false });
    return res.json({ status: true, data: result });
  });
});

// =========================
// ✅ DELETE
// =========================
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM allocations WHERE id = ?";

  conEMS.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ status: false });
    }

    return res.json({ status: true });
  });
});

// =========================
// ✅ UPDATE (🔥 FIXED)
// =========================
router.put("/:id", (req, res) => {
  const { employee_id, project_id, percentage, task_id, task_name, status } =
    req.body;

  const checkSql = `
    SELECT SUM(percentage) AS total 
    FROM allocations 
    WHERE employee_id = ? AND id != ?
  `;

  conEMS.query(checkSql, [employee_id, req.params.id], (err, result) => {
    if (err) return res.json(err);

    const total = result[0].total || 0;

    const newPercentage = Number(percentage);

    if (total + newPercentage > 100) {
      return res.json({ message: "Over allocation ❌" });
    }

    const updateSql = `
  UPDATE allocations 
  SET employee_id=?, 
      project_id=?, 
      percentage=?, 
      task_id=?, 
      task_name=?,
      status=? 
  WHERE id=?
`;

    conEMS.query(
      updateSql,
      [
        employee_id,
        project_id,
        percentage,
        task_id,
        task_name,
        status || "Pending",
        req.params.id,
      ],
      (err) => {
        if (err) {
          console.log(err);
          return res.json({ status: false });
        }
        return res.json({ status: true });
      },
    );
  });
});

// =========================
// ✅ GET TASKS BY PROJECT
// =========================
router.get("/project/:projectId", (req, res) => {
  const sql = "SELECT * FROM tasks WHERE project_id = ?";

  conEMS.query(sql, [req.params.projectId], (err, result) => {
    if (err) return res.json({ status: false });

    return res.json({ status: true, data: result });
  });
});
// =========================
// ✅ GET MY TASKS (EMPLOYEE)
// =========================
router.get("/my", verifyUser(["employee"]), (req, res) => {
  const empId = req.user.id;

  console.log("👉 EMPLOYEE ID:", empId);

  const sql = `
    SELECT 
      a.id,
      a.project_id,
      a.task_id,
      t.name AS task_name,   -- 🔥 FIX
      a.percentage,
      p.name AS project
    FROM allocations a
    LEFT JOIN projects p ON a.project_id = p.id
    LEFT JOIN tasks t ON a.task_id = t.id   
    WHERE a.employee_id = ?
  `;

  conEMS.query(sql, [empId], (err, result) => {
    if (err) {
      console.log("❌ ERROR:", err);
      return res.json({ status: false });
    }

    console.log("✅ MY TASKS:", result);

    return res.json({
      status: true,
      data: result,
    });
  });
});

export default router;
