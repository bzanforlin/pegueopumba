from pydantic import BaseModel, Field
from typing import List

from backend.app.schemas.location import Location

class CreateUserRequest(BaseModel):
    phone_number: str = Field(..., example="+5511999999999")
    points_of_interest: List[Location]

