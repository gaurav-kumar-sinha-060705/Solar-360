from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False) # Added nullable=False for consistency
    email = Column(String, unique=True, index=True, nullable=False) # Added nullable=False
    hashed_password = Column(String, nullable=False) # Added nullable=False
    is_active = Column(Boolean, default=True) # Moved inside the class

    # Optional: You can define relationships here if users own other data
    # For example:
    # items = relationship("Item", back_populates="owner")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', full_name='{self.full_name}', is_active={self.is_active})>"