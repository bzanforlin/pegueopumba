from fastmcp import FastMCP

from backend.app.database import supabase_client
from backend.app.whatsapp_service import whatsapp_service

mcp = FastMCP("Analytics Tools")
mcp_app = mcp.http_app(path="/mcp")


@mcp.tool(
    description="""
    Creates an occurrence in the database, retrieves phone numbers of nearby users, and sends WhatsApp alerts.

    This function performs the following steps:
      1. Calls the `create_occurrence` RPC function in Supabase to store an occurrence
         with the given latitude, longitude, reporting phone number.
      2. Calls the `find_users_within_10km` RPC function to retrieve user IDs located
         within 10 km of the given coordinates.
      3. Queries the `users` table to fetch phone numbers of the affected users.
      4. Sends WhatsApp alert messages to all affected users' phone numbers.

    Args:
        latitud (str): Latitude coordinate of the occurrence.
        longitud (str): Longitude coordinate of the occurrence.
        phone_number (str): Phone number of the user reporting the occurrence.

    Returns:
        dict: A dictionary containing:
            - "message" (str): Confirmation message ("Occurrence created").
            - "affected_phone_numbers" (list[str]): List of phone numbers of users 
              within 10 km of the occurrence location.
            - "whatsapp_notifications" (dict): Results of WhatsApp messaging with
              success/failure counts and details.
    """
)
def create_occurrence(latitud: str, longitud: str, phone_number: str):
    supabase_client.rpc(
        "create_occurrence",
        {
            "p_phone_number": phone_number,
            "p_lat": str(latitud),
            "p_lng": str(longitud),
        },
    ).execute()

    result = supabase_client.rpc(
        "find_users_within_10km",
        {"lat": str(latitud), "lng": str(longitud)},
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

    # Send WhatsApp messages to affected users
    whatsapp_results = {"total": 0, "success": 0, "failed": 0, "failed_numbers": []}
    if phone_numbers:
        alert_message = (
            "🐗 ALERTA DE JAVALI! 🐗\n\n"
            "Uma ocorrência de javali foi reportada próximo à sua localização. "
            "Mantenha-se atento e tome as devidas precauções.\n\n"
            f"Coordenadas: {latitud}, {longitud}\n\n"
            "Para mais informações, acesse nosso sistema."
        )

        whatsapp_results = whatsapp_service.send_bulk_messages(
            phone_numbers, alert_message
        )

    return {
        "message": "Occurrence created",
        "affected_phone_numbers": phone_numbers,
        "whatsapp_notifications": whatsapp_results,
    }
