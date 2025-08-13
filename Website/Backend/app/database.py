import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Load the database URL from an environment variable.
# The key here must be the name of the variable, which is "DATABASE_URL".
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")

# Raise an error if the environment variable is not set.
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set.")

# Create the SQLAlchemy engine using the production database URL.
# Note that connect_args are not needed for production databases like PostgreSQL.
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
