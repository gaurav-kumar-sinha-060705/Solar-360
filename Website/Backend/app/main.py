from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import users, tools # Import the users router here

# This command creates the database tables from your models
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS Middleware ---
# This allows your frontend (running on a different port or serving from a file)
# to communicate with the backend.
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    # Add any other origins where your frontend might be hosted
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods for simplicity in development
    allow_headers=["*"], # Allow all headers for simplicity in development
)

# --- Include API Routers ---
app.include_router(users.router) # Include the users router directly, no prefix needed here for /token, /register
app.include_router(tools.router, prefix="/api") # All tool routes will be under /api/tools/...

# --- Serve Frontend Static Files ---
# This line is critical. It tells FastAPI to serve the HTML, CSS, JS from your frontend folder.
# The path must be relative to where you run the `uvicorn` command.
# If you run `uvicorn` from the `backend/` folder, the path is correct.
# If you run from the root `Website/` folder, it would be `directory="frontend"`.
app.mount("/", StaticFiles(directory="../frontend", html=True), name="static")