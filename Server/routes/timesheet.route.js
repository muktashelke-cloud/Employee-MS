import express from "express";
import { conEMS } from "../utils/db.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

// =========================
// ✅ SUBMIT TIMESHEET
// =========================
router.post("/", verifyUser(["employee"]), (req, res) => {
  const { project_id, task_id, hours, date } = req.body;
  const employee_id = req.user.id;

  const checkSql = `
    SELECT * FROM allocations 
    WHERE employee_id = ? AND project_id = ?
  `;

  conEMS.query(checkSql, [employee_id, project_id], (err, result) => {
    if (err) return res.json(err);

    if (result.length === 0) {
      return res.json({ message: "Project not assigned ❌" });
    }

    const duplicateSql = `
      SELECT * FROM timesheets 
      WHERE employee_id=? AND project_id=? AND date=?
    `;

    conEMS.query(
      duplicateSql,
      [employee_id, project_id, date],
      (err, dupResult) => {
        if (err) return res.json(err);

        if (dupResult.length > 0) {
          return res.json({
            message: "Timesheet already submitted ❌",
          });
        }

        const insertSql = `
                   INSERT INTO timesheets 
                   (employee_id, project_id, task_id, hours, date)
                   VALUES (?, ?, ?, ?, ?)
                   `;

        conEMS.query(
          insertSql,
          [employee_id, project_id, task_id, hours, date],
          (err) => {
            if (err) return res.json(err);

            return res.json({
              status: true,
              message: "Timesheet submitted ✅",
            });
          },
        );
      },
    );
  });
});

// =========================
// ✅ GET MY TIMESHEET (🔥 FIRST)
// =========================
router.get("/my", verifyUser(["employee"]), (req, res) => {
  const empId = req.user.id;

  const sql = `
SELECT 
  ts.id,
  ts.date,
  ts.hours,
  ts.project_id,
  ts.remarks,
  p.name AS project,
  tk.name AS task_name
FROM timesheets ts
LEFT JOIN projects p ON ts.project_id = p.id
LEFT JOIN tasks tk ON ts.task_id = tk.id
WHERE ts.employee_id = ?
`;
  conEMS.query(sql, [empId], (err, result) => {
    if (err) {
      console.log("❌ ADMIN TIMESHEET ERROR:", err);
      return res.json({ status: false, error: err });
    }

    return res.json({
      status: true,
      data: result,
    });
  });
});

// =========================
// ✅ GET ALL TIMESHEETS (ADMIN)
// =========================
router.get("/all", verifyUser(["admin", "superadmin", "hr"]), (req, res) => {
  const sql = `
    SELECT 
      ts.id,
      ts.date,
      ts.hours,
      ts.status,
      ts.remarks,
      e.name AS employee_name,
      p.name AS project,
      tk.name AS task_name
    FROM timesheets ts
    LEFT JOIN employee e ON ts.employee_id = e.id
    LEFT JOIN projects p ON ts.project_id = p.id
    LEFT JOIN tasks tk ON ts.task_id = tk.id
    ORDER BY ts.date DESC
  `;

  conEMS.query(sql, (err, result) => {
    if (err) {
      console.log("❌ ERROR:", err);
      return res.json({ status: false, error: err.sqlMessage });
    }

    return res.json({
      status: true,
      data: result,
    });
  });
});
// =========================
// ✅ GET EMPLOYEE ALLOCATION
// =========================
router.get("/employee/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT a.*, p.project_name
    FROM allocations a
    JOIN projects p ON a.project_id = p.id
    WHERE a.employee_id = ?
  `;

  conEMS.query(sql, [id], (err, result) => {
    if (err) {
      console.log("Allocation Error:", err);
      return res.json({ status: false });
    }

    return res.json({ status: true, data: result });
  });
});

// =========================
// ✅ GET TIMESHEET BY ID (🔥 LAST)
// =========================
router.get("/:employee_id", (req, res) => {
  const { employee_id } = req.params;

  const sql = `
SELECT 
  ts.id,
  ts.date,
  ts.hours,
  ts.project_id,
  p.name AS project,
  tk.name AS task_name
FROM timesheets ts
LEFT JOIN projects p ON ts.project_id = p.id
LEFT JOIN tasks tk ON ts.task_id = tk.id
WHERE ts.employee_id = ?
`;

  conEMS.query(sql, [employee_id], (err, result) => {
    if (err) {
      console.log("❌ TIMESHEET ERROR:", err);
      return res.json({ status: false });
    }

    return res.json({
      status: true,
      data: result,
    });
  });
});
router.put("/:id", (req, res) => {
  const { project_id, task_id, hours, date } = req.body;

  const sql = `
    UPDATE timesheets 
    SET project_id = ?, task_id = ?, hours = ?, date = ?
    WHERE id = ?
  `;

  conEMS.query(
    sql,
    [project_id, task_id, hours, date, req.params.id],
    (err, result) => {
      if (err) {
        console.log("UPDATE ERROR:", err);
        return res.status(500).json({ status: false });
      }
      return res.json({ status: true });
    },
  );
});
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM timesheets WHERE id = ?";

  conEMS.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.log("DELETE ERROR:", err);
      return res.status(500).json({ status: false });
    }
    return res.json({ status: true });
  });
});

router.put("/update-status/:id", (req, res) => {
  console.log("BODY 👉", req.body);
  const { status, remarks } = req.body;

  const sql = `
    UPDATE timesheets 
    SET status = ?, remarks = ? 
    WHERE id = ?
  `;

  conEMS.query(sql, [status, remarks || null, req.params.id], (err, result) => {
    if (err) return res.json(err);
    return res.json({ Status: "Success" });
  });
});
export default router;
