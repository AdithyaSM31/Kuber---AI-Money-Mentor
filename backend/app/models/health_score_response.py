from pydantic import BaseModel
from typing import List, Literal

class ScoreDimensions(BaseModel):
    emergency: int
    insurance: int
    diversification: int
    debtHealth: int
    taxEfficiency: int
    retirement: int

class Insight(BaseModel):
    type: Literal["warning", "tip", "positive"]
    text: str

class HealthScoreResponse(BaseModel):
    score_id: str
    scores: ScoreDimensions
    overall: int
    insights: List[Insight]
    topPriority: str
    advisorNote: str
    calculated_at: str

