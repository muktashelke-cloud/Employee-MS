import express from "express";
import { conEMS } from "../utils/db.js";

const router = express.Router(); // ✅ IMPORTANT

// GET tasks by project
router.get("/project/:id", (req, res) => {
  const sql = "SELECT * FROM tasks WHERE project_id = ?";

  conUser.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.log("TASK ERROR:", err); // ✅ DEBUG
      return res.json({ status: false });
    }
    return res.json({ status: true, data: result });
  });
});

export default router; // ✅ IMPORTANT