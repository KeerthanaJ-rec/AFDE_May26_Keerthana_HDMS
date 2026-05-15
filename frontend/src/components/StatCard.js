export default function StatCard({ label, value, gradient, shadow }) {
  return (
    <div className="stat-card" style={{ ...styles.card, background: gradient, boxShadow: shadow }}>
      {/* Decorative background circles */}
      <div style={styles.deco1} />
      <div style={styles.deco2} />

      <div style={styles.content}>
        <div style={styles.value}>{value}</div>
        <div style={styles.label}>{label}</div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    borderRadius: "18px",
    padding: "1.6rem 1.4rem",
    flex: "1",
    minWidth: "130px",
    position: "relative",
    overflow: "hidden",
    cursor: "default",
  },
  deco1: {
    position: "absolute",
    top: "-24px",
    right: "-24px",
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.18)",
  },
  deco2: {
    position: "absolute",
    bottom: "-36px",
    left: "-18px",
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.10)",
  },
  content: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
  },
  value: {
    color: "#fff",
    fontSize: "2.8rem",
    fontWeight: "800",
    lineHeight: 1,
    letterSpacing: "-2px",
    marginBottom: "0.45rem",
    textShadow: "0 2px 10px rgba(0,0,0,0.15)",
  },
  label: {
    color: "rgba(255,255,255,0.88)",
    fontWeight: "700",
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
};
