import { useState } from "react";
import { searchTickets, deleteTicket } from "../services/ticketService";
import TicketTable from "../components/TicketTable";

const CATEGORIES = ["", "VPN Issue", "Password Reset", "Software Installation", "Laptop Issue", "Email Access", "Network Connectivity", "Hardware Request", "Other"];
const STATUSES   = ["", "Open", "In Progress", "Resolved", "Closed"];
const PRIORITIES = ["", "Low", "Medium", "High", "Critical"];

export default function SearchTickets() {
  const [keyword,  setKeyword]  = useState("");
  const [category, setCategory] = useState("");
  const [status,   setStatus]   = useState("");
  const [priority, setPriority] = useState("");
  const [results,  setResults]  = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const activeFilters = [keyword, category, status, priority].filter(Boolean).length;

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (keyword)  params.keyword  = keyword;
      if (category) params.category = category;
      if (status)   params.status   = status;
      if (priority) params.priority = priority;
      const res = await searchTickets(params);
      setResults(res.data);
      setSearched(true);
    } catch {
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setKeyword(""); setCategory(""); setStatus(""); setPriority("");
    setResults([]); setSearched(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete ticket #${id}?`)) return;
    try {
      await deleteTicket(id);
      setResults((prev) => prev.filter((t) => t.ticket_id !== id));
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
          <div style={styles.heroPill}>Search &amp; Filter</div>
          <h1 style={styles.heroTitle}>Search Tickets</h1>
          <p style={styles.heroSub}>Filter tickets by keyword, category, status, or priority</p>
        </div>
        <div style={styles.heroIconBox}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
      </div>

      {/* Filter Card */}
      <div style={styles.filterCard}>
        <div style={styles.filterCardHeader}>
          <div style={styles.filterIconBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
          </div>
          <span style={styles.filterCardTitle}>Filter Options</span>
          {activeFilters > 0 && (
            <span style={styles.filterBadge}>{activeFilters} active</span>
          )}
        </div>

        <form onSubmit={handleSearch}>
          <div style={styles.filterBody}>
            {/* Keyword Row */}
            <div style={styles.keywordRow}>
              <div style={styles.keywordWrap}>
                <svg style={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  className="hdms-input"
                  style={styles.keywordInput}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search by name, department, or description..."
                />
              </div>
            </div>

            {/* Filter Grid */}
            <div style={styles.filterGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Category</label>
                <select
                  className="hdms-input"
                  style={styles.select}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c || "All Categories"}</option>
                  ))}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Status</label>
                <select
                  className="hdms-input"
                  style={styles.select}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s || "All Statuses"}</option>
                  ))}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Priority</label>
                <select
                  className="hdms-input"
                  style={styles.select}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p || "All Priorities"}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={styles.btnRow}>
            {(activeFilters > 0 || searched) && (
              <button type="button" style={styles.btnClear} onClick={handleClear}>
                Clear All
              </button>
            )}
            <button type="submit" style={styles.btnSearch} disabled={loading}>
              {loading ? "Searching..." : "Search Tickets"}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div style={styles.resultsCard}>
          <div style={styles.resultsHeader}>
            <div style={styles.resultsHeaderLeft}>
              <div style={styles.resultsHeaderDot} />
              <span style={styles.resultsTitle}>Search Results</span>
            </div>
            <span style={{
              ...styles.resultCountBadge,
              background: results.length > 0 ? "#dbeafe" : "#f3f4f6",
              color:      results.length > 0 ? "#1e40af" : "#6b7280",
            }}>
              {results.length} {results.length === 1 ? "ticket" : "tickets"} found
            </span>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : (
            <TicketTable tickets={results} onDelete={handleDelete} />
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "2rem", maxWidth: "1200px", margin: "0 auto" },

  /* Hero */
  hero: {
    background: "linear-gradient(135deg, #1e1b4b 0%, #4f46e5 55%, #7c3aed 100%)",
    borderRadius: "18px",
    padding: "1.1rem 2rem",
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1.25rem",
    boxShadow: "0 10px 30px rgba(79,70,229,0.4)",
    position: "relative",
    overflow: "hidden",
  },
  deco1: {
    position: "absolute",
    top: "-30px",
    right: "80px",
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.10)",
    pointerEvents: "none",
  },
  deco2: {
    position: "absolute",
    bottom: "-40px",
    left: "35%",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    pointerEvents: "none",
  },
  heroContent: { position: "relative", zIndex: 1 },
  heroPill: {
    display: "inline-block",
    background: "rgba(255,255,255,0.15)",
    color: "#e0e7ff",
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
  heroSub: { color: "#e0e7ff", margin: 0, fontSize: "0.88rem" },
  heroIconBox: {
    position: "relative",
    zIndex: 1,
    width: "64px",
    height: "64px",
    background: "rgba(255,255,255,0.12)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1.5px solid rgba(255,255,255,0.2)",
    flexShrink: 0,
  },

  /* Filter Card */
  filterCard: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
    marginBottom: "1.5rem",
  },
  filterCardHeader: {
    background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
    padding: "1rem 1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  filterIconBox: {
    width: "32px",
    height: "32px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.3)",
    flexShrink: 0,
  },
  filterCardTitle: { fontWeight: "700", color: "#fff", fontSize: "0.95rem" },
  filterBadge: {
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "2px 10px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
  },

  filterBody: { padding: "1.5rem 1.75rem 0" },

  /* Keyword */
  keywordRow: { marginBottom: "1rem" },
  keywordWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "0.9rem",
    pointerEvents: "none",
    flexShrink: 0,
  },
  keywordInput: {
    padding: "0.7rem 1rem 0.7rem 2.5rem",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "0.95rem",
    width: "100%",
    boxSizing: "border-box",
    background: "#fafafa",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },

  /* Filter Grid */
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    marginBottom: "1.25rem",
  },
  field: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  label: { fontWeight: "600", color: "#374151", fontSize: "0.82rem" },
  select: {
    padding: "0.65rem 1rem",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "0.9rem",
    width: "100%",
    boxSizing: "border-box",
    background: "#fafafa",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },

  btnRow: {
    display: "flex",
    gap: "0.8rem",
    justifyContent: "flex-end",
    padding: "1rem 1.75rem",
    borderTop: "1px solid #f1f5f9",
    marginTop: "1.25rem",
  },
  btnClear: {
    padding: "0.6rem 1.2rem",
    background: "#f3f4f6",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  btnSearch: {
    padding: "0.6rem 2rem",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "0.9rem",
    boxShadow: "0 3px 10px rgba(79,70,229,0.35)",
  },

  /* Results */
  resultsCard: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
  },
  resultsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.1rem 1.5rem",
    borderBottom: "1px solid #f1f5f9",
    background: "#fafbff",
  },
  resultsHeaderLeft: { display: "flex", alignItems: "center", gap: "0.6rem" },
  resultsHeaderDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    boxShadow: "0 0 0 3px rgba(124,58,237,0.2)",
  },
  resultsTitle: { fontWeight: "700", color: "#4f46e5", fontSize: "0.95rem" },
  resultCountBadge: {
    padding: "3px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "700",
  },
};
