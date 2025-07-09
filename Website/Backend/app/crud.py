# Backend/app/crud.py

from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash  # <-- This import was missing before!

def get_user_by_email(db: Session, email: str):
    """Fetches a user from the database by their email address."""
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    """Creates a new user, hashes their password, and saves it to the database."""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user