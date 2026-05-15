import { useNavigate } from "react-router-dom";

const priorityBadge = {
  Low:      { bg: "#dcfce7", color: "#16a34a" },
  Medium:   { bg: "#fef9c3", color: "#a16207" },
  High:     { bg: "#fee2e2", color: "#dc2626" },
  Critical: { bg: "#f3e8ff", color: "#7c3aed" },
};

const statusBadge = {
  Open:         { bg: "#dbeafe", color: "#1e40af" },
  "In Progress":{ bg: "#fef3c7", color: "#d97706" },
  Resolved:     { bg: "#dcfce7", color: "#16a34a" },
  Closed:       { bg: "#f3f4f6", color: "#6b7280" },
};

export default function TicketTable({ tickets, onDelete }) {
  const navigate = useNavigate();

  if (!tickets.length) {
    return (
      <div style={styles.emptyWrap}>
        <div style={styles.emptyCircle}>
          <span style={{ fontSize: "1.4rem", color: "#93c5fd" }}>&#x2261;</span>
        </div>
        <p style={styles.emptyTitle}>No tickets found</p>
        <p style={styles.emptyHint}>Try adjusting your filters or create a new ticket.</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Employee</th>
            <th style={styles.th}>Department</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Priority</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Created</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t, i) => {
            const pBadge = priorityBadge[t.priority] || { bg: "#f3f4f6", color: "#6b7280" };
            const sBadge = statusBadge[t.status]    || { bg: "#f3f4f6", color: "#6b7280" };
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
                <td style={styles.td}>{t.department}</td>
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
                <td style={{ ...styles.td, color: "#9ca3af", fontSize: "0.82rem" }}>
                  {t.created_at ? new Date(t.created_at).toLocaleDateString() : "—"}
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      className="act-btn"
                      style={styles.btnView}
                      onClick={() => navigate(`/tickets/${t.ticket_id}`)}
                    >
                      View
                    </button>
                    <button
                      className="act-btn"
                      style={styles.btnEdit}
                      onClick={() => navigate(`/tickets/${t.ticket_id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="act-btn"
                      style={styles.btnDel}
                      onClick={() => onDelete(t.ticket_id)}
                    >
                      Del
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  wrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" },
  headerRow: { background: "#f8faff", borderBottom: "2px solid #e5e7eb" },
  th: {
    padding: "0.8rem 1.2rem",
    textAlign: "left",
    fontWeight: "700",
    color: "#374151",
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },
  row: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "0.85rem 1.2rem", color: "#374151", verticalAlign: "middle" },
  badge: {
    padding: "3px 11px",
    borderRadius: "20px",
    fontSize: "0.77rem",
    fontWeight: "700",
    display: "inline-block",
    whiteSpace: "nowrap",
  },
  actions: { display: "flex", gap: "5px" },
  btnView: {
    padding: "4px 11px",
    background: "#eff6ff",
    color: "#1e40af",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.78rem",
    fontWeight: "600",
  },
  btnEdit: {
    padding: "4px 11px",
    background: "#fef3c7",
    color: "#d97706",
    border: "1px solid #fde68a",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.78rem",
    fontWeight: "600",
  },
  btnDel: {
    padding: "4px 11px",
    background: "#fee2e2",
    color: "#dc2626",
    border: "1px solid #fca5a5",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.78rem",
    fontWeight: "600",
  },
  emptyWrap: { padding: "3.5rem 2rem", textAlign: "center" },
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
  emptyTitle: { color: "#374151", fontWeight: "600", margin: "0 0 0.35rem", fontSize: "1rem" },
  emptyHint: { color: "#9ca3af", margin: 0, fontSize: "0.88rem" },
};
