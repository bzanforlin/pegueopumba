from pydantic import BaseModel, Field
from typing import Any, Dict

from backend.app.schemas.location import Location

class CreateOccurenceRequest(BaseModel):
    phone_number: str = Field(..., example="+5511999999999")
    location: Location
    payload: Dict[str, Any] = Field(..., example={"message": "Some data", "extra_info": 123})

