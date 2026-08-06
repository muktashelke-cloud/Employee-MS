import Card from "../../ui/Card";

const accentMap = {
  purple: "bg-violet-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-400",
  blue: "bg-blue-500",
};

const gradientMap = {
  purple: "from-violet-100 to-transparent",
  emerald: "from-emerald-100 to-transparent",
  amber: "from-amber-100 to-transparent",
  blue: "from-blue-100 to-transparent",
};

export default function StatCard({
  value,
  label,
  subtitle,
  color = "blue",
  icon: Icon,
}) {
  return (
    <Card className="relative overflow-hidden p-5">

      {/* Top Gradient */}

      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientMap[color]} opacity-70`}
      />

      {/* Bottom Accent */}

      <div
        className={`absolute bottom-0 left-0 h-1 w-full ${accentMap[color]}`}
      />

      <div className="relative z-10">

        {/* Top */}

        <div className="mb-5 flex items-center justify-between">

          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </span>

          {Icon && (
            <Icon
              size={18}
              className="text-slate-400"
            />
          )}

        </div>

        {/* Value */}

        <h2 className="text-3xl font-extrabold text-slate-900">
          {value}
        </h2>

        {/* Subtitle */}

        <p className="mt-2 text-sm font-medium text-slate-500">
          {subtitle}
        </p>

      </div>

    </Card>
  );
}