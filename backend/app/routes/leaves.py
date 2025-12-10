from fastapi import APIRouter, Depends, HTTPException, Query, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import models, schemas
from ..utils import classify_reason, date_range_days

from ..email_utils import send_leave_notification, send_leave_status_notification


router = APIRouter(prefix="/leaves", tags=["Leaves"])


from ..auth_utils import get_current_user


@router.get("/summary", response_model=schemas.LeaveSummaryResponse)
@router.get("/summary", response_model=schemas.LeaveSummaryResponse)
def leave_summary(
    requested_days: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = current_user
    
    total_leaves = 10
    remaining = user.casual_balance
    used = total_leaves - remaining
    
    # Use defaults if null
    total_working = user.total_working_days or 100
    current_absent = user.absent_days or 0
    
    if total_working == 0:
        total_working = 100 # Avoid division by zero
    
    current_pct = ((total_working - current_absent) / total_working) * 100
    
    projected_absent = current_absent + requested_days
    projected_pct = ((total_working - projected_absent) / total_working) * 100
    
    threshold = 75.0
    will_drop = projected_pct < threshold
    
    # Ensure percentages are not negative
    current_pct = max(0.0, current_pct)
    projected_pct = max(0.0, projected_pct)
    
    # Projected leave balance
    projected_remaining = max(0, remaining - requested_days)
    projected_used = total_leaves - projected_remaining

    return schemas.LeaveSummaryResponse(
        total_leaves_allowed=total_leaves,
        used_leaves=used,
        remaining_leaves=remaining,
        total_working_days=total_working,
        current_absent_days=current_absent,
        current_attendance_percentage=round(current_pct, 1),
        projected_absent_days=projected_absent,
        projected_attendance_percentage=round(projected_pct, 1),
        will_drop_below_threshold=will_drop,
        threshold=threshold,
        projected_used_leaves=projected_used,
        projected_remaining_leaves=projected_remaining,
    )


# ---------- STUDENT: APPLY LEAVE ----------

@router.post("/", response_model=schemas.LeaveOut)
@router.post("/", response_model=schemas.LeaveOut)
def apply_leave(
    payload: schemas.LeaveApply,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = current_user

    if user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Only students can apply for leave")

    if payload.end_date < payload.start_date:
        raise HTTPException(status_code=400, detail="End date cannot be before start date")

    # AI classification
    auto_type = classify_reason(payload.reason)

    # TODO: you can add real conflict detection later (same class + overlapping)
    leave = models.LeaveRequest(
        student_id=user.id,
        start_date=payload.start_date,
        end_date=payload.end_date,
        reason=payload.reason,
        auto_type=auto_type,
        conflict_count=0,
    )

    db.add(leave)
    db.commit()
    db.refresh(leave)

    background_tasks.add_task(
        send_leave_notification,
        student_name=user.name,
        class_name=user.class_name,
        start_date=str(leave.start_date),
        end_date=str(leave.end_date),
        reason=leave.reason,
        auto_type=auto_type,
    )

    return leave


@router.get("/me", response_model=List[schemas.LeaveOut])
@router.get("/me", response_model=List[schemas.LeaveOut])
def my_leaves(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = current_user
    leaves = (
        db.query(models.LeaveRequest)
        .filter(models.LeaveRequest.student_id == user.id)
        .order_by(models.LeaveRequest.created_at.desc())
        .all()
    )
    return leaves


# ---------- FACULTY: VIEW PENDING REQUESTS ----------

@router.get("/pending", response_model=List[schemas.LeaveWithStudent])
@router.get("/pending", response_model=List[schemas.LeaveWithStudent])
def pending_leaves_for_faculty(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    faculty = current_user
    if faculty.role != "FACULTY":
        raise HTTPException(status_code=403, detail="Only faculty can view pending leaves")

    # Join LeaveRequest with User to get student name & class
    rows = (
        db.query(models.LeaveRequest, models.User)
        .join(models.User, models.LeaveRequest.student_id == models.User.id)
        .filter(
            models.LeaveRequest.status == "PENDING",
            models.User.class_name == faculty.class_name,
        )
        .order_by(models.LeaveRequest.created_at.desc())
        .all()
    )

    result: List[schemas.LeaveWithStudent] = []
    for leave, student in rows:
        result.append(
            schemas.LeaveWithStudent(
                id=leave.id,
                start_date=leave.start_date,
                end_date=leave.end_date,
                reason=leave.reason,
                auto_type=leave.auto_type,
                status=leave.status,
                conflict_count=leave.conflict_count,
                created_at=leave.created_at,
                student_name=student.name,
                class_name=student.class_name,
            )
        )

    return result


# ---------- FACULTY: APPROVE / REJECT ----------

@router.put("/{leave_id}/approve", response_model=schemas.LeaveOut)
@router.put("/{leave_id}/approve", response_model=schemas.LeaveOut)
def approve_leave(
    leave_id: int,
    action: schemas.LeaveAction,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    faculty = current_user
    if faculty.role != "FACULTY":
        raise HTTPException(status_code=403, detail="Only faculty can approve leaves")

    leave = db.query(models.LeaveRequest).filter(models.LeaveRequest.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")

    student = db.query(models.User).filter(models.User.id == leave.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Optional safety: ensure same class
    if student.class_name != faculty.class_name:
        raise HTTPException(status_code=403, detail="Faculty not assigned to this class")

    # Calculate leave days and update student's balance
    days = date_range_days(leave.start_date, leave.end_date)
    if student.casual_balance < days:
        raise HTTPException(
            status_code=400,
            detail=f"Student does not have enough leave balance. Has {student.casual_balance}, needs {days}.",
        )

    student.casual_balance -= days
    leave.status = "APPROVED"

    db.commit()
    db.refresh(leave)

    background_tasks.add_task(
        send_leave_status_notification,
        student_name=student.name,
        start_date=str(leave.start_date),
        end_date=str(leave.end_date),
        status="APPROVED",
        reason=action.comment,
    )

    return leave


@router.put("/{leave_id}/reject", response_model=schemas.LeaveOut)
@router.put("/{leave_id}/reject", response_model=schemas.LeaveOut)
def reject_leave(
    leave_id: int,
    action: schemas.LeaveAction,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    faculty = current_user
    if faculty.role != "FACULTY":
        raise HTTPException(status_code=403, detail="Only faculty can reject leaves")

    leave = db.query(models.LeaveRequest).filter(models.LeaveRequest.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")

    student = db.query(models.User).filter(models.User.id == leave.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if student.class_name != faculty.class_name:
        raise HTTPException(status_code=403, detail="Faculty not assigned to this class")

    leave.status = "REJECTED"
    db.commit()
    db.refresh(leave)
    db.commit()
    db.refresh(leave)

    background_tasks.add_task(
        send_leave_status_notification,
        student_name=student.name,
        start_date=str(leave.start_date),
        end_date=str(leave.end_date),
        status="REJECTED",
        reason=action.comment,
    )

    return leave


# ---------- FACULTY: CALENDAR DATA ----------

@router.get("/calendar", response_model=List[schemas.CalendarLeaveOut])
@router.get("/calendar", response_model=List[schemas.CalendarLeaveOut])
def calendar_leaves_for_faculty(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    faculty = current_user
    if faculty.role != "FACULTY":
        raise HTTPException(status_code=403, detail="Only faculty can view calendar")

    rows = (
        db.query(models.LeaveRequest, models.User)
        .join(models.User, models.LeaveRequest.student_id == models.User.id)
        .filter(
            models.LeaveRequest.status == "APPROVED",
            models.User.class_name == faculty.class_name,
        )
        .order_by(models.LeaveRequest.start_date.asc())
        .all()
    )

    result: List[schemas.CalendarLeaveOut] = []
    for leave, student in rows:
        result.append(
            schemas.CalendarLeaveOut(
                student_name=student.name,
                class_name=student.class_name,
                start_date=leave.start_date,
                end_date=leave.end_date,
                auto_type=leave.auto_type,
                reason=leave.reason,
            )
        )

    return result
