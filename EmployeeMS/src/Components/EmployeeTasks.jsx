import React, { useEffect, useState, useRef } from "react";
import api from "../utils/api";

import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Target } from "lucide-react";
import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  CalendarDays,
  Rocket,
  Monitor,
} from "lucide-react";

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/allocations/my");
      console.log("API DATA:", res.data.data);

      if (res.data.status) {
        setTasks(
          res.data.data.map((t) => ({
            ...t,
            percentage: Number(t.percentage) || 0,
          })),
        );
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.log(err);
      setTasks([]);
    }
  };

  // Status order
  const statusOrder = {
    Urgent: 1,
    "In Review": 2,
    Assigned: 3,
    Pending: 4,
    Done: 5,
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status],
  );

  // 🔥 Group by project
  const groupedTasks = sortedTasks.reduce((acc, task) => {
    if (!acc[task.project]) {
      acc[task.project] = [];
    }
    acc[task.project].push(task);
    return acc;
  }, {});

  // 🎯 Status
  const getStatus = (task) => {
    return task.status || "Assigned";
  };

  // 🎨 Color
  const getColor = (p) => {
    if (p === 100) return "#4caf50";
    if (p > 0) return "#ff9800";
    return "#f44336";
  };

  // 🔁 Update %
  const handleChange = (taskId, value) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, percentage: value } : t,
    );
    setTasks(updated);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await api.put("/employee/update-percentage", {
          task_id: taskId,
          percentage: value,
        });

        toast.success("Saved successfully ✅");
      } catch (err) {
        toast.error("Update failed ❌");
      }
    }, 500);
  };

  // 📊 Overall Progress
  const total = tasks.reduce((sum, t) => sum + (Number(t.percentage) || 0), 0);
  const avg = tasks.length ? Math.round(total / tasks.length) : 0;
  const completedTasks = tasks.filter(
    (t) => Number(t.percentage) === 100,
  ).length;

  const progressTasks = tasks.filter(
    (t) => Number(t.percentage) > 0 && Number(t.percentage) < 100,
  ).length;

  const pendingTasks = tasks.filter((t) => Number(t.percentage) === 0).length;

  const doneCount = tasks.filter((t) => t.status === "Done").length;

  const reviewCount = tasks.filter((t) => t.status === "In Review").length;

  const assignedCount = tasks.filter((t) => t.status === "Assigned").length;

  const urgentCount = tasks.filter((t) => t.status === "Urgent").length;

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-3">
      <div className="mx-auto max-w-[1400px] min-h-[calc(100vh-100px)] flex flex-col">
        {/* HEADER */}
        <div className="mb-3">
          <div>
            <div className="mb-2">
              <p className="text-base font-semibold text-slate-800">
                Welcome,{" "}
                <span className="text-indigo-600">
                  {user?.name?.split(" ")[0]}
                </span>{" "}
                👋
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Let's check today's progress
              </p>
            </div>
          </div>
        </div>
        <div className="relative mb-3 overflow-hidden rounded-[24px] border border-slate-100 bg-gradient-to-r from-blue-50 via-white to-slate-50 py-3 px-5 shadow-[0_20px_50px_rgba(59,130,246,0.10)]">
          <div className="absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-blue-500 to-violet-500" />
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold uppercase tracking-[0.15em] text-slate-800">
                  Overall Progress
                </p>

                <span className="rounded-full border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
                  In Progress
                </span>
              </div>

              <h2 className="mt-1 text-[52px] leading-none font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                {avg}%
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-600">
                {doneCount} of {tasks.length} tasks completed
              </p>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.35)]"
                  style={{ width: `${avg}%` }}
                />
              </div>
            </div>
            {/* RIGHT IMAGE */}
            <div className="absolute right-6 top-[38%] -translate-y-1/2 hidden lg:block">
              <img
                src="/task-management-illustration-png-5858311.webp"
                alt="Task Illustration"
                className="w-52 h-50 object-contain opacity-90"
              />
            </div>
          </div>
        </div>

        {/* STATS */}

        <div className="mb-2 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative overflow-hidden bg-white rounded-[28px] border border-slate-100 px-6 py-3 h-[110px] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
            <div className="absolute top-0 left-0 h-[3px] w-full bg-slate-500" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Total Tasks
                </p>

                <h2 className="mt-2 text-[36px] leading-none font-semibold tracking-tight text-slate-800">
                  {tasks.length}
                </h2>
                <p className="mt-1 text-xs text-slate-400">Assigned tasks</p>
              </div>

              <ClipboardList
                size={24}
                strokeWidth={2}
                className="text-slate-500"
              />
            </div>
          </div>

          <div className="relative overflow-hidden bg-white rounded-[28px] border border-slate-100 px-6 py-3 h-[110px] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
            <div className="absolute top-0 left-0 h-[3px] w-full bg-green-500" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Completed</p>

                <h2 className="mt-2 text-[36px] leading-none font-semibold text-slate-800">
                  {completedTasks}
                </h2>

                <p className="mt-1 text-xs text-slate-400">Finished tasks</p>
              </div>

              <CheckCircle2
                size={24}
                strokeWidth={2}
                className="text-green-500"
              />
            </div>
          </div>
          <div className="relative overflow-hidden bg-white rounded-[20px] border border-slate-100 px-6 py-3 h-[110px] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
            <div className="absolute top-0 left-0 h-[3px] w-full bg-orange-500" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  In Progress
                </p>

                <h2 className="mt-2 text-[36px] leading-none font-semibold text-slate-800">
                  {reviewCount}
                </h2>

                <p className="mt-1 text-xs text-slate-400">Ongoing work</p>
              </div>

              <Clock3 size={24} strokeWidth={2} className="text-orange-500" />
            </div>
          </div>
          <div className="relative overflow-hidden bg-white rounded-[28px] border border-slate-100 px-6 py-3 h-[110px] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
            <div className="absolute top-0 left-0 h-[3px] w-full bg-red-500" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Urgent</p>

                <h2 className="mt-2 text-[36px] leading-none font-semibold text-slate-800">
                  {urgentCount}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  High priority tasks
                </p>
              </div>

              <AlertTriangle
                size={24}
                strokeWidth={2}
                className="text-red-500"
              />
            </div>
          </div>
        </div>

        {/* PROJECTS */}
        {Object.keys(groupedTasks).length > 0 ? (
          Object.entries(groupedTasks).map(([project, list]) => (
            <div key={project} className="mb-2">
              {/* Project title removed */}

              <div className="space-y-3">
                {list.map((t) => {
                  console.log("STATUS =", t.status);
                  console.log(JSON.stringify(t, null, 2));
                  const status = t.status || "Assigned";

                  const safe = Math.min(
                    Math.max(Number(t.percentage) || 0, 0),
                    100,
                  );

                  return (
                    <div
                      key={t.id}
                      className={`rounded-[24px] border border-slate-100 px-5 py-3 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]
                      ${
                        t.task_name === "UI Design"
                          ? "bg-gradient-to-r from-emerald-50 via-white to-white"
                          : "bg-gradient-to-r from-violet-50 via-white to-white"
                      }`}
                    >
                      <div
                        className={`absolute left-0 top-0 h-full w-[3px] ${
                          safe === 100
                            ? "bg-green-500"
                            : safe > 0
                              ? "bg-blue-500"
                              : "bg-red-500"
                        }`}
                      />
                      {/* TOP */}
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`mt-1 shrink-0 w-14 h-14 rounded-2xl border shadow-sm flex items-center justify-center
${
  status === "Done"
    ? "bg-green-50 border-green-200"
    : status === "In Review"
      ? "bg-blue-50 border-blue-200"
      : status === "Assigned"
        ? "bg-violet-50 border-violet-200"
        : status === "Urgent"
          ? "bg-red-50 border-red-200"
          : "bg-orange-50 border-orange-200"
}`}
                          >
                            {status === "Done" ? (
                              <CheckCircle2
                                size={30}
                                className="text-green-600"
                              />
                            ) : status === "In Review" ? (
                              <ClipboardList
                                size={30}
                                className="text-blue-600"
                              />
                            ) : status === "Assigned" ? (
                              <CalendarDays
                                size={30}
                                className="text-violet-600"
                              />
                            ) : status === "Urgent" ? (
                              <AlertTriangle
                                size={30}
                                className="text-red-600"
                              />
                            ) : (
                              <Clock3 size={30} className="text-orange-600" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-[18px] font-bold text-slate-800">
                                {t.task_name}
                              </h3>

                              <span className="text-xs text-slate-500">
                                Medium Priority
                              </span>
                            </div>

                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                              <span>{project}</span>
                              <span>•</span>
                              <span>Due: 10 Jun 2026</span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`rounded-full border px-4 py-2 text-xs font-semibold shadow-sm ${
                            status === "Urgent"
                              ? "border-red-200 bg-red-50 text-red-600"
                              : status === "In Review"
                                ? "border-blue-200 bg-blue-50 text-blue-600"
                                : status === "Assigned"
                                  ? "border-violet-200 bg-violet-50 text-violet-600"
                                  : status === "Done"
                                    ? "border-green-200 bg-green-50 text-green-600"
                                    : status === "Pending"
                                      ? "border-orange-200 bg-orange-50 text-orange-600"
                                      : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      {/* BODY */}
                      <div className="flex justify-end -mt-6">
                        {/* RIGHT PROGRESS */}
                        <div className="w-[240px] shrink-0 self-center">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-[11px] font-medium text-slate-500">
                              Progress
                            </span>

                            <span className="text-[11px] font-medium text-slate-500">
                              {safe}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-200 shadow-inner">
                            <div
                              className={`h-full rounded-full ${
                                safe === 100
                                  ? "bg-gradient-to-r from-green-500 to-green-600"
                                  : safe > 0
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                    : "bg-gradient-to-r from-slate-400 to-slate-500"
                              }`}
                              style={{
                                width: `${safe}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[30px] bg-white p-10 text-center text-slate-500">
            No Tasks Assigned
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTasks;
