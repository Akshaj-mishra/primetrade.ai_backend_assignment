from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from main.Routes import router

app = FastAPI(title="Keep Notes Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_headers=["*"],
    allow_methods=["*"],
)

@app.get("/")
def root():
    return {"message": "FastAPI backend running 🚀"}

app.include_router(router, prefix="/api/v1")