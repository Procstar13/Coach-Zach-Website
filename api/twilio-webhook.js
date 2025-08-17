import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  // Only allow POST requests from Twilio
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the incoming SMS data from Twilio
    const { From, Body, MessageSid } = req.body;

    // Validate that this is a valid Twilio request
    if (!From || !Body || !MessageSid) {
      return res.status(400).json({ error: 'Missing required SMS data' });
    }

    // Check if this message is from Coach Zach (your personal phone)
    const isFromCoach = From === process.env.COACH_ZACH_PHONE;

    if (isFromCoach) {
      // This is a reply from Coach Zach - we'll need to handle this differently
      // For now, we'll just acknowledge receipt
      console.log('Received reply from Coach Zach:', Body);
      
      // In a full implementation, you would:
      // 1. Find the active chat session
      // 2. Update the chat widget with the reply
      // 3. Send a confirmation to the customer
    }

    // Send TwiML response (required by Twilio)
    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(`
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Message>Message received! I'll get back to you soon.</Message>
      </Response>
    `);

  } catch (error) {
    console.error('Twilio webhook error:', error);
    
    // Send error response to Twilio
    res.setHeader('Content-Type', 'text/xml');
    res.status(500).send(`
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Message>Sorry, there was an error processing your message.</Message>
      </Response>
    `);
  }
}
