import "./CommonCalendar.css";

const CommonCalendar = ({
  selectedEmployee,
  month,
  year,
  showTitle = true,
  showEmployeeInfo = true,
}) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="common-calendar">
      {showTitle && (
        <div className="calendar-header">
          <h2>Attendance Overview</h2>
        </div>
      )}

      {showEmployeeInfo && (
        <div className="employee-info">
          <img
            src={selectedEmployee?.image || "/default-avatar.png"}
            alt="profile"
            className="calendar-avatar"
          />

          <div>
            <h3>{selectedEmployee?.name}</h3>

            <p className="calendar-month">
              {new Date(year, month - 1).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      )}

      <div className="calendar-days-grid">
        {days.map((day) => {
          const status = selectedEmployee?.days?.[day - 1] || "A";

          return (
            <div
              key={day}
              className={`calendar-day-box ${
                status === "P"
                  ? "present"
                  : status === "A"
                    ? "absent"
                    : status === "L"
                      ? "late"
                      : status === "H"
                        ? "halfday"
                        : status === "LV"
                          ? "leave"
                          : ""
              }`}
              data-status={
                status === "P"
                  ? "Present"
                  : status === "A"
                    ? "Absent"
                    : status === "L"
                      ? "Late"
                      : status === "H"
                        ? "Half Day"
                        : status === "LV"
                          ? "Leave"
                          : ""
              }
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommonCalendar;
