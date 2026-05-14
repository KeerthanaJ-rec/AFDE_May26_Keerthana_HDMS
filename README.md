# Helpdesk Ticket Management System (HDMS)

## Project Overview
A centralized web-based Helpdesk Ticket Management System that enables employees to raise IT support tickets and administrators to manage and resolve them.

## Features Implemented
- Create, view, update, and delete support tickets
- Ticket status tracking (Open → In Progress → Resolved → Closed)
- Priority levels: Low, Medium, High, Critical
- Keyword-based search and multi-filter (category, status, priority)
- Dashboard with live ticket stats and recent tickets
- Fully responsive React frontend
- REST API with FastAPI backend
- SQLite database with SQLAlchemy ORM

## Technology Stack
| Layer       | Technology         |
|-------------|-------------------|
| Frontend    | React 18, React Router v6, Axios |
| Backend     | Python 3.10+, FastAPI, Uvicorn |
| Database    | SQLite (via SQLAlchemy ORM) |
| API Testing | Postman |
| Version Control | Git / GitHub |

---

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
The API will start at `http://localhost:8000`
Interactive docs: `http://localhost:8000/docs`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The app will open at `http://localhost:3000`

### Database
SQLite DB is auto-created at `database/hdms.db` when the backend starts.
Schema script is available at `database/schema.sql`.

---

## API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/tickets`          | Retrieve all tickets     |
| GET    | `/tickets/{id}`     | Retrieve ticket by ID    |
| POST   | `/tickets`          | Create a new ticket      |
| PUT    | `/tickets/{id}`     | Update a ticket          |
| DELETE | `/tickets/{id}`     | Delete a ticket          |
| GET    | `/search`           | Search / filter tickets  |
| GET    | `/stats`            | Get ticket statistics    |

### Search Query Parameters
| Parameter  | Description                  |
|------------|------------------------------|
| `keyword`  | Search in name/dept/desc     |
| `category` | Filter by issue category     |
| `status`   | Filter by status             |
| `priority` | Filter by priority level     |

### Create Ticket — Request Body
```json
{
  "employee_name": "Keerthana J",
  "department": "Engineering",
  "issue_category": "VPN Issue",
  "description": "Unable to connect to VPN from home network.",
  "priority": "High"
}
```

### Update Ticket — Request Body (all fields optional)
```json
{
  "status": "In Progress",
  "resolution_notes": "Checked VPN config, resetting credentials."
}
```

---

## Project Structure
```
HDMS/
├── backend/
│   ├── main.py          # FastAPI app entry point
│   ├── database.py      # SQLAlchemy engine & session
│   ├── models.py        # ORM models
│   ├── schemas.py       # Pydantic schemas
│   ├── crud.py          # DB operations
│   ├── routers/
│   │   └── tickets.py   # Ticket endpoints
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/  # Navbar, TicketTable, StatCard
│       ├── pages/       # Dashboard, Create, List, Detail, Edit, Search
│       ├── services/    # ticketService.js (API calls)
│       ├── api.js       # Axios base config
│       └── App.js       # Router setup
├── database/
│   └── schema.sql       # SQLite schema script
├── screenshots/         # Add screenshots here
├── docs/
├── README.md
└── .gitignore
```

## Ticket Fields
| Field            | Type     | Description                       |
|------------------|----------|-----------------------------------|
| ticket_id        | Integer  | Auto-generated primary key        |
| employee_name    | String   | Name of the employee              |
| department       | String   | Employee's department             |
| issue_category   | String   | Category of the IT issue          |
| description      | Text     | Detailed description of the issue |
| priority         | String   | Low / Medium / High / Critical    |
| status           | String   | Open / In Progress / Resolved / Closed |
| resolution_notes | Text     | Admin-added resolution details    |
| created_at       | DateTime | Timestamp of ticket creation      |
