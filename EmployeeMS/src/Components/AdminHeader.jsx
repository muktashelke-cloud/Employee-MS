const AdminHeader = ({ title, breadcrumb }) => {
  return (
    <div
      style={{
        background: "#fff",
        padding: "18px 28px",
        borderRadius: "14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}
    >
      {/* LEFT */}
      <div>
        <p
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            marginBottom: "4px",
          }}
        >
          {breadcrumb}
        </p>

        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#0f172a",
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontWeight: "600",
            color: "#111827",
          }}
        >
          Mukta Shelke
        </span>

        <img
          src="/profile.png"
          alt="profile"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
};

export default AdminHeader;