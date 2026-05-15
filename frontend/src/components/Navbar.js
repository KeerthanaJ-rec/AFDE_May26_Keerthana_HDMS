import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { path: "/", label: "Dashboard" },
  { path: "/tickets", label: "All Tickets" },
  { path: "/search", label: "Search" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <div style={styles.logoBox}>
          <span style={styles.logoText}>HD</span>
        </div>
        <div>
          <div style={styles.brandTitle}>HDMS</div>
          <div style={styles.brandSub}>Helpdesk Management System</div>
        </div>
      </div>

      <div style={styles.navRight}>
        <div style={styles.links}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="nav-link"
                style={{ ...styles.link, ...(isActive ? styles.activeLink : {}) }}
              >
                {link.label}
                {isActive && <span style={styles.activeDot} />}
              </Link>
            );
          })}
        </div>
        <Link to="/create" className="create-btn" style={styles.createBtn}>
          + New Ticket
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
    padding: "0 2rem",
    height: "64px",
    boxShadow: "0 4px 20px rgba(30, 58, 138, 0.45)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  brand: { display: "flex", alignItems: "center", gap: "0.85rem" },
  logoBox: {
    width: "42px",
    height: "42px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1.5px solid rgba(255,255,255,0.3)",
    flexShrink: 0,
  },
  logoText: { color: "#fff", fontWeight: "900", fontSize: "0.85rem", letterSpacing: "1px" },
  brandTitle: {
    color: "#fff",
    fontWeight: "800",
    fontSize: "1.1rem",
    letterSpacing: "0.5px",
    lineHeight: 1.25,
  },
  brandSub: { color: "#93c5fd", fontSize: "0.67rem", fontWeight: "500", marginTop: "1px" },

  navRight: { display: "flex", alignItems: "center", gap: "0.5rem" },
  links: { display: "flex", gap: "0.2rem", alignItems: "center" },
  link: {
    color: "#bfdbfe",
    textDecoration: "none",
    padding: "0.45rem 1rem",
    borderRadius: "8px",
    fontWeight: "500",
    fontSize: "0.9rem",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  activeLink: {
    background: "rgba(255,255,255,0.18)",
    color: "#fff",
    fontWeight: "700",
  },
  activeDot: {
    width: "4px",
    height: "4px",
    background: "#60a5fa",
    borderRadius: "50%",
    marginTop: "3px",
  },
  createBtn: {
    marginLeft: "0.6rem",
    padding: "0.48rem 1.15rem",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "0.88rem",
    boxShadow: "0 3px 10px rgba(245,158,11,0.45)",
    whiteSpace: "nowrap",
    display: "inline-block",
  },
};
