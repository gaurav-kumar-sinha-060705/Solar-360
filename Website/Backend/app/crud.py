from sqlalchemy.orm import Session
from typing import Optional
from . import models, schemas
from .auth import get_password_hash  # Correct: This import was indeed missing in your fragment!

def get_user_by_email(db: Session, email: str) -> Optional[models.User]: # Added return type hint
    """Fetches a user from the database by their email address."""
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate) -> models.User: # Added return type hint
    """Creates a new user, hashes their password, and saves it to the database."""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
        is_active=True # Ensure is_active is set, though default is True in model
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# (Any other existing CRUD operations for tools would go here)