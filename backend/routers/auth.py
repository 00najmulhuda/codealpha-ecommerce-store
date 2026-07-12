from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from models.models import User
from schemas.schemas import UserSignup, UserLogin
from auth.hash import hash_password, verify_password
from auth.jwt_handler import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User Registered Successfully"
    }


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    access_token = create_access_token(
        {
            "sub": db_user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }