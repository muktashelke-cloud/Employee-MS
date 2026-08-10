export default function SkillsCard({ employee }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "24px",
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
        Skills &amp; Expertise
      </h2>

      <p
        style={{
          fontSize: 12,
          color: "#94a3b8",
          marginTop: 2,
          marginBottom: 16,
        }}
      >
        Technical skills and specialisations
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {employee.skills.map((skill) => (
          <span
            key={skill}
            className="skill-tag"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}