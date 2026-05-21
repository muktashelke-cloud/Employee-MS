import express from "express";
import { conUser, conEMS } from "../utils/db.js";
import { Parser } from "json2csv";

const router = express.Router();

router.get("/monthly-report", (req, res) => {
  console.log("MONTHLY REPORT API CALLED");
  const m = req.query.month;
  const year = req.query.year;
  const paddedMonth = String(m).padStart(2, "0");

  const startDate = `${year}-${paddedMonth}-01`;
  const endDate = new Date(year, m, 0).toISOString().split("T")[0];

  const sql = `
SELECT
e.name,
DAY(a.date) AS day,
a.status,
IFNULL(TIME_TO_SEC(a.working_hours), 0) AS working_seconds
FROM attendance a
JOIN employee e ON a.employee_id = e.id
WHERE a.date BETWEEN ? AND ?
ORDER BY e.name
`;

  conUser.query(sql, [startDate, endDate], (err, result) => {
    console.log("Month:", m, "Year:", year);

    if (err) return res.json(err);
    console.log("RAW RESULT:", result);
    console.log("SQL RESULT:", result);

    const employees = {};

    result.forEach((row) => {
      if (!employees[row.name]) {
        employees[row.name] = {
          days: new Array(31).fill("A"),
          total: 0,
        };
      }

      if (row.day) {
        let status = "A";

        if (row.status === "present") status = "P";
        if (row.status === "late") status = "L";
        if (row.status === "halfday") status = "H";

        employees[row.name].days[row.day - 1] = status;

        // ⭐ WORKING HOURS CALCULATION
        console.log("WORKING SECONDS:", row.working_seconds);
        const hours = row.working_seconds ? row.working_seconds / 3600 : 0;

        employees[row.name].total += hours;
      }
    });

    const csvData = [];

    Object.keys(employees).forEach((name) => {
      const row = { Employee: name };

      employees[name].days.forEach((val, i) => {
        row[i + 1] = val;
      });

      row["Total Hours"] = employees[name].total.toFixed(2);

      csvData.push(row);
    });
    // 🔥 IMPORTANT FIX
    if (result.length === 0) {
      console.log("❌ NO DATA FOUND");

      return res.json({
        message: "No attendance data found",
        data: [],
      });
    }
    const employeesArray = Object.keys(employees).map((name) => ({
      name,
      days: employees[name].days,
      total: employees[name].total.toFixed(2),
    }));

    res.json({ data: employeesArray });
  });
});
router.get("/monthly-report-csv", (req, res) => {
  const m = req.query.month;
  const year = req.query.year;

  const paddedMonth = String(m).padStart(2, "0");

  const startDate = `${year}-${paddedMonth}-01`;
  const endDate = `${year}-${paddedMonth}-31`;

 const sql = `
SELECT
e.name,
DAY(a.date) AS day,
a.status,
IFNULL(TIME_TO_SEC(a.working_hours), 0) AS working_seconds
FROM attendance a
JOIN employee e ON a.employee_id = e.id
WHERE a.date BETWEEN ? AND ?
ORDER BY e.name
`;

  conUser.query(sql, [startDate, endDate], (err, result) => {
    if (err) return res.json(err);

    const employees = {};

    result.forEach((row) => {
      if (!employees[row.name]) {
        employees[row.name] = {
          days: new Array(31).fill("A"),
          total: 0,
        };
      }

      if (row.day) {
        let status = "A";

        if (row.status === "present") status = "P";
        if (row.status === "late") status = "L";
        if (row.status === "halfday") status = "H";

        employees[row.name].days[row.day - 1] = status;

        const hours = row.working_seconds ? row.working_seconds / 3600 : 0;

        employees[row.name].total += hours;
      }
    });

    const csvData = [];

    Object.keys(employees).forEach((name) => {
      const row = { Employee: name };

      employees[name].days.forEach((val, i) => {
        row[i + 1] = val;
      });

      row["Total Hours"] = employees[name].total.toFixed(2);

      csvData.push(row);
    });

    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment("monthly-report.csv");
    res.send(csv);
  });
});
router.get("/latest-month", (req, res) => {
  const sql = `
    SELECT 
      MONTH(date) as month, 
      YEAR(date) as year
    FROM attendance
    ORDER BY date DESC
    LIMIT 1
  `;

  conUser.query(sql, (err, rows) => {
    if (err) {
      console.log("LATEST ERROR:", err); // 👈 IMPORTANT
      return res.status(500).json({ message: "Error fetching latest month" });
    }

    if (!rows || rows.length === 0) {
      return res.json({ month: null, year: null });
    }

    res.json({
      month: rows[0].month,
      year: rows[0].year,
    });
  });
});

export default router;
