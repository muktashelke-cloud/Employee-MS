import { NavLink } from "react-router-dom";

export default function SidebarItem({
  to,
  icon: Icon,
  text,
  collapsed,
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        relative
        flex
        items-center
        gap-[10px]
        rounded-[12px]
        border
        px-3
        py-[11px]
        text-[13.5px]
        font-medium
        no-underline
        transition-all
        duration-200
        select-none
        outline-none
        ${
          isActive
            ? "border-blue-500/15 bg-gradient-to-r from-blue-500/20 to-blue-500/5 text-white"
            : "border-transparent text-slate-200 hover:bg-white/10 hover:text-white"
        }
      `
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              className="
                absolute
                left-[2px]
                top-1/2
                h-[22px]
                w-[3px]
                -translate-y-1/2
                rounded-full
                bg-blue-500
              "
            />
          )}

          <Icon
            className="
              h-[19px]
              w-[19px]
              shrink-0
              opacity-90
            "
          />

          {!collapsed && <span>{text}</span>}
        </>
      )}
    </NavLink>
  );
}