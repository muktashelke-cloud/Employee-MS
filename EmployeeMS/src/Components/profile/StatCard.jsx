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
  accent,
  icon,
  subtitle,
  Icon,
  icons,
}) {
  return (
    <div
      className="stat-card"
      style={{
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
        e.currentTarget.style.boxShadow =
          "0 20px 40px rgba(15,23,42,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 12px 28px rgba(15,23,42,0.08)";
      }}
    >
      {/* Bottom Accent */}
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

      {/* Background Gradient */}
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

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
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
          position: "relative",
          zIndex: 1,
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
          position: "relative",
          zIndex: 1,
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