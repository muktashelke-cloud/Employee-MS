import { useState, useEffect } from "react";
import {
  Search,
  Activity,
  ShieldCheck,
  Hourglass,
  FileText,
  TimerReset,
  CalendarRange,
  Pencil,
  Trash2,
  Users,
  Monitor,
  DollarSign,
  PieChart,
  ChevronDown,
  TrendingUp,
  LayoutDashboard,
  Clock3,
} from "lucide-react";

const PROJECTS = [
  "Employee Management System",
  "HR Portal Redesign",
  "Payroll Automation",
  "Internal Dashboard",
];
const TASKS = {
  "Employee Management System": [
    "UI Development",
    "API Integration",
    "Testing & QA",
    "Bug Fixes",
  ],
  "HR Portal Redesign": ["Wireframing", "Component Design", "Frontend Build"],
  "Payroll Automation": ["Backend Logic", "Report Generation"],
  "Internal Dashboard": ["Data Visualisation", "Performance Tuning"],
};

const initialEntries = [
  {
    id: 1,
    date: "Mon, Jun 2",
    project: "Employee Management System",
    task: "UI Development",
    hours: 7.5,
    status: "approved",
    notes: "Leave management page redesign",
  },
  {
    id: 2,
    date: "Mon, Jun 2",
    project: "HR Portal Redesign",
    task: "Wireframing",
    hours: 1.0,
    status: "approved",
    notes: "Initial wireframes for dashboard",
  },
  {
    id: 3,
    date: "Tue, Jun 3",
    project: "Employee Management System",
    task: "API Integration",
    hours: 8.0,
    status: "approved",
    notes: "Connected leave APIs",
  },
  {
    id: 4,
    date: "Wed, Jun 4",
    project: "Payroll Automation",
    task: "Backend Logic",
    hours: 6.5,
    status: "pending",
    notes: "Tax calculation module",
  },
  {
    id: 5,
    date: "Wed, Jun 4",
    project: "Employee Management System",
    task: "Testing & QA",
    hours: 2.0,
    status: "pending",
    notes: "End-to-end flow tests",
  },
  {
    id: 6,
    date: "Thu, Jun 5",
    project: "Internal Dashboard",
    task: "Data Visualisation",
    hours: 7.0,
    status: "pending",
    notes: "Charts for attendance analytics",
  },
  {
    id: 7,
    date: "Fri, Jun 6",
    project: "Employee Management System",
    task: "Bug Fixes",
    hours: 5.5,
    status: "draft",
    notes: "Fixed date picker edge case",
  },
];
const projectMeta = [
  {
    key: "Employee Management System",
    Icon: Users,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    barColor: "bg-indigo-500",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-600",
  },
  {
    key: "HR Portal Redesign",
    Icon: LayoutDashboard,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-500",
    barColor: "bg-rose-500",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-500",
  },
  {
    key: "Payroll Automation",
    Icon: DollarSign,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    barColor: "bg-emerald-500",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-600",
  },
  {
    key: "Internal Dashboard",
    Icon: Monitor,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    barColor: "bg-amber-400",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-600",
  },
];

const DAYS = [
  "Mon, Jun 2",
  "Tue, Jun 3",
  "Wed, Jun 4",
  "Thu, Jun 5",
  "Fri, Jun 6",
  "Sat, Jun 7",
  "Sun, Jun 8",
];

// ─── Helpers ───────────────────────────────────────────────────────────────
const statusCfg = {
  approved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    label: "Approved",
  },
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
    label: "Pending",
  },
  draft: {
    bg: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-200",
    dot: "bg-slate-400",
    label: "Draft",
  },
  rejected: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    dot: "bg-red-500",
    label: "Rejected",
  },
};

const StatusBadge = ({ status }) => {
  const c = statusCfg[status] || statusCfg.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

// ─── Log Entry Modal ────────────────────────────────────────────────────────
const LogModal = ({ isOpen, onClose, onSave, editData }) => {
  const [form, setForm] = useState({
    date: DAYS[0],
    project: PROJECTS[0],
    task: TASKS[PROJECTS[0]][0],
    hours: "",
    notes: "",
  });
  useEffect(() => {
    if (editData) {
      setForm({
        date: editData.date,
        project: editData.project,
        task: editData.task,
        hours: editData.hours,
        notes: editData.notes || "",
      });
    } else {
      setForm({
        date: DAYS[0],
        project: PROJECTS[0],
        task: TASKS[PROJECTS[0]][0],
        hours: "",
        notes: "",
      });
    }
  }, [editData, isOpen]);
  const tasks = TASKS[form.project] || [];

  const handleProjectChange = (p) =>
    setForm({ ...form, project: p, task: TASKS[p][0] });

  const handleSave = () => {
    if (!form.hours || isNaN(form.hours)) return;

    onSave({
      ...form,

      hours: parseFloat(form.hours),

      status: editData?.status || "draft",

      id: editData?.id || Date.now(),
    });

    onClose();
  };

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[430px] mx-4 shadow-2xl"
        style={{ animation: "slideUp .22s ease" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Clock3 size={18} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {editData ? "Edit Entry" : "Log Time"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {editData
                  ? "Update your timesheet entry"
                  : "Add a new timesheet entry"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all text-sm"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <select
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            >
              {DAYS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Project
            </label>
            <select
              value={form.project}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            >
              {PROJECTS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Task
            </label>
            <select
              value={form.task}
              onChange={(e) => setForm({ ...form, task: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            >
              {tasks.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Hours Worked
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.5"
                max="12"
                step="0.5"
                placeholder="e.g. 7.5"
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all pr-12 placeholder-slate-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                hrs
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Notes{" "}
              <span className="text-slate-300 font-normal normal-case">
                (optional)
              </span>
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="What did you work on?"
              rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none placeholder-slate-300"
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <span>{editData ? "✏️" : "💾"}</span>

            {editData ? "Update Entry" : "Save Timesheet"}
          </button>
        </div>
      </div>
      <style>{`@keyframes slideUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
};

// ─── Weekly Bar Chart (pure CSS) ───────────────────────────────────────────
const WeeklyChart = ({ entries }) => {
  const dayTotals = DAYS.slice(0, 5).map((day) => ({
    day: day.split(",")[0],
    hours: entries
      .filter((e) => e.date === day)
      .reduce((s, e) => s + e.hours, 0),
  }));
  const maxH = Math.max(...dayTotals.map((d) => d.hours), 8);

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 rounded-3xl border border-slate-100 px-6 pt-8 pb-8 shadow-sm"
      style={{
        backgroundImage: `
    linear-gradient(to right, rgba(99,102,241,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(99,102,241,0.05) 1px, transparent 1px)
  `,
        backgroundSize: "32px 32px",
      }}
    >
     <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-200/10 rounded-full blur-2xl pointer-events-none" />
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">
            Weekly Overview
          </h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
            Hours logged per day
          </p>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-1 rounded-full border border-indigo-100">
          {dayTotals.reduce((s, d) => s + d.hours, 0).toFixed(1)} hrs total
        </span>
      </div>
      <div className="flex items-end gap-4 h-[188px] mt-3">
        {dayTotals.map(({ day, hours }, index) => {
          const pct = maxH > 0 ? (hours / maxH) * 100 : 0;
          const gradients = [
            "bg-gradient-to-t from-violet-600 to-indigo-400",
            "bg-gradient-to-t from-blue-600 to-cyan-400",
            "bg-gradient-to-t from-pink-600 to-fuchsia-400",
            "bg-gradient-to-t from-emerald-600 to-green-400",
            "bg-gradient-to-t from-amber-500 to-yellow-300",
          ];

          const color = gradients[index];
          return (
            <div key={day} className="flex-1 h-full flex flex-col items-center">
              <span className="text-sm font-bold text-slate-700 mb-2">
                {hours > 0 ? hours : ""}
              </span>

              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-[70%] mx-auto rounded-t-[20px] ${color}
            shadow-[0_8px_20px_rgba(99,102,241,0.25)]
            transition-all duration-300 hover:scale-105`}
                  style={{
                    height: `${pct}%`,
                    minHeight: hours > 0 ? "6px" : "0",
                  }}
                />
              </div>

              <span className="text-xs text-slate-400 font-medium mt-1">
                {day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 w-full rounded-xl bg-violet-50 border border-violet-100 px-3 py-1.5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
          ⭐
        </div>

        <p className="text-sm text-slate-700">
          Great job! You logged{" "}
          <span className="font-bold text-violet-600">12%</span> more hours than
          last week.
        </p>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────
export default function EmployeeTimesheet() {
  const [entries, setEntries] = useState(initialEntries);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [period, setPeriod] = useState("This Week");
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const totalHours = entries.reduce((s, e) => s + e.hours, 0);
  const billableHours = entries
    .filter((e) => e.status === "approved")
    .reduce((s, e) => s + e.hours, 0);
  const pendingHours = entries
    .filter((e) => e.status === "pending")
    .reduce((s, e) => s + e.hours, 0);
  const draftCount = entries.filter((e) => e.status === "draft").length;

  const filtered = entries.filter((e) => {
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    const matchSearch =
      e.project.toLowerCase().includes(search.toLowerCase()) ||
      e.task.toLowerCase().includes(search.toLowerCase()) ||
      e.notes.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / entriesPerPage);

  const paginatedEntries = filtered.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );

  const handleSave = (entry) => {
    if (editData) {
      setEntries(
        entries.map((e) =>
          e.id === editData.id ? { ...entry, id: editData.id } : e,
        ),
      );

      setEditData(null);
    } else {
      setEntries([entry, ...entries]);
    }

    setCurrentPage(1);
  };
  const handleEdit = (row) => {
    setEditData(row);

    setModalOpen(true);
  };

  return (
    <div className="flex bg-slate-50 font-sans">
      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto px-6 pt-3 pb-6 space-y-3">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-4 gap-3">
          {[
            {
              label: "Total Hours",
              value: totalHours.toFixed(1),
              icon: <TimerReset size={20} strokeWidth={2.5} />,
              bar: "bg-indigo-500",
              iconBg: "text-indigo-700",
              unit: "hrs",
            },
            {
              label: "Approved Hours",
              value: billableHours.toFixed(1),
              icon: <ShieldCheck size={20} strokeWidth={2.5} />,
              bar: "bg-emerald-500",
              iconBg: "text-emerald-700",
              unit: "hrs",
            },
            {
              label: "Pending Hours",
              value: pendingHours.toFixed(1),
              icon: <Hourglass size={20} strokeWidth={2.5} />,
              bar: "bg-amber-400",
              iconBg: "text-amber-700",
              unit: "hrs",
            },
            {
              label: "Draft Entries",
              value: draftCount,
              icon: <FileText size={20} strokeWidth={2.5} />,
              bar: "bg-slate-400",
              iconBg: "text-slate-700",
              unit: "logs",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-3xl border border-slate-100 p-3 relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`absolute top-4 right-4 ${s.iconBg}`}>
                {s.icon}
              </div>

              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">
                {s.label}
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {s.value}{" "}
                <span className="text-sm font-normal text-slate-400">
                  {s.unit}
                </span>
              </p>
              <div
                className={`absolute bottom-0 left-0 right-0 h-[3px] ${s.bar}`}
              />
            </div>
          ))}
        </div>

        {/* ── Two-col: Chart + Summary ── */}
        <div className="grid grid-cols-[1.5fr_1fr] gap-4 items-start">
          <WeeklyChart entries={entries} />

          {/* Project Breakdown */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-100 pt-0 pb-3.5 px-0 shadow-sm min-h-[350px]">
            <div className="flex items-center justify-between px-5 pt-3 pb-1">
              <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
                Project Breakdown
              </h3>

              <div className="relative">
                <button
                  onClick={() => setShowPeriodMenu(!showPeriodMenu)}
                  className="flex items-center gap-0.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1.5 shadow-sm"
                >
                  {period}

                  <ChevronDown size={13} />
                </button>

                {showPeriodMenu && (
                  <div className="absolute right-0 top-10 w-32 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-30">
                    {["This Week", "Last Week", "This Month"].map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setPeriod(item);
                          setShowPeriodMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 px-8 pb-2.5 border-b border-slate-100">
              <div className="relative w-[58px] h-[58px] flex-shrink-0">
                <svg width="58" height="58" viewBox="0 0 72 72">
                  {/* Background */}
                  <circle
                    cx="36"
                    cy="36"
                    r="30"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="6"
                  />

                  {/* Employee Management - 61% */}
                  <circle
                    cx="36"
                    cy="36"
                    r="30"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="115 188.5"
                    strokeDashoffset="0"
                    transform="rotate(-90 36 36)"
                  />

                  {/* Internal Dashboard - 19% */}
                  <circle
                    cx="36"
                    cy="36"
                    r="30"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="36 188.5"
                    strokeDashoffset="-120"
                    transform="rotate(-90 36 36)"
                  />

                  {/* Payroll - 17% */}
                  <circle
                    cx="36"
                    cy="36"
                    r="30"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="32 188.5"
                    strokeDashoffset="-160"
                    transform="rotate(-90 36 36)"
                  />

                  {/* HR Portal - 3% */}
                  <circle
                    cx="36"
                    cy="36"
                    r="30"
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="6 188.5"
                    strokeDashoffset="-194"
                    transform="rotate(-90 36 36)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[16px] font-bold text-slate-800 leading-none">
                    37.5
                  </span>

                  <span className="text-[9px] font-semibold text-slate-400 uppercase">
                    HRS
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Total this week
                </p>

                <p className="text-xl font-bold text-slate-900">
                  {totalHours.toFixed(1)}
                  <span className="text-xs text-slate-400 ml-1">hrs</span>
                </p>

                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={11} className="text-emerald-500" />
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    12%
                  </span>
                  <span className="text-[10px] text-slate-400">
                    vs last week
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-1.5 flex flex-col gap-1">
              {projectMeta.map((meta) => {
                const hrs = entries
                  .filter((e) => e.project === meta.key)
                  .reduce((s, e) => s + e.hours, 0);

                if (!hrs) return null;

                const pct =
                  totalHours > 0 ? Math.round((hrs / totalHours) * 100) : 0;

                const { Icon } = meta;

                return (
                  <div
                    key={meta.key}
                    className="flex items-center gap-8 px-0.5 py-0.5 rounded-xl hover:bg-slate-50"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${meta.iconBg}
          flex items-center justify-center`}
                    >
                      <Icon size={18} className={meta.iconColor} />
                    </div>

                    <div className="flex-1 min-w-0 max-w-[280px]">
                      <p className="text-[12px] font-medium text-slate-700 truncate leading-tight">
                        {meta.key}
                      </p>

                      <div className="h-[6px] bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full ${meta.barColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-slate-800">
                        {hrs}h
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${meta.badgeBg} ${meta.badgeText}`}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mx-6 mb-0 mt-2 flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3 py-1">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                </div>

                <div>
                  <p className="text-[12px] font-semibold text-slate-700">
                    4 Active Projects
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Running this week
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-base">
                📂
              </div>
            </div>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-50 flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setEditData(null);

                  setModalOpen(true);
                }}
                className="h-11 w-[150px] flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                <span className="text-base font-bold">+</span>
                Log Time
              </button>
            </div>
            <div className="flex items-center gap-4">
              {/* Status Filter Pills */}
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 w-[150px] border border-slate-200 rounded-xl px-4 text-sm text-slate-600 bg-white shadow-sm outline-none focus:border-indigo-400"
              >
                <option value="all"> Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="draft">Draft</option>
              </select>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-11 min-w-[150px] border border-slate-200 rounded-xl px-4 text-sm text-slate-600 bg-white shadow-sm outline-none focus:border-indigo-400"
              >
                <option value={5}>5 Entries</option>
                <option value={10}>10 Entries</option>
                <option value={15}>15 Entries</option>
              </select>
              <div className="h-11 w-[260px] flex items-center gap-2 border border-slate-200 rounded-xl px-4 bg-white shadow-sm">
                <Search
                  size={16}
                  strokeWidth={2}
                  className="text-slate-400 flex-shrink-0"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search entries..."
                  className="flex-1 bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-hidden">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 border-b border-slate-200 shadow-sm">
                  {[
                    "Date",
                    "Project",
                    "Task",
                    "Hours",
                    "Notes",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`w-[170px] px-3 py-3 text-xs font-bold text-slate-700 uppercase tracking-[0.12em] border-b border-slate-200 ${
                        h === "Date"
                          ? "w-[125px] text-center"
                          : h === "Project"
                            ? "w-[230px] text-center"
                            : h === "Task"
                              ? "w-[180px] text-center"
                              : h === "Hours"
                                ? "w-[100px] text-center"
                                : h === "Notes"
                                  ? "w-[220px] text-center"
                                  : h === "Status"
                                    ? "w-[180px] text-center"
                                    : h === "Actions"
                                      ? "w-[120px] text-center"
                                      : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedEntries.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-slate-50 hover:bg-indigo-50/30 transition-colors ${i % 2 !== 0 ? "bg-slate-50/40" : ""}`}
                  >
                    <td className="w-[120px] px-4 py-1">
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center ">
                          <CalendarRange
                            size={14}
                            strokeWidth={2}
                            className="text-indigo-600"
                          />
                        </div>
                        {row.date}
                      </span>
                    </td>
                    <td className="w-[190px] px-3 py-1">
                      <span className="text-sm text-slate-700 font-medium">
                        {row.project}
                      </span>
                    </td>
                    <td className="w-[180px] px-5 py-1">
                      <span className="inline-flex whitespace-nowrap text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md font-medium">
                        {row.task}
                      </span>
                    </td>
                    <td className="w-[100px] px-5 py-1 text-center">
                      <span className="text-sm font-bold text-indigo-600">
                        {row.hours}h
                      </span>
                    </td>
                    <td className="w-[180px] px-3 py-1 text-xs text-slate-400 truncate text-center">
                      {row.notes || "—"}
                    </td>
                    <td className="w-[220px] px-5 py-1">
                      <div className="flex justify-center pl-8">
                        <StatusBadge status={row.status} />
                      </div>
                    </td>
                    <td className="w-[170px] px-6 py-3">
                      <div className="flex items-center justify-end gap-4 pr-8">
                        <button
                          onClick={() => handleEdit(row)}
                          className="text-indigo-500 hover:text-indigo-700 transition-all"
                        >
                          <Pencil size={15} />
                        </button>
                        <span className="text-slate-200">|</span>
                        <button
                          onClick={() =>
                            setEntries(entries.filter((e) => e.id !== row.id))
                          }
                          className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-slate-400"
                    >
                      No timesheet entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-2 border-t border-slate-50 flex-wrap gap-3">
            <p className="text-xs text-slate-400">
              Showing {paginatedEntries.length} of {filtered.length} entries
              {" · "}
              <span className="font-semibold text-indigo-600">
                {filtered.reduce((s, e) => s + e.hours, 0).toFixed(1)} hrs
              </span>{" "}
              logged
            </p>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40"
                >
                  ←
                </button>

                <span className="text-sm font-medium text-slate-600 min-w-[50px] text-center">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Log Time Modal ── */}
      <LogModal
        isOpen={modalOpen}
        editData={editData}
        onClose={() => {
          setModalOpen(false);

          setEditData(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
