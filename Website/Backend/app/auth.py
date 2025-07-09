from datetime import datetime, timedelta
from typing import Optional # Use Optional for pre-Python 3.10 compatibility

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from sqlalchemy.orm import Session
from .database import get_db # Correct import for the dependency
from . import schemas, crud, models # Import models for type hinting in get_current_active_user

# --- Configuration ---
SECRET_KEY = "a_very_secret_key_for_your_project" # In production, use environment variables
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# --- Password Hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") # Points to the login endpoint

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# --- JWT Token Handling ---
# Use Optional for timedelta for pre-Python 3.10 compatibility
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        # Default to ACCESS_TOKEN_EXPIRE_MINUTES, not hardcoded 15
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- User Authentication & Authorization ---
def authenticate_user(db: Session, email: str, password: str) -> Optional[models.User]: # Corrected return type
    user = crud.get_user_by_email(db, email=email)
    if not user:
        return None # Return None directly if user not found
    if not verify_password(password, user.hashed_password):
        return None # Return None if password doesn't match
    return user

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> models.User: # Corrected db dependency and return type
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(current_user: models.User = Depends(get_current_user)) -> models.User: # Corrected type hint to models.User
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user