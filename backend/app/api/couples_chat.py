import os
import json
from dotenv import load_dotenv
load_dotenv()
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from groq import AsyncGroq

router = APIRouter()

# Deferred Init
client = None

class Message(BaseModel):
    role: str
    content: str

class CoupleChatRequest(BaseModel):
    message: str
    history: List[Message]
    couple_context: Dict[str, Any]

@router.post("/couples-chat")
async def couples_chat(request: CoupleChatRequest):
    async def generate_response():
        try:
            context_str = json.dumps(request.couple_context, indent=2)
            
            system_prompt = f"""You are Kuber, a tax advisor for dual-income Indian couples.
You already have the couple's financial data — never ask for it again.
Couple's data: {context_str}
- Use partner names, never "Partner 1/2"
- Lead with exact numbers, explain after
- Know Indian tax rules: 80C, HRA, NPS, Old vs New regime FY2025-26
- Keep responses under 150 words unless calculating
- End recommendations with: "⚠️ Consult a CA before filing."
"""

            messages = [{"role": "system", "content": system_prompt}]
            
            for msg in request.history:
                messages.append({"role": msg.role, "content": msg.content})
                
            messages.append({"role": "user", "content": request.message})
            
            load_dotenv(dotenv_path="C:\\Users\\adith\\Downloads\\ET Project\\backend\\.env", override=True)
            local_client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
            stream = await local_client.chat.completions.create(
                messages=messages,
                model="llama-3.3-70b-versatile",
                temperature=0.5,
                max_tokens=1000,
                stream=True
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    # Sanitize the content to avoid breaking SSE
                    content = chunk.choices[0].delta.content.replace('\n', '\\n')
                    yield f"data: {content}\n\n"
                    
            yield "data: [DONE]\n\n"
            
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"
            
    return StreamingResponse(generate_response(), media_type="text/event-stream")
