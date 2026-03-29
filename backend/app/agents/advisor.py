import os
import json
from groq import AsyncGroq
import structlog

logger = structlog.get_logger()
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

async def get_advisor_response(message: str, history: list = None, context_data: dict = None) -> dict:
    # 1. Simulate the Agentic Workflow logs for the UI
    logs = [
        {"agent": "Router System", "action": "Received user query, classifying intent..."},
        {"agent": "Profiler Agent", "action": "Analyzing user context and financial memory..."},
        {"agent": "Advisor Agent", "action": "Formulating strategic, personalized response..."}
    ]

    system_prompt = "You are an elite, highly intelligent financial AI advisor for Indian retail investors named Kuber. Limit prose, be direct, conversational, and use clean bullet points where appropriate. Always relate advice back to wealth creation."

    if context_data:
        system_prompt += f"\n\nUSER FINANCIAL CONTEXT:\n{json.dumps(context_data)}"

    # Build the message history
    formatted_messages = [{'role': 'system', 'content': system_prompt}]
    
    if history:
        for msg in history:
            # Map frontend 'ai' role to 'assistant' for the Groq API
            role = 'assistant' if msg.get("role") == "ai" else 'user'
            formatted_messages.append({'role': role, 'content': msg.get("content", "")})
            
    formatted_messages.append({'role': 'user', 'content': message})

    try:
        chat_completion = await client.chat.completions.create(
            messages=formatted_messages,
            model='llama-3.3-70b-versatile',
            temperature=0.7
        )
        
        answer = chat_completion.choices[0].message.content
        logs.append({"agent": "Execution Engine", "action": "Response payload generated beautifully."})
        
        return {
            "answer": answer,
            "logs": logs
        }
    except Exception as e:
        logger.error(f"Advisor error: {str(e)}")
        return {
            "answer": "I am experiencing temporary cognitive dissonance (Server Error). Please try again.",
            "logs": [{"agent": "System Exception", "action": f"Error: {str(e)}"}]
        }
