from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum


class PriorityEnum(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"
    critical = "Critical"


class StatusEnum(str, Enum):
    open = "Open"
    in_progress = "In Progress"
    resolved = "Resolved"
    closed = "Closed"


class CategoryEnum(str, Enum):
    vpn = "VPN Issue"
    password = "Password Reset"
    software = "Software Installation"
    laptop = "Laptop Issue"
    email = "Email Access"
    network = "Network Connectivity"
    hardware = "Hardware Request"
    other = "Other"


class TicketCreate(BaseModel):
    employee_name: str
    department: str
    issue_category: str
    description: str
    priority: PriorityEnum = PriorityEnum.medium

    @field_validator("employee_name", "department", "description")
    @classmethod
    def must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field must not be blank")
        return v.strip()


class TicketUpdate(BaseModel):
    employee_name: Optional[str] = None
    department: Optional[str] = None
    issue_category: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None
    resolution_notes: Optional[str] = None


class TicketResponse(BaseModel):
    ticket_id: int
    employee_name: str
    department: str
    issue_category: str
    description: str
    priority: str
    status: str
    resolution_notes: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
