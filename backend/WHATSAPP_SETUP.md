# WhatsApp Business API Setup

This application uses the WhatsApp Business API to send alerts to users when wild boar occurrences are reported near their location.

## Required Environment Variables

Add the following variables to your `.env` file:

```bash
# WhatsApp Business API Configuration
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id_here
```

## How to Get These Credentials

1. **Create a Meta for Developers Account**
   - Go to https://developers.facebook.com/
   - Create an account or log in

2. **Create a WhatsApp Business App**
   - Go to https://developers.facebook.com/apps/
   - Click "Create App"
   - Select "Business" as the app type
   - Add WhatsApp Business API product to your app

3. **Get Your Credentials**
   - **Access Token**: In your app dashboard, go to WhatsApp > API Setup. Generate a temporary access token (valid for 24 hours) or create a permanent access token
   - **Phone Number ID**: Found in the same API Setup page under "Phone number ID"
   - **Business Account ID**: Found in your app settings or WhatsApp Business Account

4. **Configure Phone Number**
   - Verify your phone number in the WhatsApp Business API setup
   - Make sure it's approved for sending messages

## Testing

The application will automatically send WhatsApp messages when:
1. A wild boar occurrence is reported
2. Users are found within 10km of the occurrence location
3. Those users have valid phone numbers in the database

## Message Format

Users will receive messages in Portuguese with the following format:

```
🐗 ALERTA DE JAVALI! 🐗

Uma ocorrência de javali foi reportada próximo à sua localização. 
Mantenha-se atento e tome as devidas precauções.

Coordenadas: [latitude], [longitude]

Para mais informações, acesse nosso sistema.
```

## Important Notes

- Phone numbers in the database should be in international format (e.g., +5511999999999)
- The API will automatically clean and format phone numbers
- If WhatsApp credentials are missing, the system will continue working but skip message sending
- All messaging attempts are logged for debugging purposes

## Rate Limits

WhatsApp Business API has rate limits:
- 1000 business-initiated messages per day (for unverified business)
- Higher limits available for verified businesses
- No limit on user-initiated conversations

Make sure your usage complies with WhatsApp's policies and rate limits.
