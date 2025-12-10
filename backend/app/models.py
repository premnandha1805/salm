from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # STUDENT or FACULTY
    class_name = Column(String(50))
    casual_balance = Column(Integer, default=10)
    
    # Attendance Tracking
    total_working_days = Column(Integer, default=100)
    absent_days = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    leaves = relationship("LeaveRequest", back_populates="student")


class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(Text, nullable=False)

    auto_type = Column(String(50), nullable=False)
    status = Column(String(50), default="PENDING")
    conflict_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("User", back_populates="leaves")
