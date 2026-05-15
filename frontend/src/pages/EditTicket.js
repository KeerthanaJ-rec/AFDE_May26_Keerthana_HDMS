import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketById, updateTicket } from "../services/ticketService";

const CATEGORIES = [
  "VPN Issue", "Password Reset", "Software Installation",
  "Laptop Issue", "Email Access", "Network Connectivity", "Hardware Request", "Other",
];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const STATUSES   = ["Open", "In Progress", "Resolved", "Closed"];

const STATUS_COLORS = {
  Open:          "#2563eb",
  "In Progress": "#d97706",
  Resolved:      "#16a34a",
  Closed:        "#6b7280",
};

export default function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm]         = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getTicketById(id)
      .then((res) => setForm(res.data))
      .catch(() => alert("Failed to load ticket"));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_name?.trim() || !form.department?.trim() || !form.description?.trim()) {
      alert("Employee name, department, and description are required.");
      return;
    }
    setSubmitting(true);
    try {
      await updateTicket(id, {
        employee_name:    form.employee_name,
        department:       form.department,
        issue_category:   form.issue_category,
        description:      form.description,
        priority:         form.priority,
        status:           form.status,
        resolution_notes: form.resolution_notes || null,
      });
      navigate(`/tickets/${id}`);
    } catch {
      alert("Failed to update ticket");
    } finally {
      setSubmitting(false);
    }
  };

  if (!form) return <div className="spinner" />;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Card Header */}
        <div style={styles.cardHeader}>
          <div style={styles.deco1} />
          <div style={styles.deco2} />
          <div style={styles.headerIcon}>&#x270E;</div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={styles.title}>Edit Ticket #{id}</h1>
            <p style={styles.sub}>Update ticket information, status, and resolution details.</p>
          </div>
        </div>

        <div style={styles.cardBody}>
          <form onSubmit={handleSubmit} noValidate>
            <div style={styles.sectionLabelWrap}>
              <span style={{ ...styles.sectionBar, background: "#d97706" }} />
              <p style={styles.sectionLabel}>Employee Information</p>
            </div>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Employee Name <span style={styles.req}>*</span></label>
                <input
                  className="hdms-input"
                  style={styles.input}
                  name="employee_name"
                  value={form.employee_name}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Department <span style={styles.req}>*</span></label>
                <input
                  className="hdms-input"
                  style={styles.input}
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={styles.sectionLabelWrap}>
              <span style={{ ...styles.sectionBar, background: "#f97316" }} />
              <p style={styles.sectionLabel}>Issue Details</p>
            </div>
            <div style={styles.grid3}>
              <div style={styles.field}>
                <label style={styles.label}>Issue Category</label>
                <select
                  className="hdms-input"
                  style={styles.input}
                  name="issue_category"
                  value={form.issue_category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Priority</label>
                <select
                  className="hdms-input"
                  style={styles.input}
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Status</label>
                <select
                  className="hdms-input"
                  style={{
                    ...styles.input,
                    color: STATUS_COLORS[form.status] || "#374151",
                    fontWeight: "700",
                  }}
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  {STATUSES.map((s) => <option key={s} style={{ color: STATUS_COLORS[s] || "#374151" }}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Description <span style={styles.req}>*</span>
                <span style={styles.charCount}>{(form.description || "").length} chars</span>
              </label>
              <textarea
                className="hdms-input"
                style={{ ...styles.input, resize: "vertical", fontFamily: "inherit" }}
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div style={styles.resolveSection}>
              <div style={styles.resolveSectionHeader}>
                <span style={{ ...styles.sectionBar, background: "#16a34a" }} />
                <p style={{ ...styles.sectionLabel, color: "#16a34a" }}>Resolution</p>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Resolution Notes</label>
                <textarea
                  className="hdms-input"
                  style={{ ...styles.input, resize: "vertical", fontFamily: "inherit" }}
                  name="resolution_notes"
                  value={form.resolution_notes || ""}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add resolution details once the issue is addressed (optional)"
                />
              </div>
            </div>

            <div style={styles.btnRow}>
              <button type="button" style={styles.btnCancel} onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="act-btn" style={styles.btnSubmit} disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "2rem", maxWidth: "820px", margin: "0 auto" },
  card: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.09)",
  },

  /* Header */
  cardHeader: {
    background: "linear-gradient(135deg, #78350f 0%, #d97706 100%)",
    padding: "1.75rem 2rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    position: "relative",
    overflow: "hidden",
  },
  deco1: {
    position: "absolute",
    top: "-20px",
    right: "-20px",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.12)",
    pointerEvents: "none",
  },
  deco2: {
    position: "absolute",
    bottom: "-30px",
    left: "30%",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.07)",
    pointerEvents: "none",
  },
  headerIcon: {
    position: "relative",
    zIndex: 1,
    width: "48px",
    height: "48px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "1.4rem",
    border: "1.5px solid rgba(255,255,255,0.3)",
    flexShrink: 0,
  },
  title: { color: "#fff", margin: "0 0 0.2rem", fontWeight: "800", fontSize: "1.4rem" },
  sub:   { color: "#fde68a", margin: 0, fontSize: "0.85rem" },

  /* Body */
  cardBody: { padding: "2rem" },
  sectionLabelWrap: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.75rem",
    paddingBottom: "0.5rem",
    borderBottom: "1.5px solid #f1f5f9",
  },
  sectionBar: {
    display: "inline-block",
    width: "4px",
    height: "16px",
    borderRadius: "2px",
    flexShrink: 0,
  },
  sectionLabel: {
    margin: 0,
    fontWeight: "700",
    color: "#374151",
    fontSize: "0.82rem",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },
  grid:  { display: "grid", gridTemplateColumns: "1fr 1fr",       gap: "1rem", marginBottom: "1.25rem" },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr",   gap: "1rem", marginBottom: "1.25rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1rem" },
  label: {
    fontWeight: "600",
    color: "#374151",
    fontSize: "0.88rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  req: { color: "#dc2626" },
  charCount: { color: "#9ca3af", fontWeight: "400", fontSize: "0.78rem" },
  input: {
    padding: "0.65rem 1rem",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "0.95rem",
    width: "100%",
    boxSizing: "border-box",
    background: "#fafafa",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  resolveSection: {
    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    borderRadius: "12px",
    padding: "1.25rem",
    border: "1px solid #bbf7d0",
    borderLeft: "4px solid #16a34a",
    marginBottom: "1rem",
  },
  resolveSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.75rem",
    paddingBottom: "0.5rem",
    borderBottom: "1px solid #bbf7d0",
  },

  btnRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.8rem",
    marginTop: "1.5rem",
    paddingTop: "1.25rem",
    borderTop: "1px solid #f1f5f9",
  },
  btnCancel: {
    padding: "0.6rem 1.4rem",
    background: "#f3f4f6",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  btnSubmit: {
    padding: "0.6rem 2rem",
    background: "linear-gradient(135deg, #d97706, #b45309)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "0.9rem",
    boxShadow: "0 3px 10px rgba(217,119,6,0.35)",
  },
};
