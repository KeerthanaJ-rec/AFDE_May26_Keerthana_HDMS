import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import { getStats, getAllTickets } from "../services/ticketService";

const STAT_CONFIG = [
  { key: "total",       label: "Total Tickets", gradient: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)", shadow: "0 8px 24px rgba(99,102,241,0.45)" },
  { key: "open",        label: "Open",          gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)", shadow: "0 8px 24px rgba(14,165,233,0.45)" },
  { key: "in_progress", label: "In Progress",   gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", shadow: "0 8px 24px rgba(249,115,22,0.45)" },
  { key: "resolved",    label: "Resolved",      gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", shadow: "0 8px 24px rgba(34,197,94,0.45)"  },
  { key: "closed",      label: "Closed",        gradient: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)", shadow: "0 8px 24px rgba(168,85,247,0.45)" },
];

const priorityBadge = {
  Low:      { bg: "#dcfce7", color: "#16a34a" },
  Medium:   { bg: "#fef9c3", color: "#a16207" },
  High:     { bg: "#fee2e2", color: "#dc2626" },
  Critical: { bg: "#f3e8ff", color: "#7c3aed" },
};
const statusBadge = {
  Open:          { bg: "#dbeafe", color: "#1e40af" },
  "In Progress": { bg: "#fef3c7", color: "#d97706" },
  Resolved:      { bg: "#dcfce7", color: "#16a34a" },
  Closed:        { bg: "#f3f4f6", color: "#6b7280" },
};

export default function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getStats(), getAllTickets()])
      .then(([statsRes, ticketsRes]) => {
        setStats(statsRes.data);
        setRecent(ticketsRes.data.slice(0, 5));
      })
      .catch(() => alert("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      {/* Hero Banner */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.heroPill}>Live Dashboard</div>
          <h1 style={styles.heroTitle}>Welcome to HDMS</h1>
          <p style={styles.heroSub}>
            Monitor and manage all IT support tickets in one place.
          </p>
        </div>
        <div style={styles.heroActions}>
          <button style={styles.btnHeroPrimary} onClick={() => navigate("/create")}>
            + New Ticket
          </button>
          <button style={styles.btnHeroSecondary} onClick={() => navigate("/tickets")}>
            View All Tickets
          </button>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          {/* Stat Cards */}
          <div style={styles.statsRow}>
            {STAT_CONFIG.map(({ key, label, gradient, shadow }) => (
              <StatCard
                key={key}
                label={label}
                value={stats?.[key] ?? 0}
                gradient={gradient}
                shadow={shadow}
              />
            ))}
          </div>

          {/* Recent Tickets */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Recent Tickets</h2>
                <p style={styles.sectionSub}>Last {recent.length} submitted tickets</p>
              </div>
              <button style={styles.btnViewAll} onClick={() => navigate("/tickets")}>
                View all &rarr;
              </button>
            </div>

            {recent.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyCircle}>
                  <span style={{ fontSize: "1.4rem", color: "#93c5fd" }}>&#x2261;</span>
                </div>
                <p style={styles.emptyTitle}>No tickets yet</p>
                <p style={styles.emptyHint}>Create your first ticket to get started.</p>
                <button style={styles.btnPrimary} onClick={() => navigate("/create")}>
                  + Create Ticket
                </button>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>#</th>
                      <th style={styles.th}>Employee</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Priority</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((t, i) => {
                      const pBadge = priorityBadge[t.priority] || { bg: "#f3f4f6", color: "#6b7280" };
                      const sBadge = statusBadge[t.status]     || { bg: "#f3f4f6", color: "#6b7280" };
                      return (
                        <tr
                          key={t.ticket_id}
                          className="tbl-row"
                          style={{ ...styles.row, background: i % 2 === 0 ? "#fff" : "#f8faff" }}
                        >
                          <td style={{ ...styles.td, fontWeight: "700", color: "#1e40af" }}>
                            #{t.ticket_id}
                          </td>
                          <td style={{ ...styles.td, fontWeight: "500" }}>{t.employee_name}</td>
                          <td style={styles.td}>{t.issue_category}</td>
                          <td style={styles.td}>
                            <span style={{ ...styles.badge, background: pBadge.bg, color: pBadge.color }}>
                              {t.priority}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={{ ...styles.badge, background: sBadge.bg, color: sBadge.color }}>
                              {t.status}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <button
                              className="act-btn"
                              style={styles.btnView}
                              onClick={() => navigate(`/tickets/${t.ticket_id}`)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "2rem", maxWidth: "1100px", margin: "0 auto" },

  /* Hero */
  hero: {
    background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 55%, #3b82f6 100%)",
    borderRadius: "18px",
    padding: "1.1rem 2rem",
    marginBottom: "2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1.25rem",
    boxShadow: "0 10px 30px rgba(30,64,175,0.35)",
  },
  heroLeft: { flex: 1 },
  heroPill: {
    display: "inline-block",
    background: "rgba(255,255,255,0.15)",
    color: "#bfdbfe",
    fontSize: "0.72rem",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    padding: "3px 10px",
    borderRadius: "20px",
    marginBottom: "0.25rem",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  heroTitle: {
    color: "#fff",
    margin: "0 0 0.2rem",
    fontWeight: "800",
    fontSize: "1.55rem",
    letterSpacing: "-0.5px",
  },
  heroSub: { color: "#bfdbfe", margin: 0, fontSize: "0.9rem", maxWidth: "420px" },
  heroActions: { display: "flex", gap: "0.8rem", flexShrink: 0, flexWrap: "wrap" },
  btnHeroPrimary: {
    padding: "0.6rem 1.4rem",
    background: "linear-gradient(135deg,#f59e0b,#d97706)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "0.9rem",
    boxShadow: "0 3px 10px rgba(245,158,11,0.5)",
  },
  btnHeroSecondary: {
    padding: "0.6rem 1.4rem",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    border: "1.5px solid rgba(255,255,255,0.35)",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.9rem",
  },

  /* Stats */
  statsRow: { display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" },

  /* Section */
  section: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #f1f5f9",
    background: "#fafbff",
  },
  sectionTitle: { margin: "0 0 0.15rem", fontWeight: "700", color: "#1e40af", fontSize: "1.05rem" },
  sectionSub: { margin: 0, color: "#9ca3af", fontSize: "0.8rem" },
  btnViewAll: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "0.88rem",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
  },

  /* Table */
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" },
  thead: { background: "#f8faff", borderBottom: "2px solid #e5e7eb" },
  th: {
    padding: "0.75rem 1.25rem",
    textAlign: "left",
    fontWeight: "700",
    color: "#374151",
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  row: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "0.85rem 1.25rem", color: "#374151", verticalAlign: "middle" },
  badge: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "0.77rem",
    fontWeight: "700",
    display: "inline-block",
  },
  btnView: {
    padding: "4px 12px",
    background: "#eff6ff",
    color: "#1e40af",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
  btnPrimary: {
    padding: "0.6rem 1.4rem",
    background: "#1e40af",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  /* Empty state */
  emptyState: { padding: "3.5rem 2rem", textAlign: "center" },
  emptyCircle: {
    width: "64px",
    height: "64px",
    background: "#eff6ff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
    border: "2px dashed #bfdbfe",
  },
  emptyTitle: { color: "#374151", fontWeight: "600", margin: "0 0 0.3rem", fontSize: "1rem" },
  emptyHint: { color: "#9ca3af", margin: "0 0 1.25rem", fontSize: "0.88rem" },
};
