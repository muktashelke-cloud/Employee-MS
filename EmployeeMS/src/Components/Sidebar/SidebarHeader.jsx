import { Menu } from "lucide-react";

export default function SidebarHeader({
  collapsed,
  setCollapsed,
  role,
}) {
  return (
    <div className="flex min-h-[42px] items-center px-1 pb-[18px]">

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          mr-[10px]
          flex
          h-[34px]
          w-[34px]
          shrink-0
          items-center
          justify-center
          rounded-[10px]
          bg-transparent
          p-0
          text-slate-300
          transition-all
          duration-200
          hover:bg-white/10
          hover:text-white
        "
      >
        <Menu size={18} />
      </button>

      {!collapsed && (
        <h3
          className="
            m-0
            flex
            h-[34px]
            items-center
            text-[17px]
            font-extrabold
            tracking-[-0.3px]
            text-slate-50
          "
        >
          {role === "superadmin"
            ? "EMS"
            : role === "admin"
            ? "Admin Panel"
            : role === "hr"
            ? "HR Panel"
            : "Employee Panel"}
        </h3>
      )}
    </div>
  );
}