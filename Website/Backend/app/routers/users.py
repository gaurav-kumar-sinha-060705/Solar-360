from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from .. import crud, schemas, auth # Import auth and schemas
from ..database import get_db # Import get_db from .database

router = APIRouter(
    # Optional: Add a prefix for all routes in this router, e.g., "/auth"
    # prefix="/auth",
    tags=["Users & Authentication"] # Changed tag for clarity
)

@router.post("/register", response_model=schemas.User, tags=["Users & Authentication"]) # Changed endpoint path from /users/ to /register for clarity
def create_user_account(user: schemas.UserCreate, db: Session = Depends(get_db)): # Corrected db dependency
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@router.post("/token", response_model=schemas.Token, tags=["Users & Authentication"])
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db) # Corrected db dependency
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Changed to use auth.ACCESS_TOKEN_EXPIRE_MINUTES
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me/", response_model=schemas.User, tags=["Users & Authentication"]) # Added back this crucial endpoint
async def read_users_me(current_user: schemas.User = Depends(auth.get_current_active_user)):
    """Fetches details of the currently authenticated user."""
    return current_user