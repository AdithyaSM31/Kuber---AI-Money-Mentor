from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from app.agents.advisor import get_advisor_response
import structlog

router = APIRouter()
logger = structlog.get_logger()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    context: Optional[Dict[str, Any]] = None

@router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    # Convert Pydantic history to a list of dicts for the agent
    history_dicts = [{"role": msg.role, "content": msg.content} for msg in (req.history or [])]
    return await get_advisor_response(message=req.message, history=history_dicts, context_data=req.context)
