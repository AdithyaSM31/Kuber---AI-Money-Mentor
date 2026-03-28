from fastapi import APIRouter, UploadFile, File, Request, HTTPException
import structlog
from app.agents.pdf_parser import analyze_mf_statement

router = APIRouter()
logger = structlog.get_logger()

@router.post("/mf-xray")
async def process_mf_statement(request: Request, file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        content = await file.read()
        res = await analyze_mf_statement(content)
        return {"status": "success", "data": res}
    except Exception as e:
        logger.error("Failed to parse MF statement", error=str(e))
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

