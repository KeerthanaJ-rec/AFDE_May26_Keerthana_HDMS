import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketById, deleteTicket } from "../services/ticketService";

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

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTicketById(id)
      .then((res) => setTicket(res.data))
      .catch(() => alert("Ticket not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this ticket permanently?")) return;
    try {
      await deleteTicket(id);
      navigate("/tickets");
    } catch {
      alert("Failed to delete ticket");
    }
  };

  if (loading) return <div className="spinner" />;
  if (!ticket)  return <p style={styles.noData}>Ticket not found.</p>;

  const pBadge = priorityBadge[ticket.priority] || { bg: "#f3f4f6", color: "#6b7280" };
  const sBadge = statusBadge[ticket.status]     || { bg: "#f3f4f6", color: "#6b7280" };

  return (
    <div style={styles.page}>
      {/* Hero Header */}
      <div style={styles.hero}>
        <div style={styles.deco1} />
        <div style={styles.deco2} />
        <div style={styles.heroLeft}>
          <div style={styles.heroPill}>Support Ticket</div>
          <div style={styles.heroTicketNum}>Ticket #{ticket.ticket_id}</div>
          <p style={styles.heroDate}>
            Submitted on {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : "—"}
          </p>
        </div>
        <div style={styles.heroBadges}>
          <span style={{ ...styles.heroBadge, background: pBadge.bg, color: pBadge.color }}>
            {ticket.priority}
          </span>
          <span style={{ ...styles.heroBadge, background: sBadge.bg, color: sBadge.color }}>
            {ticket.status}
          </span>
        </div>
      </div>

      {/* Detail Card */}
      <div style={styles.card}>
        {/* Section: Fields */}
        <div style={styles.sectionHeader}>
          <span style={styles.sectionDot} />
          <span style={styles.sectionTitle}>Ticket Information</span>
        </div>
        <div style={styles.grid}>
          <InfoField label="Employee Name"  value={ticket.employee_name}  accent="#3b82f6" />
          <InfoField label="Department"     value={ticket.department}     accent="#3b82f6" />
          <InfoField label="Issue Category" value={ticket.issue_category} accent="#f97316" />
          <InfoField label="Priority"
            value={<span style={{ ...styles.inlineBadge, background: pBadge.bg, color: pBadge.color }}>{ticket.priority}</span>}
            accent={pBadge.color}
          />
          <InfoField label="Status"
            value={<span style={{ ...styles.inlineBadge, background: sBadge.bg, color: sBadge.color }}>{ticket.status}</span>}
            accent={sBadge.color}
          />
        </div>

        <hr style={styles.divider} />

        {/* Description */}
        <div style={styles.blockSection}>
          <div style={styles.blockLabelRow}>
            <span style={{ ...styles.blockDot, background: "#3b82f6" }} />
            <p style={styles.blockLabel}>Description</p>
          </div>
          <div style={styles.descBox}>
            <p style={styles.blockText}>{ticket.description}</p>
          </div>
        </div>

        {/* Resolution Notes */}
        {ticket.resolution_notes && (
          <div style={styles.blockSection}>
            <div style={styles.blockLabelRow}>
              <span style={{ ...styles.blockDot, background: "#16a34a" }} />
              <p style={{ ...styles.blockLabel, color: "#16a34a" }}>Resolution Notes</p>
            </div>
            <div style={styles.resolveBox}>
              <p style={styles.blockText}>{ticket.resolution_notes}</p>
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div style={styles.footer}>
          <button style={styles.btnBack} onClick={() => navigate(-1)}>
            &larr; Back
          </button>
          <div style={styles.footerRight}>
            <button className="act-btn" style={styles.btnEdit} onClick={() => navigate(`/tickets/${id}/edit`)}>
              Edit Ticket
            </button>
            <button className="act-btn" style={styles.btnDel} onClick={handleDelete}>
              Delete Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value, accent }) {
  return (
    <div style={{ ...fieldStyles.wrap, borderLeftColor: accent || "#3b82f6" }}>
      <p style={fieldStyles.label}>{label}</p>
      <div style={fieldStyles.value}>{value}</div>
    </div>
  );
}

const fieldStyles = {
  wrap: {
    background: "linear-gradient(135deg, #f8faff 0%, #eff6ff 100%)",
    borderRadius: "10px",
    padding: "0.9rem 1rem",
    border: "1px solid #dbeafe",
    borderLeft: "3px solid #3b82f6",
  },
  label: {
    margin: "0 0 0.3rem",
    color: "#9ca3af",
    fontSize: "0.72rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
  },
  value: { margin: 0, color: "#111827", fontWeight: "600", fontSize: "0.95rem" },
};

const styles = {
  page: { padding: "2rem", maxWidth: "820px", margin: "0 auto" },
  noData: { textAlign: "center", color: "#6b7280", marginTop: "4rem" },

  /* Hero */
  hero: {
    background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #3b82f6 100%)",
    borderRadius: "16px 16px 0 0",
    padding: "1rem 1.75rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
    boxShadow: "0 4px 16px rgba(30,64,175,0.25)",
    position: "relative",
    overflow: "hidden",
  },
  deco1: {
    position: "absolute",
    top: "-20px",
    right: "-20px",
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.12)",
    pointerEvents: "none",
  },
  deco2: {
    position: "absolute",
    bottom: "-40px",
    left: "30%",
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.07)",
    pointerEvents: "none",
  },
  heroLeft: { position: "relative", zIndex: 1 },
  heroPill: {
    display: "inline-block",
    background: "rgba(255,255,255,0.15)",
    color: "#bfdbfe",
    fontSize: "0.68rem",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    padding: "2px 9px",
    borderRadius: "20px",
    marginBottom: "0.4rem",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  heroTicketNum: {
    color: "#fff",
    fontWeight: "800",
    fontSize: "1.7rem",
    letterSpacing: "-0.5px",
    marginBottom: "0.2rem",
  },
  heroDate: { color: "#93c5fd", margin: 0, fontSize: "0.85rem" },
  heroBadges: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    gap: "0.6rem",
    flexWrap: "wrap",
  },
  heroBadge: {
    padding: "5px 16px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "700",
    display: "inline-block",
  },

  /* Card */
  card: {
    background: "#fff",
    borderRadius: "0 0 16px 16px",
    padding: "0",
    boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "1.1rem 2rem",
    background: "#fafbff",
    borderBottom: "1px solid #e5e7eb",
  },
  sectionDot: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    boxShadow: "0 0 0 3px rgba(59,130,246,0.2)",
  },
  sectionTitle: { fontWeight: "700", color: "#1e40af", fontSize: "0.9rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "0.85rem",
    padding: "1.5rem 2rem",
  },

  divider: { border: "none", borderTop: "1px solid #f1f5f9", margin: "0 2rem" },

  /* Blocks */
  blockSection: { padding: "1.25rem 2rem" },
  blockLabelRow: { display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" },
  blockDot: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  blockLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "0.78rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },
  descBox: {
    background: "linear-gradient(135deg, #f8faff 0%, #eff6ff 100%)",
    borderRadius: "10px",
    padding: "1rem 1.2rem",
    border: "1px solid #dbeafe",
    borderLeft: "3px solid #3b82f6",
  },
  resolveBox: {
    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    borderRadius: "10px",
    padding: "1rem 1.2rem",
    border: "1px solid #bbf7d0",
    borderLeft: "4px solid #16a34a",
  },
  blockText: { margin: 0, color: "#111827", lineHeight: "1.65", fontSize: "0.95rem" },

  inlineBadge: {
    padding: "3px 12px",
    borderRadius: "20px",
    fontSize: "0.82rem",
    fontWeight: "700",
    display: "inline-block",
  },

  /* Footer */
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.25rem 2rem",
    borderTop: "1px solid #f1f5f9",
    background: "#fafbff",
  },
  footerRight: { display: "flex", gap: "0.75rem" },
  btnBack: {
    padding: "0.55rem 1.2rem",
    background: "#f3f4f6",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.88rem",
  },
  btnEdit: {
    padding: "0.55rem 1.4rem",
    background: "linear-gradient(135deg,#f59e0b,#d97706)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "0.88rem",
    boxShadow: "0 2px 8px rgba(245,158,11,0.35)",
  },
  btnDel: {
    padding: "0.55rem 1.4rem",
    background: "linear-gradient(135deg,#ef4444,#dc2626)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "0.88rem",
    boxShadow: "0 2px 8px rgba(220,38,38,0.35)",
  },
};
