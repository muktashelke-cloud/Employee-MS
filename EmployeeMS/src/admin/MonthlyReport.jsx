import { useEffect, useState } from "react";
import api from "../utils/api";
import "./MonthlyReport.css";
import CommonTable from "../Components/CommonTable/CommonTable";

const MonthlyReport = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const safeData = Array.isArray(data) ? data : [];
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const columns = [
    {
      header: "Name",
      accessor: "name",

      render: (emp) => (
        <div className="emp-name-cell" onClick={() => setSelectedEmployee(emp)}>
          <span className="name-text">{emp.name}</span>

          <span className="view-icon">👁</span>
        </div>
      ),
    },

    {
      header: "Present",
      accessor: "present",

      render: (emp) => (
        <span className="present-text">{getSummary(emp.days).present}</span>
      ),
    },

    {
      header: "Halfday",
      accessor: "halfday",

      render: (emp) => getSummary(emp.days).halfday,
    },

    {
      header: "Late",
      accessor: "late",

      render: (emp) => getSummary(emp.days).late,
    },

    {
      header: "Leave",
      accessor: "leave",

      render: (emp) => getSummary(emp.days).leave,
    },

    {
      header: "Absent",
      accessor: "absent",

      render: (emp) => (
        <span className="absent-text">{getSummary(emp.days).absent}</span>
      ),
    },

    {
      header: "Total Hours",
      accessor: "total",

      render: (emp) => (
        <>
          {formatTime(Number(emp.total) * 3600)}

          <div className="days-text">
            ({(Number(emp.total) / 9).toFixed(1)} days)
          </div>
        </>
      ),
    },
  ];

  const getSummary = (days) => {
    let present = 0;
    let halfday = 0;
    let late = 0;
    let leave = 0;
    let absent = 0;

    days.forEach((d) => {
      if (d === "P") present++;
      else if (d === "H") halfday++;
      else if (d === "L") late++;
      else if (d === "A") absent++;
    });

    return { present, halfday, late, leave, absent };
  };

  /*SUMMARY TOTALS */

  const totals = safeData.reduce(
    (acc, emp) => {
      const s = getSummary(emp.days);

      acc.present += s.present;
      acc.halfday += s.halfday;
      acc.late += s.late;
      acc.leave += s.leave;
      acc.absent += s.absent;
      acc.hours += Number(emp.total);

      return acc;
    },
    { present: 0, halfday: 0, late: 0, leave: 0, absent: 0, hours: 0 },
  );

  const totalSeconds = totals.hours * 3600;

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const totalHoursFormatted = formatTime(totalSeconds);

  /*FETCH REPORT */

  const fetchReport = async () => {
    try {
      const res = await api.get(
        `/report/monthly-report?month=${month}&year=${year}`,
      );

      console.log("API DATA:", res.data);

      setData(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  /*EXPORT CSV */

  const handleExport = async () => {
    const response = await fetch(
      `http://localhost:5000/attendance/monthly-report-csv?month=${month}&year=${year}`,
      {
        credentials: "include",
      },
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${month}-${year}.csv`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await api.get("/report/latest-month");

        console.log("LATEST:", res.data); // 👈 debug

        if (res.data.month && res.data.year) {
          setMonth(res.data.month);
          setYear(res.data.year);

          fetchReport(res.data.month, res.data.year);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchLatest();
  }, []);
  /* DAYS ARRAY*/

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="report-container">
      <div className="report-card">
        <div className="report-topbar">
          
        </div>

        <CommonTable
          columns={columns}
          data={safeData}
          tableClass="monthly-report-table"
          leftContent={
            <div className="report-left">
              <button className="export-btn" onClick={handleExport}>
                Export CSV
              </button>

              <select
                className="month-input"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
                <option value={7}>July</option>
                <option value={8}>August</option>
                <option value={9}>September</option>
                <option value={10}>October</option>
                <option value={11}>November</option>
                <option value={12}>December</option>
              </select>

              <input
                type="number"
                className="year-input"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />

              <button className="load-btn" onClick={fetchReport}>
                Load
              </button>
            </div>
          }
        />

        {/*DAY WISE TABLE*/}

        {selectedEmployee && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <span
                  className="close-btn"
                  onClick={() => setSelectedEmployee(null)}
                >
                  ✖
                </span>
              </div>

              <div className="calendar-grid">
                <div className="employee-block">
                  <h3>Attendance Overview</h3>
                  <td className="emp-name">
                    <div className="emp-cell">
                      <img
                        src={selectedEmployee.image || "/default-avatar.png"}
                        alt="profile"
                        className="avatar-img"
                      />
                      {selectedEmployee.name}
                    </div>
                  </td>
                  <p className="modal-subtitle">
                    {new Date(year, month - 1).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  {/* optional remove OR show subtitle */}
                  <div className="days-grid">
                    {days.map((day) => {
                      const status = selectedEmployee.days?.[day - 1] || "A";

                      return (
                        <div
                          key={day}
                          className={`day-box ${
                            status === "P"
                              ? "present"
                              : status === "A"
                                ? "absent"
                                : ""
                          }`}
                        >
                          {day}

                          <span className="tooltip">
                            {status === "P"
                              ? "Present"
                              : status === "A"
                                ? "Absent"
                                : status === "L"
                                  ? "Late"
                                  : "Half Day"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyReport;
