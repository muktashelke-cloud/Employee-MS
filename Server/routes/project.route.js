import express from "express";
import { conEMS } from "../utils/db.js";

const router = express.Router();

// Create Project
router.post("/", (req, res) => {
  const { name, description } = req.body;

  const sql = "INSERT INTO projects (name, description) VALUES (?, ?)";

  conEMS.query(sql, [name, description], (err, result) => {
    if (err) return res.json(err);
    return res.json({ message: "Project created ✅" });
  });
});

// Get Projects
router.get("/", (req, res) => {
  conEMS.query("SELECT * FROM projects", (err, result) => {
    if (err) {
      console.log("PROJECT ERROR:", err);
      return res.json({ status: false });
    }

    return res.json({
      status: true,
      data: result,   // 🔥 IMPORTANT
    });
  });
});

export default router;