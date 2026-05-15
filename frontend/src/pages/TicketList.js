import { useState, useEffect } from "react";
import { getAllTickets, deleteTicket } from "../services/ticketService";
import TicketTable from "../components/TicketTable";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = () => {
    setLoading(true);
    getAllTickets()
      .then((res) => setTickets(res.data))
      .catch(() => alert("Failed to load tickets"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete ticket #${id}?`)) return;
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.ticket_id !== id));
    } catch {
      alert("Failed to delete ticket");
    }
  };

  return (
    <div style={styles.page}>
      {/* Hero Banner */}
      <div style={styles.hero}>
        <div style={styles.deco1} />
        <div style={styles.deco2} />
        <div style={styles.heroContent}>
          <div style={styles.heroPill}>Ticket Management</div>
          <h1 style={styles.heroTitle}>All Tickets</h1>
          <p style={styles.heroSub}>
            {loading ? "Loading..." : `${tickets.length} ticket${tickets.length !== 1 ? "s" : ""} in the system`}
          </p>
        </div>
        <button className="act-btn" style={styles.refreshBtn} onClick={fetchTickets}>
          &#x21bb; Refresh
        </button>
      </div>

      {/* Table Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardHeaderLeft}>
            <div style={styles.cardHeaderDot} />
            <span style={styles.cardTitle}>Ticket List</span>
          </div>
          {!loading && (
            <span style={styles.countBadge}>
              {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"}
            </span>
          )}
        </div>
        {loading ? (
          <div className="spinner" />
        ) : (
          <TicketTable tickets={tickets} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "2rem", maxWidth: "1200px", margin: "0 auto" },

  /* Hero */
  hero: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #3b82f6 100%)",
    borderRadius: "18px",
    padding: "1.1rem 2rem",
    marginBottom: "2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1.25rem",
    boxShadow: "0 10px 30px rgba(30,64,175,0.4)",
    position: "relative",
    overflow: "hidden",
  },
  deco1: {
    position: "absolute",
    top: "-30px",
    right: "-30px",
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.10)",
    pointerEvents: "none",
  },
  deco2: {
    position: "absolute",
    bottom: "-50px",
    left: "38%",
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    pointerEvents: "none",
  },
  heroContent: { position: "relative", zIndex: 1 },
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
    margin: "0 0 0.3rem",
    fontWeight: "800",
    fontSize: "1.55rem",
    letterSpacing: "-0.5px",
  },
  heroSub: { color: "#bfdbfe", margin: 0, fontSize: "0.88rem" },
  refreshBtn: {
    position: "relative",
    zIndex: 1,
    padding: "0.55rem 1.3rem",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    border: "1.5px solid rgba(255,255,255,0.35)",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "0.88rem",
    flexShrink: 0,
  },

  /* Card */
  card: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem",
    background: "#fafbff",
    borderBottom: "2px solid #e5e7eb",
  },
  cardHeaderLeft: { display: "flex", alignItems: "center", gap: "0.6rem" },
  cardHeaderDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    boxShadow: "0 0 0 3px rgba(59,130,246,0.2)",
  },
  cardTitle: { fontWeight: "700", color: "#1e40af", fontSize: "0.95rem" },
  countBadge: {
    background: "#dbeafe",
    color: "#1e40af",
    padding: "3px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "700",
  },
};
