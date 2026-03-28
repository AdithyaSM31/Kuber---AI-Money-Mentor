import json
import os
from groq import AsyncGroq
import structlog
from app.models.health_score_request import HealthScoreRequest
from app.scoring.fallback_scorer import calculate_fallback_score
logger = structlog.get_logger()
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
with open(os.path.join(os.path.dirname(__file__), '..', '..', 'prompts', 'health_score_system.txt'), 'r', encoding='utf-8') as f:
    SYSTEM_PROMPT = f.read()
async def analyze_financial_health(req: HealthScoreRequest) -> dict:
    try:
        chat_completion = await client.chat.completions.create(
            messages=[
                {'role': 'system', 'content': SYSTEM_PROMPT},
                {'role': 'user', 'content': req.model_dump_json()}
            ],
            model='llama-3.3-70b-versatile',
            temperature=0.0,
            response_format={'type': 'json_object'}
        )
        raw_json = chat_completion.choices[0].message.content
        data = json.loads(raw_json)
        data['is_fallback'] = False
        return data
    except Exception as e:
        logger.warning('Groq API failed, using fallback scorer', error=str(e))
        fallback_data = calculate_fallback_score(req)
        fallback_data['is_fallback'] = True
        return fallback_data
