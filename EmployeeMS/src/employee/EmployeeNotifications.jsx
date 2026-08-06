import {
  Bell,
  Wallet,
  BadgeCheck,
  ClipboardCheck,
  CheckCheck,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "salary",
    title: "Salary Credited",
    message: "May 2026 payslip is ready",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    type: "leave",
    title: "Leave Approved",
    message: "Your leave request for 2 Jun has been approved",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 3,
    type: "task",
    title: "New Task Assigned",
    message: "Sprint Planning Prep assigned to you",
    time: "Yesterday",
    unread: false,
  },
];

export default function EmployeeNotifications() {
  const getIcon = (type) => {
    switch (type) {
      case "salary":
        return (
          <div className="p-3 rounded-xl bg-green-50">
            <Wallet size={20} className="text-green-600" />
          </div>
        );

      case "leave":
        return (
          <div className="p-3 rounded-xl bg-blue-50">
            <BadgeCheck size={20} className="text-blue-600" />
          </div>
        );

      default:
        return (
          <div className="p-3 rounded-xl bg-violet-50">
            <ClipboardCheck size={20} className="text-violet-600" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-800">
              <Bell className="text-violet-600" size={28} />
              Notifications
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Stay updated with recent activities and alerts
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            <CheckCheck size={16} />
            Mark all as read
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Notifications</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {notifications.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Unread</p>
            <h2 className="mt-2 text-3xl font-bold text-red-500">
              {notifications.filter((n) => n.unread).length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Read</p>
            <h2 className="mt-2 text-3xl font-bold text-green-500">
              {notifications.filter((n) => !n.unread).length}
            </h2>
          </div>
        </div>

        {/* Notification List */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {notifications.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-start gap-4 p-5 transition hover:bg-slate-50 ${
                index !== notifications.length - 1
                  ? "border-b border-slate-100"
                  : ""
              }`}
            >
              {getIcon(item.type)}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800">
                    {item.title}
                  </h3>

                  {item.unread && (
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-600">
                  {item.message}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}