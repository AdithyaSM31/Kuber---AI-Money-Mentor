from pydantic import BaseModel, Field, model_validator
from typing import Literal

class HealthScoreRequest(BaseModel):
    user_id: str
    name: str
    age: int = Field(ge=18, le=80)
    monthly_income: float = Field(gt=0)
    monthly_expenses: float
    emergency_fund_months: float = Field(ge=0)
    has_term_insurance: bool
    has_health_insurance: bool
    monthly_sip: float
    has_loans: bool
    monthly_emi: float
    tax_regime: Literal["old", "new", "unsure"]
    risk_appetite: Literal["conservative", "moderate", "aggressive"]

    @model_validator(mode="after")
    def validate_logic(self):
        if not self.has_loans and self.monthly_emi != 0:
            raise ValueError("monthly_emi must be 0 if has_loans is false")
        # Note: We do not reject if expenses > income; it is treated as a warning for AI
        return self

