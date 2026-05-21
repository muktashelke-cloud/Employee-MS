import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import cron from "node-cron";
import adminRouter from "./routes/admin.route.js";
import attendanceRouter from "./routes/attendance.route.js";
import { conUser, conEMS } from "./utils/db.js";
import reportRoutes from "./routes/report.js";
import projectRoutes from "./routes/project.route.js";
import allocationRoutes from "./routes/allocation.route.js";
import timesheetRoutes from "./routes/timesheet.route.js";
import taskRouter from "./routes/task.route.js";
import employeeRoutes from "./routes/employee.route.js";




dotenv.config();

const app = express();

/* ⭐ ES Module fix */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ⭐ MIDDLEWARE */
app.use(cors({
 origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
 
}));

app.use(express.json());
app.use(cookieParser());

/* ⭐ STATIC FILES */
app.use("/uploads", express.static(path.resolve("public/uploads")));

/* ⭐ ROUTES */
app.use("/auth", adminRouter);
app.use("/attendance", attendanceRouter);
app.use("/report", reportRoutes);
app.use("/projects", projectRoutes);
app.use("/allocations", allocationRoutes);
app.use("/timesheets", timesheetRoutes);
app.use("/tasks", taskRouter); 
app.use("/employee", employeeRoutes);

/* ======================================================
   ⭐ AUTO ABSENT CRON JOB
   ======================================================*/

cron.schedule("59 23 * * *", () => {

  console.log("Running Auto Absent Job...");

  const sql = `
    INSERT INTO attendance (employee_id, date, status)
    SELECT id, CURDATE(), 'absent'
    FROM employee
    WHERE id NOT IN (
      SELECT employee_id
      FROM attendance
      WHERE date = CURDATE()
    )
  `;

  conUser.query(sql, (err, result) => {

    if (err) {
      console.log("Auto Absent Error:", err);
    } else {
      console.log("Auto Absent Marked Successfully");
    }

  });

});

/* ====================================================== */

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});