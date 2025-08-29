import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      parentName, 
      playerAge, 
      inquiryType, 
      customerPhone,
      message
    } = req.body;

    // Validate required fields
    if (!parentName || !playerAge || !inquiryType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate a unique session ID
    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Format the SMS message in compliance format
    const smsText = `Hi ${parentName}, thanks for contacting Coach Zach.
You have consented to receive both marketing and non-marketing SMS messages.
Reply STOP to unsubscribe, HELP for help.

New Training Inquiry:
Name: ${parentName}
Phone: ${customerPhone || 'Not provided'}
Message: ${inquiryType} for ${parentName} (Age: ${playerAge})${message ? ` - ${message}` : ''}

Reply to this message to continue the conversation.`;

    // Send SMS to Coach Zach
    const smsResult = await client.messages.create({
      body: smsText,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.COACH_ZACH_PHONE
    });

    // If SMS fails, send email fallback
    if (!smsResult.sid) {
      throw new Error('Failed to send SMS');
    }

    // Create chat session for 2-way communication
    try {
      const sessionData = {
        sessionId,
        messages: [
          {
            id: 'welcome',
            from: 'coach',
            text: 'Hi 👋 I\'m Coach Zach. Before we connect, can you share a few quick details?',
            timestamp: new Date().toISOString()
          },
          {
            id: Date.now().toString(),
            from: 'customer',
            text: `Submitted: ${inquiryType} for ${parentName} (Age: ${playerAge})`,
            timestamp: new Date().toISOString()
          }
        ],
        customerPhone: customerPhone || null,
        lastActivity: new Date().toISOString()
      };

      // Store the chat session
      await fetch(`${req.headers.host ? `https://${req.headers.host}` : 'http://localhost:3000'}/api/chat-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData)
      });

    } catch (sessionError) {
      console.error('Failed to create chat session:', sessionError);
      // Continue even if session creation fails
    }

    res.status(200).json({ 
      success: true, 
      message: 'SMS sent successfully',
      sid: smsResult.sid,
      sessionId
    });

  } catch (error) {
    console.error('SMS sending error:', error);
    
    // Try email fallback
    try {
      const emailResult = await fetch('/api/send-email-fallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: req.body.parentName || 'Unknown',
          email: 'ztproctor@gmail.com',
          playerName: req.body.parentName || 'Unknown',
          playerAge: req.body.playerAge || 'Unknown',
          message: `SMS FAILED - Chat Lead:\n\n${JSON.stringify(req.body, null, 2)}`
        })
      });

      if (emailResult.ok) {
        res.status(200).json({ 
          success: true, 
          message: 'SMS failed, but email fallback sent successfully',
          fallback: 'email'
        });
      } else {
        throw new Error('Both SMS and email fallback failed');
      }
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      res.status(500).json({ 
        error: 'Failed to send message via SMS or email',
        details: error.message
      });
    }
  }
}
