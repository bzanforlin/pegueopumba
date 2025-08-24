import json
import logging

import requests

from backend.app.config import (
    WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_BUSINESS_ACCOUNT_ID,
    WHATSAPP_PHONE_NUMBER_ID,
)

logger = logging.getLogger(__name__)


class WhatsAppService:
    def __init__(self):
        self.access_token = WHATSAPP_ACCESS_TOKEN
        self.phone_number_id = WHATSAPP_PHONE_NUMBER_ID
        self.business_account_id = WHATSAPP_BUSINESS_ACCOUNT_ID
        self.api_url = (
            f"https://graph.facebook.com/v18.0/{self.phone_number_id}/messages"
        )

        if self.access_token and self.phone_number_id:
            logger.info("WhatsApp Business API service initialized successfully")
        else:
            logger.warning("WhatsApp service not initialized - missing credentials")

    def send_message(self, to_number: str, message: str) -> bool:
        """
        Send a WhatsApp message to a phone number using WhatsApp Business API.

        Args:
            to_number (str): Phone number in international format (e.g., +5511999999999)
            message (str): Message content to send

        Returns:
            bool: True if message was sent successfully, False otherwise
        """
        if not self.access_token or not self.phone_number_id:
            logger.warning("WhatsApp service not available - skipping message")
            return False

        try:
            # Clean phone number (remove any non-digit characters except +)
            clean_number = to_number.strip()
            if clean_number.startswith("+"):
                clean_number = clean_number[1:]  # Remove + sign for API

            # Prepare the message payload
            payload = {
                "messaging_product": "whatsapp",
                "to": clean_number,
                "type": "text",
                "text": {"body": message},
            }

            # Prepare headers
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json",
            }

            # Send the message
            response = requests.post(
                self.api_url, headers=headers, data=json.dumps(payload), timeout=30
            )

            if response.status_code == 200:
                response_data = response.json()
                message_id = response_data.get("messages", [{}])[0].get("id", "unknown")
                logger.info(
                    f"WhatsApp message sent successfully to {to_number}. Message ID: {message_id}"
                )
                return True
            else:
                logger.error(
                    f"WhatsApp API error for {to_number}: {response.status_code} - {response.text}"
                )
                return False

        except requests.exceptions.RequestException as e:
            logger.error(f"Network error sending WhatsApp message to {to_number}: {e}")
            return False
        except Exception as e:
            logger.error(
                f"Unexpected error sending WhatsApp message to {to_number}: {e}"
            )
            return False

    def send_bulk_messages(self, phone_numbers: list[str], message: str) -> dict:
        """
        Send WhatsApp messages to multiple phone numbers using WhatsApp Business API.

        Args:
            phone_numbers (list[str]): List of phone numbers in international format
            message (str): Message content to send

        Returns:
            dict: Results with success/failure counts and details
        """
        results = {
            "total": len(phone_numbers),
            "success": 0,
            "failed": 0,
            "failed_numbers": [],
        }

        if not self.access_token or not self.phone_number_id:
            logger.warning("WhatsApp service not available - skipping all messages")
            results["failed"] = results["total"]
            results["failed_numbers"] = phone_numbers.copy()
            return results

        for phone_number in phone_numbers:
            if self.send_message(phone_number, message):
                results["success"] += 1
            else:
                results["failed"] += 1
                results["failed_numbers"].append(phone_number)

        logger.info(
            f"Bulk WhatsApp messaging completed: {results['success']} success, {results['failed']} failed"
        )
        return results


# Global instance
whatsapp_service = WhatsAppService()
