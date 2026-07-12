from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from pathlib import Path
import os

# Load .env from backend folder
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# Debug (remove later)
print("DB_HOST =", os.getenv("DB_HOST"))
print("DB_PORT =", os.getenv("DB_PORT"))
print("DB_NAME =", os.getenv("DB_NAME"))
print("DB_USER =", os.getenv("DB_USER"))
print("DB_PASSWORD =", os.getenv("DB_PASSWORD"))

DATABASE_URL = (
    f"postgresql://{os.getenv('DB_USER')}:"
    f"{os.getenv('DB_PASSWORD')}@"
    f"{os.getenv('DB_HOST')}:"
    f"{os.getenv('DB_PORT')}/"
    f"{os.getenv('DB_NAME')}"
)

print("DATABASE_URL =", DATABASE_URL)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()