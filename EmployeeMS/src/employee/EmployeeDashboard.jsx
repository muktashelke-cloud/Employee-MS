import { useState } from "react";
import { HiOutlineHandRaised } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import {
  IndianRupee,
  Users,
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  ClipboardCheck,
  BarChart3,
  Bell,
  Receipt,
  Wallet,
} from "lucide-react";
// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: "⊞", label: "Dashboard", key: "dashboard" },
  { icon: "◯", label: "Profile", key: "profile" },
  { icon: "▦", label: "Timesheet", key: "timesheet" },
  { icon: "▣", label: "Team Chat", key: "chat", badge: "5", badgeRed: true },
  { icon: "⬡", label: "Documents", key: "docs" },
  { icon: "↗", label: "Performance", key: "performance" },
  { icon: "◎", label: "Helpdesk", key: "helpdesk" },
  { icon: "⚙", label: "Settings", key: "settings" },
];

const KPI_CARDS = [
  {
    label: "Monthly Salary",
    value: "₹25,400",
    sub: "+3.2% this month",
    subGreen: true,
    accent: "#7c3aed",
    lightBg: "#f5f3ff",
    icon: "₹",
  },
  {
    label: "Attendance",
    value: "22/26",
    sub: "84.6% this month",
    subGreen: false,
    accent: "#2563eb",
    lightBg: "#eff6ff",
    icon: "◉",
  },
  {
    label: "Tasks Done",
    value: "18/21",
    sub: "85.7% completion",
    subGreen: true,
    accent: "#0891b2",
    lightBg: "#ecfeff",
    icon: "✓",
  },
  {
    label: "Leave Balance",
    value: "4 days",
    sub: "Out of 12 annual",
    subGreen: false,
    accent: "#059669",
    lightBg: "#ecfdf5",
    icon: "◈",
  },
];

const TASKS_INIT = [
  {
    id: 1,
    title: "Q2 Report Review",
    due: "Due today · High priority",
    badge: "Urgent",
    originalBadge: "Urgent",
    badgeColor: { bg: "#fee2e2", color: "#dc2626" },
    done: false,
  },
  {
    id: 2,
    title: "UI Wireframe Handoff",
    due: "Due 5 Jun · Design team",
    badge: "In Review",
    originalBadge: "In Review",
    badgeColor: { bg: "#dbeafe", color: "#2563eb" },
    done: false,
  },
  {
    id: 3,
    title: "Sprint Planning Prep",
    due: "Due 7 Jun · Engineering",
    badge: "Assigned",
    originalBadge: "Assigned",
    badgeColor: { bg: "#ede9fe", color: "#7c3aed" },
    done: false,
  },
  {
    id: 4,
    title: "Team Training Docs",
    due: "Completed 1 Jun",
    badge: "Done",
    originalBadge: "Done",
    badgeColor: { bg: "#dcfce7", color: "#16a34a" },
    done: true,
  },
  {
    id: 5,
    title: "Client Onboarding Sheet",
    due: "Completed 29 May",
    badge: "Done",
    originalBadge: "Done",
    badgeColor: { bg: "#dcfce7", color: "#16a34a" },
    done: true,
  },
];

const ATTENDANCE_ROWS = [
  { label: "Present", days: "22 days", pct: 84, color: "#059669" },
  { label: "Work From Home", days: "3 days", pct: 11, color: "#2563eb" },
  { label: "Leave Taken", days: "2 days", pct: 7, color: "#d97706" },
  { label: "Absent", days: "1 day", pct: 3, color: "#dc2626" },
  { label: "Half Day", days: "1 day", pct: 3, color: "#7c3aed" },
];

const LEAVES = [
  { type: "Casual Leave", used: 2, total: 6, bal: 4, color: "#059669" },
  { type: "Sick Leave", used: 1, total: 8, bal: 7, color: "#2563eb" },
  { type: "Earned Leave", used: 0, total: 15, bal: 15, color: "#7c3aed" },
  { type: "Comp Off", used: 1, total: 2, bal: 1, color: "#dc2626" },
];

const NOTIFS = [
  {
    icon: "salary",
    bg: "#fef9ec",
    color: "#d97706",
    title: "Salary credited",
    body: "May 2026 payslip is ready",
    time: "2 hrs ago",
  },
  {
    icon: "leave",
    bg: "#eff6ff",
    color: "#2563eb",
    title: "Leave approved",
    body: "2 Jun request approved",
    time: "Yesterday",
  },
  {
    icon: "task",
    bg: "#f5f3ff",
    color: "#7c3aed",
    title: "New task assigned",
    body: "Sprint Planning Prep",
    time: "Yesterday",
  },
];

const PAYSLIP_ROWS = [
  { label: "Basic Salary", value: "₹18,000", color: "#334155" },
  { label: "HRA", value: "₹5,400", color: "#334155" },
  { label: "Allowances", value: "+₹4,200", color: "#059669" },
  { label: "PF Deduction", value: "-₹2,200", color: "#dc2626" },
];

// ─── STYLES (all inline — no Tailwind dependency) ────────────────────────────
const cardHoverProps = {
  onMouseEnter: (e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 20px 40px rgba(124,58,237,0.16)";
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
  },
};

const S = {
  shell: {
    display: "flex",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
    fontFamily: "'Inter','Segoe UI',sans-serif",
    background: "#f1f5f9",
  },
  // Sidebar
  sidebar: {
    width: 230,
    minWidth: 230,
    height: "100vh",
    background: "#1e293b",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  sbBrand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "20px 20px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  sbLogoWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "linear-gradient(135deg,#7c3aed,#2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
  },
  sbTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.02em",
  },
  sbSub: {
    fontSize: 9.5,
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  sbNav: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 10px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  sbFooter: {
    padding: "12px 10px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  sbLogout: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 12px",
    borderRadius: 10,
    cursor: "pointer",
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    background: "none",
    border: "none",
    width: "100%",
  },
  // Topbar
  topbar: {
    height: 60,
    minHeight: 60,
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    gap: 12,
    flexShrink: 0,
  },
  tbSearch: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 12px",
    borderRadius: 10,
    height: 36,
    minWidth: 260,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    cursor: "text",
  },
  tbDivider: { width: 1, height: 24, background: "#e2e8f0", flexShrink: 0 },
  tbIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    position: "relative",
    fontSize: 16,
    color: "#64748b",
  },
  tbChip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingLeft: 4,
    paddingRight: 12,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 24,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    cursor: "pointer",
  },
  // Content
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 24px 24px",
    background: "#f1f5f9",
  },
  // Cards
  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "13px 20px",
    borderBottom: "1px solid #f1f5f9",
  },
};

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

function Sidebar({ active, setActive }) {
  return (
    <aside style={S.sidebar}>
      {/* Brand */}
      <div style={S.sbBrand}>
        <div style={S.sbLogoWrap}>E</div>
        <div>
          <div style={S.sbTitle}>EmployeMS</div>
          <div style={S.sbSub}>Enterprise Suite</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={S.sbNav}>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? "#7c3aed" : "rgba(255,255,255,0.45)",
                background: isActive ? "rgba(124,58,237,0.12)" : "transparent",
                border: "none",
                width: "100%",
                textAlign: "left",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                }
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  width: 20,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "2px 7px",
                    borderRadius: 20,
                    fontFamily: "monospace",
                    background: item.badgeRed
                      ? "rgba(220,38,38,0.15)"
                      : "rgba(124,58,237,0.18)",
                    color: item.badgeRed ? "#f87171" : "#a78bfa",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={S.sbFooter}>
        <button
          style={S.sbLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.4)";
            e.currentTarget.style.background = "none";
          }}
        >
          <span style={{ fontSize: 16 }}>⎋</span> Logout
        </button>
      </div>
    </aside>
  );
}

// ─── TOPBAR ──────────────────────────────────────────────────────────────────

function Topbar() {
  return (
    <header style={S.topbar}>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          Employee Panel
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#1e293b",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Dashboard
        </div>
      </div>

      {/* Search */}
      <div style={S.tbSearch}>
        <span style={{ color: "#94a3b8", fontSize: 15 }}>⌕</span>
        <span style={{ fontSize: 12.5, color: "#94a3b8" }}>
          Search anything...
        </span>
      </div>

      <div style={S.tbDivider} />
      <span
        style={{
          fontSize: 12,
          color: "#94a3b8",
          whiteSpace: "nowrap",
          fontFamily: "monospace",
        }}
      ></span>
      <div style={S.tbDivider} />

      {/* Icon buttons */}
      {[
        { icon: "📅", label: "Calendar" },
        { icon: "🔔", label: "Notifications", dot: true },
        { icon: "?", label: "Help" },
      ].map((btn) => (
        <button
          key={btn.label}
          aria-label={btn.label}
          style={S.tbIconBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ede9fe";
            e.currentTarget.style.color = "#7c3aed";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          {btn.icon}
          {btn.dot && (
            <span
              style={{
                position: "absolute",
                width: 7,
                height: 7,
                background: "#ef4444",
                borderRadius: "50%",
                top: 7,
                right: 7,
                border: "1.5px solid #fff",
              }}
            />
          )}
        </button>
      ))}

      {/* User chip */}
      <div
        style={S.tbChip}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f3ff")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#7c3aed,#2563eb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            fontFamily: "monospace",
            flexShrink: 0,
          }}
        >
          RP
        </div>
        <div>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "#1e293b",
              lineHeight: 1.1,
            }}
          >
            Riya Patil
          </div>
          <div
            style={{
              fontSize: 9,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Employee
          </div>
        </div>
        <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 2 }}>▾</span>
      </div>
    </header>
  );
}

// ─── KPI GRID ────────────────────────────────────────────────────────────────

function KpiGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 12,
        marginBottom: 16,
      }}
    >
      {KPI_CARDS.map((k) => (
        <div
          key={k.label}
          style={{
            ...S.card,
            position: "relative",
            padding: 18,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          {...cardHoverProps}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: k.accent,
              borderRadius: "16px 16px 0 0",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            {k.label === "Monthly Salary" ? (
              <IndianRupee size={20} strokeWidth={1.8} color={k.accent} />
            ) : k.label === "Attendance" ? (
              <Users size={20} strokeWidth={1.8} color={k.accent} />
            ) : k.label === "Tasks Done" ? (
              <BadgeCheck size={20} strokeWidth={1.8} color={k.accent} />
            ) : (
              <CalendarDays size={20} strokeWidth={1.8} color={k.accent} />
            )}

            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                color: "#64748b",
                fontWeight: 600,
              }}
            >
              {k.label}
            </div>
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1e293b",
              fontFamily: "monospace",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginBottom: 6,
            }}
          >
            {k.value}
          </div>
          <div
            style={{
              fontSize: 12,
              color: k.subGreen ? "#059669" : "#94a3b8",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {k.subGreen ? "↑" : "·"} {k.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TASKS PANEL ─────────────────────────────────────────────────────────────

function TasksPanel({ tasks, onToggle, onViewAll }) {
  return (
    <div
      style={{
        ...S.card,
        transition: "all 0.3s ease",
      }}
      {...cardHoverProps}
    >
      <div style={{ ...S.cardHeader, height: 42 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 13.5,
            color: "#1e293b",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <ClipboardList size={16} strokeWidth={1.8} color="#64748b" />
          My Tasks
        </div>
        <button
          onClick={onViewAll}
          style={{
            fontSize: 12,
            color: "#7c3aed",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          View all →
        </button>
      </div>
      <div style={{ padding: "2px 20px" }}>
        {tasks.map((t, i) => (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 0",
              borderBottom: i < tasks.length - 1 ? "1px solid #f8fafc" : "none",
            }}
          >
            <button
              onClick={() => onToggle(t.id)}
              style={{
                width: 18,
                height: 18,
                borderRadius: 6,
                border: t.done ? "none" : "1.5px solid #cbd5e1",
                background: t.done ? "#7c3aed" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              {t.done && (
                <span style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>
                  ✓
                </span>
              )}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: t.done ? "#94a3b8" : "#1e293b",
                  textDecoration: t.done ? "line-through" : "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {t.title}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                {t.due}
              </div>
            </div>
            <span
              style={{
                fontSize: 10,
                padding: "3px 9px",
                borderRadius: 20,
                fontWeight: 600,
                whiteSpace: "nowrap",
                background: t.badgeColor.bg,
                color: t.badgeColor.color,
              }}
            >
              {t.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ATTENDANCE PANEL ────────────────────────────────────────────────────────

function AttendancePanel({ onRecords }) {
  return (
    <div
      style={{
        ...S.card,
        height: 330,
        transition: "all 0.3s ease",
      }}
      {...cardHoverProps}
    >
      <div style={{ ...S.cardHeader, height: 45 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 13.5,
            color: "#1e293b",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <BarChart3 size={16} strokeWidth={1.8} color="#64748b" />
          Attendance Breakdown
        </div>
        <button
          onClick={onRecords}
          style={{
            fontSize: 12,
            color: "#7c3aed",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Records →
        </button>
      </div>
      <div style={{ padding: "16px 20px" }}>
        {ATTENDANCE_ROWS.map((r) => (
          <div key={r.label} style={{ marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                marginBottom: 6,
              }}
            >
              <span style={{ color: "#64748b" }}>{r.label}</span>
              <span
                style={{
                  color: "#334155",
                  fontFamily: "monospace",
                  fontWeight: 500,
                }}
              >
                {r.days}
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: "#f1f5f9",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${r.pct}%`,
                  background: r.color,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16,
            paddingTop: 12,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          {[
            { val: "96.2h", label: "Total Hours", color: "#1e293b" },
            { val: "09:08", label: "Avg Check-in", color: "#059669" },
            { val: "18:22", label: "Avg Check-out", color: "#d97706" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: s.color,
                  fontFamily: "monospace",
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginTop: 2,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LEAVE PANEL ─────────────────────────────────────────────────────────────

function LeavePanel({ onApply }) {
  return (
    <div
      style={{
        ...S.card,
        transition: "all 0.3s ease",
      }}
      {...cardHoverProps}
    >
      <div style={S.cardHeader}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 13.5,
            color: "#1e293b",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CalendarDays size={16} strokeWidth={1.8} color="#64748b" />
          Leave Balance
        </div>
        <button
          onClick={onApply}
          style={{
            fontSize: 12,
            cursor: "pointer",
            fontWeight: 600,
            border: "none",

            background: "none",
            color: "#7c3aed",
          }}
        >
          + Apply
        </button>
      </div>
      <div>
        {LEAVES.map((lv, i) => (
          <div
            key={lv.type}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 20px",
              borderBottom:
                i < LEAVES.length - 1 ? "1px solid #f8fafc" : "none",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: lv.color,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{ fontSize: 12.5, fontWeight: 500, color: "#334155" }}
              >
                {lv.type}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                Used {lv.used} of {lv.total}
              </div>
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: lv.color,
                fontFamily: "monospace",
              }}
            >
              {lv.bal}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS PANEL ─────────────────────────────────────────────────────

function NotifsPanel({ onViewAll }) {
  return (
    <div
      style={{
        ...S.card,
        transition: "all 0.3s ease",
      }}
      {...cardHoverProps}
    >
      <div style={S.cardHeader}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "inline-flex",
            }}
          >
            <Bell size={18} strokeWidth={1.8} color="#64748b" />

            <span
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ef4444",
              }}
            />
          </div>

          <span
            style={{
              fontWeight: 600,
              fontSize: 13.5,
              color: "#1e293b",
            }}
          >
            Notifications
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            onClick={onViewAll}
            style={{
              fontSize: 12,
              color: "#7c3aed",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            View all →
          </button>
        </div>
      </div>
      <div>
        {NOTIFS.map((n, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              padding: "10px 20px",
              borderBottom:
                i < NOTIFS.length - 1 ? "1px solid #f8fafc" : "none",
            }}
          >
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              {n.icon === "salary" ? (
                <Wallet size={17} color="#16a34a" strokeWidth={2} />
              ) : n.icon === "leave" ? (
                <BadgeCheck size={17} color="#2563eb" strokeWidth={2} />
              ) : (
                <ClipboardCheck size={17} color="#7c3aed" strokeWidth={2} />
              )}
            </div>
            <div>
              <div
                style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.5 }}
              >
                <span style={{ fontWeight: 600, color: "#1e293b" }}>
                  {n.title}
                </span>{" "}
                — {n.body}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                {n.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAYSLIP PANEL ───────────────────────────────────────────────────────────

function PayslipPanel({ month, onView }) {
  return (
    <div
      style={{
        ...S.card,
        transition: "all 0.3s ease",
      }}
      {...cardHoverProps}
    >
      <div style={S.cardHeader}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 13.5,
            color: "#1e293b",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Receipt size={16} strokeWidth={1.8} color="#64748b" />
          {month} Payslip
        </div>
        <button
          onClick={onView}
          style={{
            fontSize: 12,
            color: "#7c3aed",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          View Payslip →
        </button>
      </div>
      <div>
        {PAYSLIP_ROWS.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "11px 20px",
              borderBottom: "1px solid #f8fafc",
            }}
          >
            <span style={{ fontSize: 12.5, color: "#64748b" }}>{r.label}</span>
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                fontFamily: "monospace",
                color: r.color,
              }}
            >
              {r.value}
            </span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 20px",
            background: "linear-gradient(90deg,#faf5ff,#f5f3ff)",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
            Net Salary
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "#7c3aed",
              fontFamily: "monospace",
            }}
          >
            ₹25,400
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default function EmployeeDashboardLight() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [tasks, setTasks] = useState(TASKS_INIT);
  const navigate = useNavigate();
  const currentMonthYear = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const toggleTask = (id) =>
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        const isDone = !t.done;

        return {
          ...t,
          done: isDone,
          badge: isDone
            ? "Done"
            : t.id === 1
              ? "Urgent"
              : t.id === 2
                ? "In Review"
                : "Assigned",
          badgeColor: isDone
            ? { bg: "#dcfce7", color: "#16a34a" }
            : t.id === 1
              ? { bg: "#fee2e2", color: "#dc2626" }
              : t.id === 2
                ? { bg: "#dbeafe", color: "#2563eb" }
                : { bg: "#ede9fe", color: "#7c3aed" },
        };
      }),
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "24px",
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}
    >
      <main>
        {/* Welcome */}
        <div style={{ marginTop: "-8px", marginBottom: 2 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 20,
              fontWeight: 700,
              color: "#1e293b",
            }}
          >
            Good Morning, Riya
            <HiOutlineHandRaised size={16} style={{ color: "#cbd5e1" }} />
          </div>
        </div>

        <KpiGrid />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <TasksPanel
            tasks={tasks}
            onToggle={toggleTask}
            onViewAll={() => navigate("/employee/tasks")}
          />
          <AttendancePanel onRecords={() => navigate("/employee/attendance")} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
          }}
        >
          <LeavePanel onApply={() => navigate("/employee/leave?apply=true")} />
          <NotifsPanel onViewAll={() => navigate("/employee/notifications")} />
          <PayslipPanel
            month={currentMonthYear}
            onView={() => navigate("/employee/payslip")}
          />
        </div>
      </main>
    </div>
  );
}
