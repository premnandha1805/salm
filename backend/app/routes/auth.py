from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/auth",
    tags=["authentication"],  # 👈 this makes Swagger group visible
)


@router.post("/login", response_model=schemas.LoginResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    """
    Simple login:
    - Matches email + role in users table
    - Compares plain-text password
    """
    user = (
        db.query(models.User)
        .filter(
            models.User.email == payload.email,
            models.User.role == payload.role,
        )
        .first()
    )

    if not user or user.password != payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    from ..auth_utils import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
    from datetime import timedelta
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role},
        expires_delta=access_token_expires
    )

    return {
        "id": user.id,
        "name": user.name,
        "role": user.role,
        "class_name": user.class_name,
        "access_token": access_token,
        "token_type": "bearer"
    }
