import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api import health_score, mf_xray, chat, couples_chat
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import structlog
from dotenv import load_dotenv

load_dotenv()

# Setup structlog
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ]
)

# Initialize slowapi limiter
def get_user_id(request: Request):
    # Try to extract user_id, fallback to IP
    return get_remote_address(request)

limiter = Limiter(key_func=get_user_id)

app = FastAPI(title="ET MoneyMind API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    logger = structlog.get_logger()
    response = await call_next(request)
    return response

app.include_router(health_score.router, prefix="/api/v1")
app.include_router(mf_xray.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(couples_chat.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "ok", "service": "ET MoneyMind Health Score API"}

