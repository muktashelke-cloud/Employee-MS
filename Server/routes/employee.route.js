import express from "express";
import { conUser } from "../utils/db.js";
const router = express.Router();

// ✅ Employee Tasks API
router.get("/tasks/:id", (req, res) => {
  const empId = req.params.id;

  const sql = `
    SELECT 
      p.name AS project_name,
      t.name AS task_name,
      a.percentage
    FROM allocations a
    JOIN projects p ON a.project_id = p.id
    JOIN tasks t ON a.task_id = t.id
    WHERE a.employee_id = ?
  `;

  conUser.query(sql, [empId], (err, result) => {
    if (err) {
      console.log("ERROR:", err);
      return res.json({ status: false });
    }
    return res.json(result);
  });
});
router.put("/update-percentage", (req, res) => {
  const { task_id, percentage } = req.body;

  const sql = `
    UPDATE allocations 
    SET percentage = ? 
   WHERE task_id = ? AND employee_id = ?
  `;

  conUser.query(sql, [percentage, task_id], (err, result) => {
    if (err) return res.json({ status: false, error: err });

    return res.json({ status: true, message: "Updated" });
  });
});

export default router;