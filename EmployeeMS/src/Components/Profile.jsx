import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = 2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {Array.isArray(d) ? (
      d.map((p, i) => <path key={i} d={p} />)
    ) : (
      <path d={d} />
    )}
  </svg>
);

const icons = {
  dashboard: [
    "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    "M9 22V12h6v10",
  ],
  profile: [
    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
    "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
  ],
  leave: [
    "M8 6h13",
    "M8 12h13",
    "M8 18h13",
    "M3 6h.01",
    "M3 12h.01",
    "M3 18h.01",
  ],
  attendance: [
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
    "M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
    "M23 21v-2a4 4 0 0 0-3-3.87",
    "M16 3.13a4 4 0 0 1 0 7.75",
  ],
  tasks: [
    "M9 11l3 3L22 4",
    "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  ],
  timesheet: [
    "M12 20h9",
    "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  ],
  logout: [
    "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
    "M16 17l5-5-5-5",
    "M21 12H9",
  ],
  mail: [
    "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
    "M22 6l-10 7L2 6",
  ],
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.17 3.47 2 2 0 0 1 3.11 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z",
  location: [
    "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
    "M12 10m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0",
  ],
  calendar: ["M3 4h18v18H3z", "M16 2v4", "M8 2v4", "M3 10h18"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  briefcase: [
    "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z",
    "M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  ],
  edit: [
    "M16.862 3.487a2.1 2.1 0 1 1 2.97 2.97L7.5 18.79 3 20l1.21-4.5L16.862 3.487z",
  ],
  message: [
    "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  ],
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  bell: [
    "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9",
    "M13.73 21a2 2 0 0 1-3.46 0",
  ],
  chevron: "M9 18l6-6-6-6",
  menu: ["M3 12h18", "M3 6h18", "M3 18h18"],
  award: [
    "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z",
    "M8.21 13.89L7 23l5-3 5 3-1.21-9.12",
  ],
  trend: ["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"],
};

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "profile", label: "Profile", icon: "profile" },
  { key: "leave", label: "Leave", icon: "leave" },
  { key: "attendance", label: "My Attendance", icon: "attendance" },
  { key: "tasks", label: "My Tasks", icon: "tasks" },
  { key: "timesheet", label: "Timesheet", icon: "timesheet" },
];

const employee = {
  name: "Priya Sharma",
  title: "Senior Software Engineer",
  department: "Engineering",
  employeeId: "EMP-04821",
  initials: "PS",
  email: "priya.sharma@techcorp.io",
  phone: "+91 98765 43210",
  location: "Pune, Maharashtra",
  joined: "March 14, 2020",
  manager: "Rohan Desai",
  type: "Full-time",
  status: "Active",
  rating: 4.8,
  attendance: 98,
  tenure: "5 yrs",
  projects: 42,
  skills: [
    "React",
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "System Design",
    "AWS",
    "GraphQL",
  ],
  reports: [
    {
      initials: "AK",
      name: "Aarav Kumar",
      role: "Software Engineer II",
      bg: "#e0e7ff",
      color: "#3730a3",
    },
    {
      initials: "NS",
      name: "Neha Singh",
      role: "Junior Developer",
      bg: "#d1fae5",
      color: "#065f46",
    },
    {
      initials: "MT",
      name: "Mihir Tiwari",
      role: "Intern",
      bg: "#fef3c7",
      color: "#92400e",
    },
  ],
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function StatCard({ value, label, accent, icon, subtitle }) {
  return (
    <div
      className="stat-card"
      style={{
        transition: "0.3s ease",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "105px",
        padding: "10px",
        borderRadius: "18px",
        position: "relative",
        overflow: "hidden",
        background: "#fdfefe",
        boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(15,23,42,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(15,23,42,0.08)";
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: accent,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            accent === "#fbbf24"
              ? "linear-gradient(135deg,rgba(251,191,36,0.18) 0%,transparent 65%)"
              : `linear-gradient(135deg,${accent}14 0%,transparent 65%)`,
          borderRadius: 16,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "#94a3b8",
            fontWeight: 500,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#64748b",
            textTransform: "uppercase",
          }}
        >
          <Icon d={icons[icon]} size={17} />
        </div>
      </div>
      <span
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: "#0f172a",
          fontFamily: "'Sora',sans-serif",
          letterSpacing: "-1px",
        }}
      >
        {value}
      </span>
      <div
        style={{
          marginTop: 6,
          fontSize: 12,
          color: "#64748b",
          fontWeight: 600,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

function InfoField({ icon, label, value, isLink }) {
  return (
    <div style={{ padding: "16px 0", borderBottom: "1px solid #f8fafc" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 4,
          color: "#94a3b8",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        <Icon d={icons[icon]} size={12} />
        {label}
      </div>
      <p
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: isLink ? "#2563eb" : "#1e293b",
        }}
      >
        {value}
      </p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function EmployeeProfile() {
  const [active, setActive] = useState("profile");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  console.log("PROFILE USER", user);
  const [showMessage, setShowMessage] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showDirectReportMsg, setShowDirectReportMsg] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  console.log(user);

  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px;}
        .nav-item{display:flex;align-items:center;gap:12px;padding:11px 16px;border-radius:12px;cursor:pointer;transition:all .2s;font-size:14px;font-weight:500;color:#94a3b8;}
        .nav-item:hover{background:rgba(255,255,255,.07);color:#e2e8f0;}
        .nav-item.active{background:rgba(255,255,255,.12);color:#fff;}
        .nav-dot{width:5px;height:5px;border-radius:99px;background:#60a5fa;opacity:0;transition:opacity .2s;margin-left:auto;}
        .nav-item.active .nav-dot{opacity:1;}
        .skill-tag{border:1px solid #e2e8f0;border-radius:99px;padding:6px 14px;font-size:13px;font-weight:500;color:#475569;background:#fff;transition:all .2s;cursor:default;}
        .skill-tag:hover{border-color:#2563eb;color:#2563eb;background:#eff6ff;}
        .action-btn{display:flex;align-items:center;gap:8px;padding:10px 20px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;border:none;}
        .report-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #f1f5f9;}
        .report-row:last-child{border-bottom:none;}
        .icon-btn{width:32px;height:32px;border-radius:8px;border:1px solid #e2e8f0;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#94a3b8;}
        .icon-btn:hover{background:#f8fafc;}
      `}</style>

      {/* ── Main area ──────────────────────────────────── */}
      <div
        style={{
          marginLeft: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Page */}
        <main
          style={{
            marginTop: 12,
            padding: "12px 24px 48px",
            overflowY: "auto",
            width: "100%",
            maxWidth: "1600px",
            marginLeft: "auto",
            marginRight: "auto",
            background: "linear-gradient(180deg,#f8fafc 0%,#f1f5f9 100%)",
          }}
        >
          {/* Hero Banner */}
          <div
            style={{
              background:
                "linear-gradient(120deg,#1d4ed8 0%,#1e40af 55%,#1e3a8a 100%)",
              borderRadius: 20,
              padding: "20px 28px",
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 14,
              position: "relative",
              overflow: "hidden",
              width: "100%",
              boxShadow: "0 10px 24px rgba(37,99,235,0.16)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -70,
                right: -70,
                width: 260,
                height: 260,
                borderRadius: "50%",
                background: "rgba(255,255,255,.04)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -50,
                right: 130,
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: "rgba(255,255,255,.04)",
              }}
            />

            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid rgba(255,255,255,.25)",
                  boxShadow: "0 0 0 5px rgba(255,255,255,.08)",
                  background: "#dbeafe",
                }}
              >
                <img
                  src="https://i.pravatar.cc/300?img=5"
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#22c55e",
                  border: "3px solid #1d4ed8",
                }}
              />
            </div>
            {/* Name block */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 6,
                }}
              >
                <h1
                  style={{
                    fontFamily: "'Sora',sans-serif",
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {employee.name}
                </h1>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "rgba(255,255,255,.12)",
                    color: "#bfdbfe",
                    fontSize: 12,
                    padding: "4px 10px",
                    borderRadius: 99,
                    fontWeight: 500,
                  }}
                >
                  <Icon d={icons.award} size={13} /> Top Performer
                </span>
              </div>
              <p
                style={{
                  color: "#bfdbfe",
                  fontSize: 14,
                  fontWeight: 500,
                  marginBottom: 16,
                }}
              >
                {employee.title}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { icon: "briefcase", label: employee.department },
                  { icon: "location", label: employee.location },
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "rgba(255,255,255,.12)",
                      color: "#e0f2fe",
                      fontSize: 13,
                      padding: "6px 14px",
                      borderRadius: 99,
                      fontWeight: 500,
                    }}
                  >
                    <Icon d={icons[icon]} size={14} />
                    {label}
                  </span>
                ))}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#22c55e22",
                    color: "#86efac",
                    fontSize: 13,
                    padding: "6px 14px",
                    borderRadius: 99,
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#22c55e",
                      display: "inline-block",
                    }}
                  />
                  {employee.status}
                </span>
              </div>
            </div>

            {/* ID + actions */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "#93c5fd",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Employee ID
              </div>
              <div
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "1px",
                }}
              >
                {employee.employeeId}
              </div>
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => navigate(`/employee/edit-employee/${user.id}`)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    opacity: 0.95,
                  }}
                >
                  <Icon d={icons.edit} size={20} stroke={1.8} />
                </button>

                <div
                  style={{
                    width: "1px",
                    height: "24px",
                    background: "rgba(255,255,255,0.22)",
                  }}
                />

                <button
                  onClick={() => setShowMessage(!showMessage)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    opacity: 0.95,
                  }}
                >
                  <Icon d={icons.message} size={20} stroke={1.8} />
                </button>
              </div>
            </div>
          </div>

          {showMessage && (
            <div
              style={{
                position: "absolute",
                top: 110,
                right: 30,
                width: 300,
                background: "#ffffff",
                borderRadius: 18,
                padding: 16,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Messages
                </h3>

                <button
                  onClick={() => setShowMessage(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#64748b",
                    padding: 0,
                  }}
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  padding: 12,
                  background: "#f8fafc",
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              >
                <b>HR Team</b>

                <p style={{ fontSize: 14 }}>Your payslip is available.</p>
              </div>

              <div
                style={{
                  padding: 12,
                  background: "#f8fafc",
                  borderRadius: 12,
                }}
              >
                <b>Manager</b>

                <p style={{ fontSize: 14 }}>Please submit today's timesheet.</p>
              </div>
            </div>
          )}

          {/* Stat cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 16,
              marginBottom: 14,
              alignItems: "stretch",
            }}
          >
            <StatCard
              value={`${employee.rating}/5`}
              label="Performance"
              subtitle="Excellent Rating"
              accent="#8b5cf6"
              icon="star"
            />

            <StatCard
              value={`${employee.attendance}%`}
              label="Attendance"
              subtitle="This Month"
              accent="#10b981"
              icon="trend"
            />

            <StatCard
              value={employee.tenure}
              label="Tenure"
              subtitle="With Company"
              accent="#fbbf24"
              icon="clock"
            />

            <StatCard
              value={employee.projects}
              label="Projects Done"
              subtitle="Completed This Month"
              accent="#3b82f6"
              icon="tasks"
            />
          </div>

          {/* Two-col */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.25fr 0.75fr",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {/* Contact */}
            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: "24px",
                height: "fit-content",
                border: "1px solid #eef2f7",
                boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
                marginTop: -2,
              }}
            >
              <div
                style={{
                  width: 55,
                  height: 4,
                  borderRadius: 99,
                  background: "linear-gradient(90deg,#2563eb,#60a5fa)",
                  marginBottom: 14,
                }}
              />
              <h2
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Contact &amp; Details
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                  marginTop: 2,
                  marginBottom: 4,
                }}
              >
                Personal and employment information
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,1fr)",
                  gap: "22px 18px",
                  marginTop: 18,
                }}
              >
                {[
                  { label: "Email", value: employee.email, icon: "mail" },
                  { label: "Phone", value: employee.phone, icon: "phone" },
                  {
                    label: "Location",
                    value: employee.location,
                    icon: "location",
                  },
                  { label: "Joined", value: employee.joined, icon: "calendar" },
                  {
                    label: "Manager",
                    value: employee.manager,
                    icon: "profile",
                  },
                  { label: "Type", value: employee.type, icon: "briefcase" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 18,
                    }}
                  >
                    <>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon d={icons[item.icon]} size={22} stroke={1.7} />
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            marginBottom: 4,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {item.label}
                        </div>

                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#0f172a",
                            letterSpacing: "-0.1px",
                          }}
                        >
                          {item.value}
                        </div>
                      </div>
                    </>
                  </div>
                ))}
              </div>{" "}
            </div>

            {/* Skills + Reports */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                justifyContent: "flex-start",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: "24px",
                  border: "1px solid #eef2f7",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Sora',sans-serif",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  Skills &amp; Expertise
                </h2>
                <p
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    marginTop: 2,
                    marginBottom: 16,
                  }}
                >
                  Technical skills and specialisations
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {employee.skills.map((s) => (
                    <span key={s} className="skill-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 20,
                  padding: "22px",
                  border: "1px solid #eef2f7",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Sora',sans-serif",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  Direct Reports
                </h2>
                <p
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    marginTop: 2,
                    marginBottom: 8,
                  }}
                >
                  Team members reporting to Priya
                </p>
                {employee.reports.map((r) => (
                  <div
                    key={r.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 0",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: r.bg,
                          color: r.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        {r.initials}
                      </div>

                      <div>
                        <h4
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#0f172a",
                            marginBottom: 2,
                          }}
                        >
                          {r.name}
                        </h4>

                        <p
                          style={{
                            fontSize: 13,
                            color: "#64748b",
                          }}
                        >
                          {r.role}
                        </p>
                      </div>
                    </div>

                    <button
                      className="icon-btn"
                      onClick={() => setSelectedMember(r.name)}
                    >
                      <Icon d={icons.message} size={14} />
                    </button>
                  </div>
                ))}
                {selectedMember && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: 12,
                      borderRadius: 12,
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>Message {selectedMember} feature coming soon.</span>

                      <button
                        onClick={() => setSelectedMember("")}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#64748b",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
