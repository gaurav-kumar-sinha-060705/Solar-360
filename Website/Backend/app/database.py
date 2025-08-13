import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Load the database URL from an environment variable.
# Vercel will provide this value from the environment variable you set in the dashboard.
SQLALCHEMY_DATABASE_URL = os.environ.get("postgresql://neondb_owner:npg_Ugx7NCKWJvc8@ep-long-dust-a17kuf8n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")

# Raise an error if the environment variable is not set.
# This ensures you don't accidentally deploy without a database.
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
