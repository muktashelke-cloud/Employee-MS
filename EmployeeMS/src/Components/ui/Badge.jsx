import { Briefcase, MapPin, Award } from "lucide-react";

const iconMap = {
  briefcase: Briefcase,
  location: MapPin,
  award: Award,
};

const variantClasses = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  purple: "bg-violet-50 text-violet-700 border-violet-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  gray: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function Badge({
  icon,
  children,
  variant = "blue",
}) {
  const Icon = iconMap[icon];

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        px-4
        py-2
        text-sm
        font-medium
        ${variantClasses[variant]}
      `}
    >
      {Icon && <Icon size={16} />}
      {children}
    </span>
  );
}