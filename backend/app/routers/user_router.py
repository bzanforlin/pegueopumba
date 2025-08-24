from fastapi import APIRouter

from ..database import supabase_client
from ..schemas.create_user_request import CreateUserRequest

router = APIRouter(prefix="/users", tags=["Users"])


@router.post(
    "/",
    operation_id="create_user",
    summary="Create a user",
    description="Create a user with phone number and register provided points of interest.",
)
def create_user(request: CreateUserRequest):
    response = (
        supabase_client.table("users")
        .insert({"phone_number": request.phone_number})
        .execute()
    )

    created_user_id = response.data[0]["id"]

    for poi in request.points_of_interest:
        supabase_client.rpc(
            "create_point_of_interest",
            {"p_user_id": created_user_id, "p_lat": poi.latitud, "p_lng": poi.longitud},
        ).execute()

    return {
        "message": "User and points of interest created",
        "user_id": created_user_id,
    }
