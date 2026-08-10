export default function ReportsCard({
  employee,
  selectedMember,
  setSelectedMember,
  Icon,
  icons,
}) {
  return (
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
            <span>
              Message {selectedMember} feature coming soon.
            </span>

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
  );
}