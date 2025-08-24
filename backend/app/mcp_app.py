from backend.app.database import supabase_client
from backend.app.schemas.create_occurence_request import CreateOccurenceRequest
from fastmcp import FastMCP

mcp = FastMCP("Analytics Tools")
mcp_app = mcp.http_app(path="/mcp")


@mcp.tool()
def create_occurrence(request: CreateOccurenceRequest):
    supabase_client.rpc(
        "create_occurrence",
        {
            "p_phone_number": request.phone_number,
            "p_lat": str(request.location.latitude),
            "p_lng": str(request.location.longitude),
            "p_chat": request.payload if hasattr(request, "payload") else None,
        },
    ).execute()

    result = supabase_client.rpc(
        "find_users_within_10km",
        {"lat": str(request.location.latitude), "lng": str(request.location.longitude)},
    ).execute()

    affected_user_ids = [row["user_id"] for row in result.data] if result.data else []

    phone_numbers = []
    if affected_user_ids:
        users_result = (
            supabase_client.table("users")
            .select("phone_number")
            .in_("id", affected_user_ids)
            .execute()
        )

        phone_numbers = [
            u["phone_number"] for u in users_result.data if u.get("phone_number")
        ]

    return {"message": "Occurrence created", "affected_phone_numbers": phone_numbers}
