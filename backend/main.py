from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes.detect import router as detect_router


# =====================================================
# CREATE FASTAPI APP
# =====================================================

app = FastAPI(
    title="ELECTROHACK Tower Detection API",
    description="AI-based tower component detection API",
    version="1.0.0"
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# OUTPUT FOLDER
# =====================================================

BASE_DIR = Path(__file__).resolve().parent

OUTPUT_DIR = BASE_DIR / "outputs"

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# =====================================================
# SERVE PROCESSED IMAGES
# =====================================================

app.mount(
    "/outputs",
    StaticFiles(
        directory=str(OUTPUT_DIR)
    ),
    name="outputs"
)


# =====================================================
# DETECTION ROUTE
# =====================================================

app.include_router(
    detect_router
)


# =====================================================
# HOME ROUTE
# =====================================================

@app.get("/")
def root():

    return {
        "status": "success",
        "message": "ELECTROHACK API is running"
    }


# =====================================================
# TEST ROUTE
# =====================================================

@app.get("/hello/{name}")
def hello(name: str):

    return {
        "message": f"Hello {name}"
    }