from pydantic import BaseModel, Field


class Location(BaseModel):
    latitud: str = Field(..., example="-23.5505")
    longitud: str = Field(..., example="-46.6333")
