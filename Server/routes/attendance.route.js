import express from "express";
import { conEMS, conUser } from "../utils/db.js";
import verifyUser from "../middleware/verifyUser.js";
import { Parser } from "json2csv";
import upload from "../middleware/upload.js";

const router = express.Router();

/*=== PUNCH IN ===*/
router.post(
  "/punch-in",
  verifyUser(["employee", "hr", "admin"]),
  (req, res) => {
    const employee_id = req.user.id;

    const sql = `
      SELECT id FROM attendance
      WHERE employee_id = ?
      AND date = CURDATE()
    `;

    conUser.query(sql, [employee_id], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          status: false,
          message: err.message,
        });
      }

      if (result.length > 0) {
        return res.json({
          status: false,
          message: "Already punched in today",
        });
      }

      const insertSql = `
        INSERT INTO attendance
        (employee_id, date, status, punch_in)
        VALUES (?, CURDATE(), 'present', CURTIME())
      `;

      conUser.query(insertSql, [employee_id], (err2) => {
        if (err2) {
          console.log(err2);

          return res.json({
            status: false,
            message: err2.message,
          });
        }

        return res.json({
          status: true,
          message: "Punch In Successful",
        });
      });
    });
  },
);
router.post(
  "/punch-out",
  verifyUser(["employee", "hr", "admin"]),
  (req, res) => {
    const employee_id = req.user.id;

    // today's attendance check
    const checkSql = `
      SELECT *
      FROM attendance
      WHERE employee_id = ?
      AND DATE(date) = CURDATE()
    `;

    conUser.query(checkSql, [employee_id], (err, result) => {
      if (err) {
        console.log(err);

        return res.json({
          status: false,
          message: err.message,
        });
      }

      // no attendance found
      if (result.length === 0) {
        return res.json({
          status: false,
          message: "Please punch in first",
        });
      }

      // already punched out
      if (result[0].punch_out && result[0].punch_out !== "00:00:00") {
        return res.json({
          status: false,
          message: "Already punched out",
        });
      }

      // update attendance
      const updateSql = `
        UPDATE attendance
        SET
          punch_out = CURTIME(),
          working_hours = TIMEDIFF(CURTIME(), punch_in)
        WHERE id = ?
      `;

      conUser.query(updateSql, [result[0].id], (err2, updateResult) => {
        if (err2) {
          console.log("Punch Out Update Error:", err2);

          return res.json({
            status: false,
            message: err2.message,
          });
        }

        console.log("Update Result:", updateResult);

        if (updateResult.affectedRows === 0) {
          return res.json({
            status: false,
            message: "Punch out failed",
          });
        }

        return res.json({
          status: true,
          message: "Punch out successful",
        });
      });
    });
  },
);
/* ================= TODAY PRESENT ================= */
router.get(
  "/today-count",
  verifyUser(["superadmin", "admin", "hr"]),
  (req, res) => {
    const sql =
      "SELECT COUNT(*) AS presentToday FROM attendance WHERE date = CURDATE() AND status='Present'";

    conUser.query(sql, (err, result) => {
      if (err) return res.json({ status: false });
      res.json({ status: true, result: result[0] });
    });
  },
);

/* ================= ON LEAVE ================= */
router.get(
  "/on-leave-count",
  verifyUser(["superadmin", "admin", "hr"]),
  (req, res) => {
    const sql =
      "SELECT COUNT(*) AS onLeave FROM attendance WHERE date = CURDATE() AND status='Leave'";

    conUser.query(sql, (err, result) => {
      if (err) return res.json({ status: false });
      res.json({ status: true, result: result[0] });
    });
  },
);

/* ================= PENDING LEAVES ================= */
router.get(
  "/pending-leaves",
  verifyUser(["superadmin", "admin", "hr"]),
  (req, res) => {
    const sql =
      "SELECT COUNT(*) AS pending FROM leave_requests WHERE status='Pending'";

    conUser.query(sql, (err, result) => {
      if (err) return res.json({ status: false });
      res.json({ status: true, result: result[0] });
    });
  },
);

router.get(
  "/summary",
  verifyUser(["superadmin", "admin", "hr"]),
  (req, res) => {
    const sql = `
    SELECT
      COALESCE(SUM(status = 'present'), 0) AS present,
      COALESCE(SUM(status = 'absent'), 0) AS absent,
      COALESCE(SUM(status = 'leave'), 0) AS leave_count,
      COALESCE(SUM(status = 'late'), 0) AS late
    FROM attendance
    WHERE date = CURDATE()
  `;

    conUser.query(sql, (err, result) => {
      if (err) {
        console.log("Attendance Summary Error:", err);
        return res.json({ status: false });
      }

      res.json({
        status: true,
        result: result[0],
      });
    });
  },
);
router.get("/all-leaves", (req, res) => {
  const sql = `
SELECT
  lr.id,
  lr.employee_email,
  lr.leave_type,
  lr.from_date,
  lr.to_date,
  lr.reason,
  lr.document,
  lr.reject_reason,
  lr.status
FROM leave_requests lr
`;

  conUser.query(sql, (err, result) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.json({ status: false, message: err.message });
    }

    return res.json({ status: true, result });
  });
});
router.put("/approve-leave/:id", (req, res) => {
  const { id } = req.params;

  const leaveSql = "SELECT * FROM leave_requests WHERE id = ?";

  conUser.query(leaveSql, [id], (err, leaveResult) => {
    if (err || leaveResult.length === 0) {
      return res.json({ status: false });
    }

    const leave = leaveResult[0];

    const updateLeaveSql =
      "UPDATE leave_requests SET status = 'approved' WHERE id = ?";

    conUser.query(updateLeaveSql, [id], (err2) => {
      if (err2) return res.json({ status: false });

      const empSql = "SELECT id FROM employee WHERE email = ?";

      conUser.query(empSql, [leave.employee_email], (err3, empResult) => {
        if (err3 || empResult.length === 0) {
          return res.json({ status: false });
        }

        const employee_id = empResult[0].id;

        const fromDate = new Date(leave.from_date);
        const toDate = new Date(leave.to_date);

        let currentDate = new Date(fromDate);

        const processNextDate = () => {
          if (currentDate > toDate) {
            return res.json({ status: true });
          }

          const formattedDate = currentDate.toISOString().split("T")[0];

          const checkSql =
            "SELECT id FROM attendance WHERE employee_id = ? AND date = ?";

          conUser.query(
            checkSql,
            [employee_id, formattedDate],
            (err4, checkResult) => {
              if (checkResult.length > 0) {
                const updateSql =
                  "UPDATE attendance SET status = 'leave' WHERE employee_id = ? AND date = ?";

                conUser.query(updateSql, [employee_id, formattedDate], () => {
                  currentDate.setDate(currentDate.getDate() + 1);
                  processNextDate();
                });
              } else {
                const insertSql =
                  "INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, 'leave')";

                conUser.query(insertSql, [employee_id, formattedDate], () => {
                  currentDate.setDate(currentDate.getDate() + 1);
                  processNextDate();
                });
              }
            },
          );
        };

        processNextDate();
      });
    });
  });
});
router.put("/reject-leave/:id", (req, res) => {
  const { id } = req.params;
  const { reject_reason } = req.body;

  const sql = `
    UPDATE leave_requests 
    SET status = 'rejected', reject_reason = ?
    WHERE id = ?
  `;

  conUser.query(sql, [reject_reason, id], (err, result) => {
    if (err) {
      console.log("Reject Error:", err);
      return res.json({ status: false });
    }

    return res.json({ status: true });
  });
});
router.put("/cancel-leave/:id", (req, res) => {
  const { id } = req.params;

  const sql =
    "UPDATE leave_requests SET status = 'cancelled' WHERE id = ? AND status = 'pending'";

  conUser.query(sql, [id], (err, result) => {
    if (err) return res.json({ status: false });
    return res.json({ status: true });
  });
});
router.put("/update_status/:id", (req, res) => {
  const { status, reject_reason } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE leave_requests 
    SET status = ?, reject_reason = ?
    WHERE id = ?
  `;

  conUser.query(sql, [status, reject_reason, id], (err, result) => {
    if (err) {
      console.log("Update Error:", err);
      return res.json({ status: false, message: "Query error" });
    }

    return res.json({ status: true, message: "Status updated" });
  });
});

router.get("/monthly-report", verifyUser(["admin", "hr"]), (req, res) => {
  const { month, year } = req.query;

  const sql = `
SELECT 
e.id as employee_id,
e.name,
SEC_TO_TIME(SUM(TIME_TO_SEC(a.working_hours))) as total_hours
FROM attendance a
JOIN employee e ON a.employee_id = e.id
WHERE MONTH(a.date) = ?
AND YEAR(a.date) = ?
AND a.working_hours IS NOT NULL
GROUP BY e.id, e.name
ORDER BY e.name
`;

  conUser.query(sql, [month, year], (err, rows) => {
    if (err) {
      console.log("Monthly Report Error:", err);
      return res.json({ status: false });
    }

    const report = {};

    rows.forEach((row) => {
      const day = new Date(row.date).getDate();

      if (!report[row.employee_id]) {
        report[row.employee_id] = {
          name: row.name,
          present: 0,
          halfday: 0,
          late: 0,
          leave_count: 0,
          absent: 0,
          total_seconds: 0,
          days: {},
        };
      }

      if (row.status === "present") report[row.employee_id].present++;
      if (row.status === "halfday") report[row.employee_id].halfday++;
      if (row.status === "late") report[row.employee_id].late++;
      if (row.status === "leave") report[row.employee_id].leave_count++;
      if (row.status === "absent") report[row.employee_id].absent++;

      if (row.working_hours) {
        const parts = row.working_hours.split(":");

        const sec =
          parseInt(parts[0]) * 3600 +
          parseInt(parts[1]) * 60 +
          parseInt(parts[2]);

        report[row.employee_id].total_seconds += sec;

        report[row.employee_id].days[day] = row.working_hours;
      }
    });

    const result = Object.values(report).map((emp) => {
      emp.total_working_hours = new Date(emp.total_seconds * 1000)
        .toISOString()
        .slice(11, 19);

      delete emp.total_seconds;

      return emp;
    });

    res.json({
      status: true,
      result,
    });
  });
});
router.get("/monthly-report-csv", verifyUser(["admin", "hr"]), (req, res) => {
  const { month, year } = req.query;

  const sql = `
SELECT
  e.name,
  DAY(a.date) AS day,
  a.status,
  CASE
    WHEN a.punch_in IS NOT NULL AND a.punch_out IS NOT NULL
    THEN ABS(TIME_TO_SEC(TIMEDIFF(a.punch_out,a.punch_in)))
    ELSE 0
  END AS working_seconds
FROM attendance a
JOIN employee e ON a.employee_id = e.id
WHERE MONTH(a.date) = ?
AND YEAR(a.date) = ?
ORDER BY e.name
`;

  conUser.query(sql, [month, year], (err, result) => {
    if (err) {
      console.log("CSV Error:", err);
      return res.json({ status: false });
    }

    const employees = {};

    result.forEach((row) => {
      if (!employees[row.name]) {
        employees[row.name] = {
          days: new Array(31).fill("A"),
          total: 0,
        };
      }

      if (row.day) {
        employees[row.name].days[row.day - 1] = row.status;

        if (row.working_seconds) {
          employees[row.name].total += row.working_seconds;
        }
      }
    });

    let csv = "Employee,";

    for (let i = 1; i <= 31; i++) {
      csv += i + ",";
    }

    csv += "Total Hours\n";

    Object.keys(employees).forEach((name) => {
      csv += name + ",";

      employees[name].days.forEach((d) => {
        csv += d + ",";
      });

      const total = new Date(employees[name].total * 1000)
        .toISOString()
        .slice(11, 19);

      csv += total + "\n";
    });

    res.header("Content-Type", "text/csv");
    res.attachment(`report-${month}-${year}.csv`);
    res.send(csv);
  });
});
router.put(
  "/manual-correction/:id",
  verifyUser(["admin", "hr"]),
  (req, res) => {
    const { punch_in, punch_out } = req.body;
    const { id } = req.params;

    const sql = `
  UPDATE attendance
  SET 
    punch_in = ?,
    punch_out = ?,
    working_hours = TIMEDIFF(?, ?),
    status =
      CASE
        WHEN TIMEDIFF(?, ?) < '04:00:00' THEN 'halfday'
        WHEN ? > '09:30:00' THEN 'late'
        ELSE 'present'
      END
  WHERE id = ?
`;

    conUser.query(
      sql,
      [
        punch_in,
        punch_out,
        punch_out,
        punch_in,
        punch_out,
        punch_in,
        punch_in,
        id,
      ],
      (err) => {
        if (err) {
          console.log("Manual Correction Error:", err);
          return res.json({ status: false });
        }

        res.json({ status: true });
      },
    );
  },
);
router.get("/attendance-by-date", verifyUser(["admin", "hr"]), (req, res) => {
  const { date } = req.query;

  const sql = `
  SELECT 
    a.id,
    e.name,
    a.punch_in,
    a.punch_out,
    a.status
  FROM attendance a
  LEFT JOIN employee e 
  ON a.employee_id = e.id
  WHERE a.date = ?
`;

  conUser.query(sql, [date], (err, result) => {
    if (err) {
      console.log("Attendance by date error:", err);
      return res.json({ status: false });
    }

    res.json({ status: true, result });
  });
});
router.post(
  "/apply-leave",
  verifyUser(["employee"]),
  upload.array("documents", 5),

  (req, res) => {

    console.log("BODY:", req.body);

    console.log("FILES:", req.files);

    const {
      leave_type,
      from_date,
      to_date,
      reason
    } = req.body;

    const employee_email = req.user.email;

    const documents = req.files
      ? req.files
          .map(
            file =>
            `uploads/documents/${file.filename}`
          )
          .join(",")

      : null;

    const sql = `
      INSERT INTO leave_requests
      (
        employee_email,
        leave_type,
        from_date,
        to_date,
        reason,
        document,
        status
      )

      VALUES
      (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        'Pending'
      )
    `;

    conUser.query(

      sql,

      [

        employee_email,

        leave_type,

        from_date,

        to_date,

        reason,

        documents

      ],

      (err) => {

        if (err) {

          console.log(
            "SQL ERROR:",
            err
          );

          return res.json({

            status:false,

            message:
              err.message

          });

        }

        return res.json({

          status:true

        });

      }

    );

  }

);


router.get(
  "/employee-attendance",
  verifyUser(["employee", "hr", "admin"]),
  (req, res) => {
    const employee_id = req.user.id;

    const sql = `
    SELECT date, status, punch_in, punch_out
    FROM attendance
    WHERE employee_id = ?
  `;

    conUser.query(sql, [employee_id], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ status: false });
      }

      res.json({
        status: true,
        result,
      });
    });
  },
);
router.get(
  "/admin-attendance",
  verifyUser(["superadmin", "admin", "hr"]),
  (req, res) => {
    const employee_id = req.query.employee_id;

    let sql = `
      SELECT 
  a.date,
  a.status,
  a.punch_in,
  a.punch_out,
  e.name,
  a.employee_id
      FROM attendance a
      JOIN employee e ON a.employee_id = e.id
    `;

    let values = [];

    // ⭐ If employee selected → filter
    if (employee_id) {
      sql += " WHERE a.employee_id = ?";
      values.push(employee_id);
    }

    sql += " ORDER BY a.date DESC";

    conUser.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ status: false });
      }

      res.json({
        status: true,
        result,
      });
    });
  },
);
router.delete(
  "/delete-attendance/:id",
  verifyUser(["admin", "hr"]),
  (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM attendance WHERE id = ?";

    conUser.query(sql, [id], (err) => {
      if (err) {
        console.log("Delete Error:", err);

        return res.json({
          status: false,
        });
      }

      return res.json({
        status: true,
        message: "Attendance deleted",
      });
    });
  },
);

export default router;
