from pydantic import BaseModel, Field
from typing import List


class OccurrenceResponse(BaseModel):
    id: str = Field(..., description="Unique identifier for the occurrence (UUID)")
    lat: float = Field(..., description="Latitude coordinate")
    lng: float = Field(..., description="Longitude coordinate")
    date: str = Field(..., description="Date when the occurrence was reported")


class OccurrencesListResponse(BaseModel):
    occurrences: List[OccurrenceResponse] = Field(..., description="List of all occurrences")
    total_count: int = Field(..., description="Total number of occurrences") 