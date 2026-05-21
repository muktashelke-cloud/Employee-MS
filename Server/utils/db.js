import mysql from "mysql2";

// ✅ DB 1 → Users (login, admin, employee)
export const conUser = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employeems",
});

// ✅ DB 2 → Project + Attendance + Allocation
export const conEMS = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ems",
});

// 🔌 Connect User DB
conUser.connect((err) => {
  if (err) {
    console.log("❌ User DB connection error:", err);
  } else {
    console.log("✅ User DB Connected");
  }
});

// 🔌 Connect EMS DB
conEMS.connect((err) => {
  if (err) {
    console.log("❌ EMS DB connection error:", err);
  } else {
    console.log("✅ EMS DB Connected");
  }
});