from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Ticket
from schemas import TicketCreate, TicketUpdate


def get_all_tickets(db: Session):
    return db.query(Ticket).order_by(Ticket.created_at.desc()).all()


def get_ticket_by_id(db: Session, ticket_id: int):
    return db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()


def create_ticket(db: Session, ticket: TicketCreate):
    db_ticket = Ticket(
        employee_name=ticket.employee_name,
        department=ticket.department,
        issue_category=ticket.issue_category,
        description=ticket.description,
        priority=ticket.priority,
        status="Open",
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def update_ticket(db: Session, ticket_id: int, ticket: TicketUpdate):
    db_ticket = get_ticket_by_id(db, ticket_id)
    if not db_ticket:
        return None
    update_data = ticket.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_ticket, field, value)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def delete_ticket(db: Session, ticket_id: int):
    db_ticket = get_ticket_by_id(db, ticket_id)
    if not db_ticket:
        return False
    db.delete(db_ticket)
    db.commit()
    return True


def search_tickets(
    db: Session,
    keyword: str = None,
    category: str = None,
    status: str = None,
    priority: str = None,
):
    query = db.query(Ticket)

    if keyword:
        query = query.filter(
            or_(
                Ticket.description.ilike(f"%{keyword}%"),
                Ticket.employee_name.ilike(f"%{keyword}%"),
                Ticket.department.ilike(f"%{keyword}%"),
                Ticket.issue_category.ilike(f"%{keyword}%"),
            )
        )
    if category:
        query = query.filter(Ticket.issue_category == category)
    if status:
        query = query.filter(Ticket.status == status)
    if priority:
        query = query.filter(Ticket.priority == priority)

    return query.order_by(Ticket.created_at.desc()).all()


def get_ticket_stats(db: Session):
    total = db.query(Ticket).count()
    open_count = db.query(Ticket).filter(Ticket.status == "Open").count()
    in_progress = db.query(Ticket).filter(Ticket.status == "In Progress").count()
    resolved = db.query(Ticket).filter(Ticket.status == "Resolved").count()
    closed = db.query(Ticket).filter(Ticket.status == "Closed").count()
    return {
        "total": total,
        "open": open_count,
        "in_progress": in_progress,
        "resolved": resolved,
        "closed": closed,
    }
