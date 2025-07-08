from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

# Create an instance of the FastAPI class
app = FastAPI()

# --- YOUR API ROUTES ---
@app.get("/api/hello")
def say_hello():
    return {"greeting": "Hello, your backend is working!"}


# --- THIS IS THE CORRECTED LINE ---
# The path is now "Frontend", without the "../"
app.mount("/", StaticFiles(directory="Frontend", html=True), name="frontend")