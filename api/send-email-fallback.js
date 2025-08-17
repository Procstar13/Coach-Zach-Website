import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, playerName, playerAge, message } = req.body;

    // Validate required fields
    if (!name || !playerName || !playerAge) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email to Coach Zach about the failed SMS
    await resend.emails.send({
      from: 'Coach Zach <noreply@resend.dev>',
      to: 'ztproctor@gmail.com',
      subject: `SMS FAILED - New Soccer Training Lead from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">⚠️ SMS Failed - New Soccer Training Lead</h2>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="color: #374151; margin-top: 0;">SMS Delivery Failed</h3>
            <p>This lead was submitted via the chat widget, but the SMS failed to send. Please contact them directly.</p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Lead Information</h3>
            <p><strong>Parent Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email || 'Not provided'}</p>
            <p><strong>Player Name:</strong> ${playerName}</p>
            <p><strong>Player Age:</strong> ${playerAge}</p>
          </div>
          
          ${message ? `
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Message / Goals</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          ` : ''}
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            This lead was submitted from your soccer training website chat widget.<br>
            Time: ${new Date().toISOString()}<br>
            <strong>Action Required:</strong> Contact this lead directly since SMS failed.
          </p>
        </div>
      `
    });

    res.status(200).json({ success: true, message: 'Email fallback sent successfully' });
  } catch (error) {
    console.error('Email fallback error:', error);
    res.status(500).json({ error: 'Failed to send email fallback' });
  }
}
