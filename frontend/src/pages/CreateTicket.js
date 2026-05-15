import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../services/ticketService";

const CATEGORIES = [
  "VPN Issue", "Password Reset", "Software Installation",
  "Laptop Issue", "Email Access", "Network Connectivity", "Hardware Request", "Other",
];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

const initialForm = {
  employee_name: "",
  department: "",
  issue_category: "VPN Issue",
  description: "",
  priority: "Medium",
};

export default function CreateTicket() {
  const [form, setForm]         = useState(initialForm);
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.employee_name.trim()) e.employee_name = "Employee name is required";
    if (!form.department.trim())    e.department    = "Department is required";
    if (!form.description.trim())   e.description   = "Description is required";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const res = await createTicket(form);
      navigate(`/tickets/${res.data.ticket_id}`);
    } catch {
      alert("Failed to create ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Card Header */}
        <div style={styles.cardHeader}>
          <div style={styles.deco1} />
          <div style={styles.deco2} />
          <div style={styles.headerIcon}>+</div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={styles.title}>Create Support Ticket</h1>
            <p style={styles.sub}>Fill in the details to raise a new IT support request.</p>
          </div>
        </div>

        <div style={styles.cardBody}>
          <form onSubmit={handleSubmit} noValidate>
            <div style={styles.sectionLabelWrap}>
              <span style={{ ...styles.sectionBar, background: "#1d4ed8" }} />
              <p style={styles.sectionLabel}>Employee Information</p>
            </div>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Employee Name <span style={styles.req}>*</span></label>
                <input
                  className="hdms-input"
                  style={{ ...styles.input, ...(errors.employee_name ? styles.inputErr : {}) }}
                  name="employee_name"
                  value={form.employee_name}
                  onChange={handleChange}
                  placeholder="e.g. Keerthana J"
                />
                {errors.employee_name && <span style={styles.errMsg}>{errors.employee_name}</span>}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Department <span style={styles.req}>*</span></label>
                <input
                  className="hdms-input"
                  style={{ ...styles.input, ...(errors.department ? styles.inputErr : {}) }}
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Engineering"
                />
                {errors.department && <span style={styles.errMsg}>{errors.department}</span>}
              </div>
            </div>

            <div style={styles.sectionLabelWrap}>
              <span style={{ ...styles.sectionBar, background: "#f97316" }} />
              <p style={styles.sectionLabel}>Issue Details</p>
            </div>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Issue Category <span style={styles.req}>*</span></label>
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
                <label style={styles.label}>Priority <span style={styles.req}>*</span></label>
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
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Description <span style={styles.req}>*</span>
                <span style={styles.charCount}>{form.description.length} chars</span>
              </label>
              <textarea
                className="hdms-input"
                style={{ ...styles.input, ...styles.textarea, ...(errors.description ? styles.inputErr : {}) }}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail — steps to reproduce, error messages, urgency..."
                rows={5}
              />
              {errors.description && <span style={styles.errMsg}>{errors.description}</span>}
            </div>

            <div style={styles.btnRow}>
              <button type="button" style={styles.btnCancel} onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="act-btn" style={styles.btnSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Ticket"}
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

  /* Card Header */
  cardHeader: {
    background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
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
    fontSize: "1.8rem",
    fontWeight: "300",
    border: "1.5px solid rgba(255,255,255,0.3)",
    flexShrink: 0,
    lineHeight: 1,
  },
  title: { color: "#fff", margin: "0 0 0.2rem", fontWeight: "800", fontSize: "1.4rem" },
  sub:   { color: "#bfdbfe", margin: 0, fontSize: "0.85rem" },

  /* Card Body */
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
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" },
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
  inputErr: { borderColor: "#dc2626", background: "#fff" },
  textarea: { resize: "vertical", fontFamily: "inherit", minHeight: "110px" },
  errMsg: { color: "#dc2626", fontSize: "0.79rem", fontWeight: "500" },

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
    background: "linear-gradient(135deg, #1e40af, #1d4ed8)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "0.9rem",
    boxShadow: "0 3px 10px rgba(30,64,175,0.35)",
  },
};
