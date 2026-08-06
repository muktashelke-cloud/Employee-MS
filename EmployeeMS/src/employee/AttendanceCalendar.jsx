import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const ATTENDANCE_DATA = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  {
    d: 1,
    s: "present",
    pi: "09:02 AM",
    po: "06:10 PM",
    h: "9h 08m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 2,
    s: "present",
    pi: "09:00 AM",
    po: "06:05 PM",
    h: "9h 05m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 3,
    s: "present",
    pi: "09:10 AM",
    po: "06:00 PM",
    h: "8h 50m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 4,
    s: "present",
    pi: "09:05 AM",
    po: "06:15 PM",
    h: "9h 10m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 5,
    s: "present",
    pi: "09:00 AM",
    po: "06:08 PM",
    h: "9h 08m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 6,
    s: "holiday",
    pi: null,
    po: null,
    h: null,
    note: "National Holiday — Office Closed",
  },
  {
    d: 7,
    s: "holiday",
    pi: null,
    po: null,
    h: null,
    note: "National Holiday — Office Closed",
  },
  {
    d: 8,
    s: "absent",
    pi: null,
    po: null,
    h: null,
    note: "No punch recorded — marked Absent",
  },
  {
    d: 9,
    s: "present",
    pi: "09:18 AM",
    po: "06:00 PM",
    h: "8h 42m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 10,
    s: "present",
    pi: "09:03 AM",
    po: "06:12 PM",
    h: "9h 09m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 11,
    s: "late",
    pi: "09:47 AM",
    po: "06:05 PM",
    h: "8h 18m",
    note: "Late by 47 mins — marked Late",
  },
  {
    d: 12,
    s: "leave",
    pi: null,
    po: null,
    h: null,
    note: "Approved Leave — Family function",
  },
  {
    d: 13,
    s: "holiday",
    pi: null,
    po: null,
    h: null,
    note: "National Holiday — Office Closed",
  },
  {
    d: 14,
    s: "holiday",
    pi: null,
    po: null,
    h: null,
    note: "National Holiday — Office Closed",
  },
  {
    d: 15,
    s: "present",
    pi: "09:07 AM",
    po: "06:02 PM",
    h: "8h 55m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 16,
    s: "present",
    pi: "09:01 AM",
    po: "06:00 PM",
    h: "8h 59m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 17,
    s: "absent",
    pi: null,
    po: null,
    h: null,
    note: "No punch recorded — marked Absent",
  },
  {
    d: 18,
    s: "present",
    pi: "09:12 AM",
    po: "06:05 PM",
    h: "8h 53m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 19,
    s: "leave",
    pi: null,
    po: null,
    h: null,
    note: "Approved Leave — Personal work",
  },
  {
    d: 20,
    s: "compoff",
    pi: null,
    po: null,
    h: null,
    note: "Comp Off Approved",
  },
  {
    d: 21,
    s: "holiday",
    pi: null,
    po: null,
    h: null,
    note: "National Holiday — Office Closed",
  },
  {
    d: 22,
    s: "present",
    pi: "09:05 AM",
    po: "06:10 PM",
    h: "9h 05m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 23,
    s: "late",
    pi: "10:02 AM",
    po: "06:00 PM",
    h: "7h 58m",
    note: "Late by 1h 02m — marked Late",
  },
  {
    d: 24,
    s: "present",
    pi: "09:14 AM",
    po: "06:03 PM",
    h: "8h 49m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 25,
    s: "present",
    pi: "09:00 AM",
    po: "06:00 PM",
    h: "9h 00m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 26,
    s: "present",
    pi: "09:08 AM",
    po: "06:07 PM",
    h: "8h 59m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 27,
    s: "compoff",
    pi: null,
    po: null,
    h: null,
    note: "Comp Off Approved",
  },
  {
    d: 28,
    s: "holiday",
    pi: null,
    po: null,
    h: null,
    note: "National Holiday — Office Closed",
  },
  {
    d: 29,
    s: "present",
    pi: "09:02 AM",
    po: "06:00 PM",
    h: "8h 58m",
    note: "On time. Shift start 09:00 AM",
  },
  {
    d: 30,
    s: "absent",
    pi: null,
    po: null,
    h: null,
    note: "No punch recorded — marked Absent",
  },
  null,
  null,
  null,
  null,
  null,
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const STATUS_LABEL = {
  present: "Present",
  absent: "Absent",
  holiday: "Holiday",
  leave: "On Leave",
  late: "Late",
  compoff: "Comp Off",
};

const badgeStyle = {
  present: "bg-green-100 text-green-700",
  absent: "bg-red-100 text-red-700",
  holiday: "bg-indigo-100 text-indigo-700",
  leave: "bg-amber-100 text-amber-700",
  late: "bg-orange-100 text-orange-600",
};

function getTime() {
  const n = new Date();
  let h = n.getHours(),
    m = n.getMinutes(),
    ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ day, idx, onClose }) {
  if (!day) return null;
  const dow = idx;
  const st = day.s;

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-slate-200 w-80 shadow-2xl overflow-hidden">
        {/* Head */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="font-bold text-slate-900 text-base">
              {day.d} June 2026
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{DAY_NAMES[dow]}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-3">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle[st]}`}
            >
              {STATUS_LABEL[st]}
            </span>
            {st === "late" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600">
                ⚠ Late arrival
              </span>
            )}
          </div>

          {/* Info grid */}
          {(st === "present" || st === "late") && (
            <>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Punch In", val: day.pi, cls: "text-green-600" },
                  { label: "Punch Out", val: day.po, cls: "text-red-500" },
                  { label: "Total Hours", val: day.h, cls: "text-slate-800" },
                  {
                    label: "Shift Start",
                    val: "09:00 AM",
                    cls: "text-slate-400",
                  },
                ].map(({ label, val, cls }) => (
                  <div
                    key={label}
                    className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2"
                  >
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                      {label}
                    </p>
                    <p className={`text-sm font-semibold mt-1 ${cls}`}>{val}</p>
                  </div>
                ))}
              </div>
              {/* Timeline */}
              <div className="flex flex-col divide-y divide-slate-100">
                <div className="flex items-center gap-3 py-2">
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm flex-shrink-0">
                    →
                  </span>
                  <div>
                    <p className="text-[11px] text-slate-400">Punched In</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {day.pi}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2">
                  <span className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-sm flex-shrink-0">
                    ←
                  </span>
                  <div>
                    <p className="text-[11px] text-slate-400">Punched Out</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {day.po}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {st === "absent" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Punch In", val: "No entry", cls: "text-slate-400" },
                  {
                    label: "Punch Out",
                    val: "No entry",
                    cls: "text-slate-400",
                  },
                  {
                    label: "Total Hours",
                    val: "0h 00m",
                    cls: "text-slate-400",
                  },
                  {
                    label: "Shift Start",
                    val: "09:00 AM",
                    cls: "text-slate-400",
                  },
                ].map(({ label, val, cls }) => (
                  <div
                    key={label}
                    className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2"
                  >
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                      {label}
                    </p>
                    <p className={`text-sm font-semibold mt-1 ${cls}`}>{val}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col divide-y divide-slate-100">
                {["Punch In", "Punch Out"].map((lbl) => (
                  <div key={lbl} className="flex items-center gap-3 py-2">
                    <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-sm flex-shrink-0">
                      –
                    </span>
                    <div>
                      <p className="text-[11px] text-slate-400">{lbl}</p>
                      <p className="text-sm font-semibold text-slate-400">
                        Not recorded
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {(st === "holiday" || st === "leave") && (
            <div className="grid grid-cols-2 gap-2">
              {["Punch In", "Punch Out"].map((lbl) => (
                <div
                  key={lbl}
                  className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2"
                >
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                    {lbl}
                  </p>
                  <p className="text-sm font-semibold mt-1 text-slate-400">
                    N/A
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Note */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[11px] text-slate-500 leading-relaxed">
            ℹ {day.note}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyAttendance() {
  const calendarRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [punched, setPunched] = useState("idle"); // idle | in | out
  const [view, setView] = useState("month");
  const [openedFromYear, setOpenedFromYear] = useState(false);
  const months = [
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

  const navItems = [
    { label: "Dashboard", icon: "⊞" },
    { label: "Profile", icon: "◯" },
    { label: "Leave", icon: "📅" },
    { label: "My Attendance", icon: "✓", active: true },
    { label: "My Tasks", icon: "☑" },
    { label: "Timesheet", icon: "⏱" },
  ];

  const attendancePercentage = Math.round((17 / (17 + 3)) * 100);

  const stats = [
    {
      label: "PRESENT",
      val: 17,
      color: "text-green-600",
      border: "border-b-green-500",
      icon: "✓",
    },
    {
      label: "ABSENT",
      val: 3,
      color: "text-red-600",
      border: "border-b-red-500",
      icon: "✕",
    },
    {
      label: "LATE",
      val: 2,
      color: "text-orange-500",
      border: "border-b-orange-500",
      icon: "⏰",
    },
    {
      label: "HOLIDAYS",
      val: 9,
      color: "text-indigo-600",
      border: "border-b-indigo-500",
      icon: "🏛",
    },
    {
      label: "WORK HOURS",

      val: "136h",

      color: "text-cyan-700",

      border: "border-b-cyan-500",

      icon: "⏱",
    },
    {
      label: "ATTENDANCE",

      val: `${attendancePercentage}%`,

      color: "text-purple-600",

      border: "border-b-purple-500",

      icon: "📈",
    },
  ];

  const legend = [
    { label: "Present", dot: "bg-green-200 border-green-500" },
    { label: "Absent", dot: "bg-red-200 border-red-500" },
    { label: "Late", dot: "bg-orange-200 border-orange-500" },
    { label: "Leave", dot: "bg-amber-200 border-amber-500" },
    { label: "Holiday", dot: "bg-indigo-200 border-indigo-500" },
  ];
  const statusColors = {
    present: "#22c55e",
    absent: "#ef4444",
    late: "#f97316",
    leave: "#f59e0b",
    holiday: "#6366f1",
    compoff: "#0891b2",
  };

  const calendarEvents = ATTENDANCE_DATA.filter(Boolean).map((day) => ({
    title: "",
    date: `2026-06-${String(day.d).padStart(2, "0")}`,
    extendedProps: day,
  }));

  const handlePunchIn = () => {
    const t = getTime();
    setPunchInTime(t);
    setPunched("in");
  };

  const handlePunchOut = () => {
    const t = getTime();
    setPunchOutTime(t);
    setPunched("out");
  };

  return (
    <div className="flex min-h-screen font-sans bg-slate-100 overflow-hidden">
      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <div className="flex-1 px-4 py-3 flex flex-col gap-2 min-h-max">
          {/* Punch Bar */}
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-5">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Today —{" "}
                  <span className="text-slate-800 font-semibold ">
                    Mon, 01 June 2026
                  </span>
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                    <span className="text-[11px] text-slate-400">In:</span>
                    <span className="text-[13px] font-semibold text-slate-800">
                      {punchInTime || "--:-- --"}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-slate-200"></div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                    <span className="text-[11px] text-slate-400">Out:</span>
                    <span className="text-[13px] font-semibold text-slate-800">
                      {punchOutTime || "--:-- --"}
                    </span>
                  </div>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold
                ${
                  punched === "idle"
                    ? "bg-slate-100 text-slate-500"
                    : punched === "in"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                }`}
              >
                {punched === "idle"
                  ? "Not punched"
                  : punched === "in"
                    ? "✓ Punched In"
                    : "✓ Punched Out"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePunchIn}
                disabled={punched !== "idle"}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                → Punch In
              </button>
              <button
                onClick={handlePunchOut}
                disabled={punched !== "in"}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Punch Out
              </button>
            </div>
          </div>
          {/* Stat Cards */}
          <div className="grid grid-cols-6 gap-3 mb-3">
            {stats.map(({ label, val, color, border, icon }) => (
              <div
                key={label}
                className="bg-white border border-slate-200 rounded-2xl px-4 py-3 relative overflow-hidden shadow-sm transition-all"
              >
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  {label}
                </p>
                <p className={`text-4xl font-bold mt-3 leading-none ${color}`}>
                  {val}
                </p>
                <span className="absolute top-4 right-4 text-xl opacity-70">
                  {icon}
                </span>
                <div
                  className={`absolute bottom-0 left-0 right-0 h-[4px] rounded-b-2xl ${
                    label === "PRESENT"
                      ? "bg-green-400"
                      : label === "ABSENT"
                        ? "bg-red-400"
                        : label === "LATE"
                          ? "bg-orange-400"
                          : label === "HOLIDAYS"
                            ? "bg-indigo-400"
                            : label === "WORK HOURS"
                              ? "bg-cyan-400"
                              : "bg-purple-400"
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mb-2">
            {["day", "week", "month", "year"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setView(item);

                  if (item === "day") {
                    calendarRef.current?.getApi().changeView("timeGridDay");
                  }

                  if (item === "week") {
                    calendarRef.current?.getApi().changeView("timeGridWeek");
                  }

                  if (item === "month") {
                    setOpenedFromYear(false);
                    calendarRef.current?.getApi().changeView("dayGridMonth");
                  }
                }}
                className={`px-4 py-2 rounded-lg capitalize font-medium ${
                  view === item
                    ? "bg-slate-800 text-white"
                    : "bg-white border border-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {view === "month" && openedFromYear && (
            <div className="mb-3">
              <button
                onClick={() => setView("year")}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                ← Back to Year
              </button>
            </div>
          )}

          {view === "year" && (
            <div className="grid grid-cols-3 gap-4">
              {months.map((month, index) => (
                <div
                  key={month}
                  onClick={() => {
                    setOpenedFromYear(true);
                    setView("month");

                    setTimeout(() => {
                      calendarRef.current
                        ?.getApi()
                        .gotoDate(
                          `2026-${String(index + 1).padStart(2, "0")}-01`,
                        );

                      calendarRef.current?.getApi().changeView("dayGridMonth");
                    }, 0);
                  }}
                  className="bg-white border border-slate-200 rounded-xl p-4 h-40 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <>
                    <h3 className="font-semibold text-slate-700">{month}</h3>

                    <p className="text-xs text-slate-400 mb-2">
                      Click to open month
                    </p>
                  </>
                  <div className="grid grid-cols-7 gap-1 text-[10px] text-slate-400">
                    <span>S</span>
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view !== "year" && (
            <div className="attendance-calendar bg-white border border-slate-200 rounded-xl px-4 pt-7 pb-2">
              
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={
                  view === "day"
                    ? "timeGridDay"
                    : view === "week"
                      ? "timeGridWeek"
                      : "dayGridMonth"
                }
                height="auto"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "",
                }}
                events={calendarEvents}
                eventDisplay="block"
                eventClassNames={() => [
                  "!bg-transparent",
                  "!border-0",
                  "!shadow-none",
                ]}
                displayEventTime={false}
                dayMaxEventRows={1}
                dateClick={(info) => {
                  const day = Number(info.dateStr.split("-")[2]);

                  const selectedDay = ATTENDANCE_DATA.find(
                    (item) => item?.d === day,
                  );

                  if (!selectedDay) return;

                  setSelected(selectedDay);

                  setSelectedIdx(info.date.getDay());
                }}
                eventContent={(info) => {
                  const status = info.event.extendedProps.s;

                  return (
                    <div className="flex justify-end pr-2 pt-1 pointer-events-none">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: statusColors[status],
                        }}
                      />
                    </div>
                  );
                }}
                eventDidMount={(info) => {
                  const data = info.event.extendedProps;

                  info.el.title = `

Punch In : ${data.pi || "N/A"}

Punch Out : ${data.po || "N/A"}

Hours : ${data.h || "N/A"}

`;
                }}
              />
              <div className="mt-6 flex flex-wrap justify-center items-center gap-6 border-t border-slate-200 pt-4 pb-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span>Present</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>Absent</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  <span>Late</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span>Leave</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                  <span>Holiday</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                  <span>Comp Off</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <Modal
          day={selected}
          idx={selectedIdx}
          onClose={() => {
            setSelected(null);
            setSelectedIdx(null);
          }}
        />
      )}
    </div>
  );
}
