export default function HeroBanner({
  employee,
  user,
  navigate,
  showMessage,
  setShowMessage,
  Icon,
  icons,
}) {
  return (
    <>
      {/* Hero Banner */}
      <div>
        <div
          style={{
            background:
              "linear-gradient(120deg,#1d4ed8 0%,#1e40af 55%,#1e3a8a 100%)",
            borderRadius: 20,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            gap: 30,
            marginBottom: 14,
            position: "relative",
            overflow: "hidden",
            width: "100%",
            boxShadow: "0 10px 24px rgba(37,99,235,0.16)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -70,
              right: -70,
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: "rgba(255,255,255,.04)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -50,
              right: 130,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,.04)",
            }}
          />

          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: 86,
                height: 86,
                borderRadius: "50%",
                overflow: "hidden",
                border: "4px solid rgba(255,255,255,.25)",
                boxShadow: "0 0 0 5px rgba(255,255,255,.08)",
                background: "#dbeafe",
              }}
            >
              <img
                src="https://i.pravatar.cc/300?img=5"
                alt="profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                bottom: 4,
                right: 4,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#22c55e",
                border: "3px solid #1d4ed8",
              }}
            />
          </div>
          {/* Name block */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 6,
              }}
            >
              <h1
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.5px",
                }}
              >
                {employee.name}
              </h1>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(255,255,255,.12)",
                  color: "#bfdbfe",
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 99,
                  fontWeight: 500,
                }}
              >
                <Icon d={icons.award} size={13} /> Top Performer
              </span>
            </div>
            <p
              style={{
                color: "#bfdbfe",
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 16,
              }}
            >
              {employee.title}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { icon: "briefcase", label: employee.department },
                { icon: "location", label: employee.location },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(255,255,255,.12)",
                    color: "#e0f2fe",
                    fontSize: 13,
                    padding: "6px 14px",
                    borderRadius: 99,
                    fontWeight: 500,
                  }}
                >
                  <Icon d={icons[icon]} size={14} />
                  {label}
                </span>
              ))}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#22c55e22",
                  color: "#86efac",
                  fontSize: 13,
                  padding: "6px 14px",
                  borderRadius: 99,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block",
                  }}
                />
                {employee.status}
              </span>
            </div>
          </div>
          {/* ID + actions */}
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div
              style={{
                fontSize: 11,
                color: "#93c5fd",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Employee ID
            </div>
            <div
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: 26,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "1px",
              }}
            >
              {employee.employeeId}
            </div>
            <div
              style={{
                marginTop: 18,
                display: "flex",
                alignItems: "center",
                gap: 18,
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => navigate(`/employee/edit-employee/${user.id}`)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  opacity: 0.95,
                }}
              >
                <Icon d={icons.edit} size={20} stroke={1.8} />
              </button>

              <div
                style={{
                  width: "1px",
                  height: "24px",
                  background: "rgba(255,255,255,0.22)",
                }}
              />

              <button
                onClick={() => setShowMessage(!showMessage)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  opacity: 0.95,
                }}
              >
                <Icon d={icons.message} size={20} stroke={1.8} />
              </button>
            </div>
          </div>
        </div>

        {showMessage && (
          <div
            style={{
              position: "absolute",
              top: 110,
              right: 30,
              width: 300,
              background: "#ffffff",
              borderRadius: 18,
              padding: 16,
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              zIndex: 100,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Messages
              </h3>

              <button
                onClick={() => setShowMessage(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#64748b",
                  padding: 0,
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                padding: 12,
                background: "#f8fafc",
                borderRadius: 12,
                marginBottom: 10,
              }}
            >
              <b>HR Team</b>

              <p style={{ fontSize: 14 }}>Your payslip is available.</p>
            </div>

            <div
              style={{
                padding: 12,
                background: "#f8fafc",
                borderRadius: 12,
              }}
            >
              <b>Manager</b>

              <p style={{ fontSize: 14 }}>Please submit today's timesheet.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
