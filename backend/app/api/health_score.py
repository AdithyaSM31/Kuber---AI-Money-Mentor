import uuid
import time
from datetime import datetime, timezone
import asyncio
from fastapi import APIRouter, Request
from app.models.health_score_request import HealthScoreRequest
from app.models.health_score_response import HealthScoreResponse
from app.agents.analyzer import analyze_financial_health
import structlog
from app.db.supabase import save_health_score, save_financial_profile

router = APIRouter()
logger = structlog.get_logger()

@router.post("/health-score", response_model=HealthScoreResponse)
async def calculate_score(request: Request, body: HealthScoreRequest):
    start_time = time.time()
    score_id = str(uuid.uuid4())
    calc_time = datetime.now(timezone.utc).isoformat()

    # Apply rate limiter programmatically since decorator can struggle to read body in advance
    def dummy_func(request: Request):
        pass
    request.app.state.limiter.limit("10/hour")(dummy_func)(request)

    # Call AI
    ai_result = await analyze_financial_health(body)

    # Fire and forget supabase writes
    asyncio.create_task(save_financial_profile({
        "user_id": body.user_id,
        "age": body.age,
        "monthly_income": body.monthly_income,
        "monthly_expenses": body.monthly_expenses,
        "emergency_fund_months": body.emergency_fund_months,
        "has_term_insurance": body.has_term_insurance,
        "has_health_insurance": body.has_health_insurance,
        "monthly_sip": body.monthly_sip,
        "has_loans": body.has_loans,
        "monthly_emi": body.monthly_emi,
        "tax_regime": body.tax_regime,
        "risk_appetite": body.risk_appetite,
        "updated_at": calc_time
    }))

    asyncio.create_task(save_health_score({
        "id": score_id,
        "user_id": body.user_id,
        "overall_score": ai_result["overall"],
        "emergency_score": ai_result["scores"]["emergency"],
        "insurance_score": ai_result["scores"]["insurance"],
        "diversification_score": ai_result["scores"]["diversification"],
        "debt_health_score": ai_result["scores"]["debtHealth"],
        "tax_efficiency_score": ai_result["scores"]["taxEfficiency"],
        "retirement_score": ai_result["scores"]["retirement"],
        "ai_insights": ai_result["insights"],
        "top_priority": ai_result["topPriority"],
        "advisor_note": ai_result["advisorNote"],
        "calculated_at": calc_time
    }))

    duration_ms = int((time.time() - start_time) * 1000)

    logger.info("health_score_calculated",
                user_id=body.user_id,
                claude_used=not ai_result["is_fallback"],
                fallback_used=ai_result["is_fallback"],
                overall_score=ai_result["overall"],
                response_time_ms=duration_ms)

    return HealthScoreResponse(
        score_id=score_id,
        scores=ai_result["scores"],
        overall=ai_result["overall"],
        insights=ai_result["insights"],
        topPriority=ai_result["topPriority"],
        advisorNote=ai_result["advisorNote"],
        calculated_at=calc_time
    )

