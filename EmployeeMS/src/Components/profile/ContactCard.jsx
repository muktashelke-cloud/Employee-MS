export default function ContactCard({
  employee,
  user,
  InfoField,
  Icon,
  icons,
}) {
  return (
    <>
      {/* Contact */}
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "24px",
          height: "fit-content",
          border: "1px solid #eef2f7",
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
          marginTop: -2,
        }}
      >
        <div
          style={{
            width: 55,
            height: 4,
            borderRadius: 99,
            background: "linear-gradient(90deg,#2563eb,#60a5fa)",
            marginBottom: 14,
          }}
        />
        <h2
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: 18,
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Contact &amp; Details
        </h2>
        <p
          style={{
            fontSize: 12,
            color: "#94a3b8",
            marginTop: 2,
            marginBottom: 4,
          }}
        >
          Personal and employment information
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "22px 18px",
            marginTop: 18,
          }}
        >
          {[
            { label: "Email", value: employee.email, icon: "mail" },
            { label: "Phone", value: employee.phone, icon: "phone" },
            {
              label: "Location",
              value: employee.location,
              icon: "location",
            },
            { label: "Joined", value: employee.joined, icon: "calendar" },
            {
              label: "Manager",
              value: employee.manager,
              icon: "profile",
            },
            { label: "Type", value: employee.type, icon: "briefcase" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 18,
              }}
            >
              <>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon d={icons[item.icon]} size={22} stroke={1.7} />
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#94a3b8",
                      marginBottom: 4,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {item.label}
                  </div>

                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#0f172a",
                      letterSpacing: "-0.1px",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
