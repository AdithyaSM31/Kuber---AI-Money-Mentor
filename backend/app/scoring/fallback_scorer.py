from app.models.health_score_request import HealthScoreRequest

def calculate_fallback_score(req: HealthScoreRequest) -> dict:
    # Emergency
    emergency = 0
    if req.emergency_fund_months >= 6: emergency = 100
    elif req.emergency_fund_months >= 3: emergency = 75
    elif req.emergency_fund_months >= 1: emergency = 40
    elif req.emergency_fund_months > 0: emergency = 15

    # Insurance
    insurance = 10
    if req.has_health_insurance and req.has_term_insurance:
        insurance = 100
    elif req.has_health_insurance:
        insurance = 40
    elif req.has_term_insurance:
        insurance = 50

    # Diversification
    sip_pct = (req.monthly_sip / req.monthly_income) * 100 if req.monthly_income else 0
    if sip_pct >= 20: diversification = 100
    elif sip_pct >= 10: diversification = 80
    elif sip_pct >= 5: diversification = 60
    elif sip_pct > 0: diversification = 30
    else: diversification = 10

    # Debt Health
    if not req.has_loans:
        debt = 100
    else:
        emi_pct = (req.monthly_emi / req.monthly_income) * 100 if req.monthly_income else 0
        if emi_pct < 20: debt = 80
        elif emi_pct < 30: debt = 60
        elif emi_pct < 40: debt = 35
        else: debt = 10

    # Tax
    tax = 30
    if req.tax_regime == "new": tax = 60
    elif req.tax_regime == "old": tax = 80

    # Retirement
    ret = 10
    if req.age < 30 and req.monthly_sip > 0: ret = 60
    elif req.age > 40 and req.monthly_sip == 0: ret = 10
    else: ret = 40

    overall = int((emergency*0.2) + (insurance*0.2) + (diversification*0.15) + (debt*0.2) + (tax*0.1) + (ret*0.15))

    return {
        "scores": {
            "emergency": emergency,
            "insurance": insurance,
            "diversification": diversification,
            "debtHealth": debt,
            "taxEfficiency": tax,
            "retirement": ret
        },
        "overall": overall,
        "insights": [
            {"type": "warning", "text": "Ensure you maintain 6 months of emergency funds in liquid assets."},
            {"type": "tip", "text": "Increasing your SIP to 20% of your income will maximize long-term wealth creation."},
            {"type": "positive", "text": "You have taken the first step towards automating your financial planning."}
        ],
        "topPriority": "Evaluate your emergency fund and automate a monthly SIP.",
        "advisorNote": f"Hi {req.name}, you have a solid starting point but building automated investments is key for financial independence."
    }

