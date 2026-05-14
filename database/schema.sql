-- Helpdesk Ticket Management System - Database Schema
-- Database: SQLite

CREATE TABLE IF NOT EXISTS tickets (
    ticket_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_name   TEXT    NOT NULL,
    department      TEXT    NOT NULL,
    issue_category  TEXT    NOT NULL,
    description     TEXT    NOT NULL,
    priority        TEXT    NOT NULL DEFAULT 'Medium',
    status          TEXT    NOT NULL DEFAULT 'Open',
    resolution_notes TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Valid priority values: Low | Medium | High | Critical
-- Valid status values: Open | In Progress | Resolved | Closed
-- Valid categories: VPN Issue | Password Reset | Software Installation |
--                   Laptop Issue | Email Access | Network Connectivity |
--                   Hardware Request | Other
