from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List


class LeaveApply(BaseModel):
    start_date: date
    end_date: date
    reason: str


class LeaveOut(BaseModel):
    id: int
    start_date: date
    end_date: date
    reason: str
    auto_type: str
    status: str
    conflict_count: int
    created_at: datetime

    class Config:
        # pydantic v2: replaces orm_mode = True
        from_attributes = True


class LeaveWithStudent(LeaveOut):
    student_name: str
    class_name: Optional[str]


class CalendarLeaveOut(BaseModel):
    student_name: str
    class_name: Optional[str]
    start_date: date
    end_date: date
    auto_type: str
    reason: str

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str   # "STUDENT" or "FACULTY"


class LoginResponse(BaseModel):
    id: int
    name: str
    role: str
    class_name: Optional[str] = None
    access_token: str
    token_type: str

    class Config:
        from_attributes = True


class LeaveAction(BaseModel):
    comment: Optional[str] = None


class LeaveSummaryResponse(BaseModel):
    total_leaves_allowed: int
    used_leaves: int
    remaining_leaves: int
    
    total_working_days: int
    current_absent_days: int
    current_attendance_percentage: float
    
    projected_absent_days: int
    projected_attendance_percentage: float
    
    will_drop_below_threshold: bool
    threshold: float = 75.0
    
    projected_used_leaves: int
    projected_remaining_leaves: int
