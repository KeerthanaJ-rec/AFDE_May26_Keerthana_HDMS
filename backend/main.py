import os
from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional

from database import engine, get_db
import models
import crud
from routers import tickets

os.makedirs("database", exist_ok=True)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Helpdesk Ticket Management System",
    description="REST API for managing IT support tickets",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tickets.router)


@app.get("/")
def root():
    return {"message": "HDMS API is running", "docs": "/docs"}


@app.get("/search")
def search_tickets(
    keyword: Optional[str] = Query(None, description="Search in name, dept, description"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    db: Session = Depends(get_db),
):
    return crud.search_tickets(db, keyword=keyword, category=category, status=status, priority=priority)


@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return crud.get_ticket_stats(db)
