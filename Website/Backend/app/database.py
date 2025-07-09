from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# For a simple start, we use SQLite.
# In production, you would replace this with your PostgreSQL or MySQL connection string.
SQLALCHEMY_DATABASE_URL = "sqlite:///./solar360.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()