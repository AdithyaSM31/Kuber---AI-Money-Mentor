import os
import json
import io
from pypdf import PdfReader
from groq import AsyncGroq
import structlog

logger = structlog.get_logger()
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

async def analyze_mf_statement(file_bytes: bytes) -> dict:
    try:
        # Extract text from PDF
        pdf_file = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\\n"

        prompt = """You are a financial AI. Extract all mutual fund holdings from the following text into exactly a JSON object. 
Keys required:
- 'holdings': an array of objects. 
Each object must have: 
  - 'fund_name' (string): The name of the fund
  - 'category' (string): One of [Large Cap, Mid Cap, Small Cap, Sectoral, Debt, Hybrid] based on your knowledge of the fund.
  - 'amount' (numeric): The current value or amount.

Return ONLY valid JSON.

Text to parse:
""" + text[:30000]

        chat_completion = await client.chat.completions.create(
            messages=[
                {'role': 'user', 'content': prompt}
            ],
            model='llama-3.3-70b-versatile',
            temperature=0.0,
            response_format={'type': 'json_object'}
        )
        
        raw_json = chat_completion.choices[0].message.content
        return json.loads(raw_json)
    except Exception as e:
        logger.warning(f"Groq API failed: {e}. Using fallback.")
        return {"error": str(e), "fallback": True, "holdings": [
            {"fund_name": "Axis Bluechip Fund", "category": "Large Cap", "amount": 50000},
            {"fund_name": "Parag Parikh Flexi Cap", "category": "Hybrid", "amount": 120000},
            {"fund_name": "Nippon India Small Cap", "category": "Small Cap", "amount": 85000}
        ]}
