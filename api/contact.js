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
    if (!name || !email || !playerName || !playerAge) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email to Coach Zach
    await resend.emails.send({
      from: 'Coach Zach <noreply@resend.dev>',
      to: 'ztproctor@gmail.com',
      subject: `New Soccer Training Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">New Soccer Training Inquiry</h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
            <p><strong>Parent Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
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
            This inquiry was submitted from your soccer training website.<br>
            Time: ${new Date().toISOString()}
          </p>
        </div>
      `
    });

    // Send confirmation email to parent
    await resend.emails.send({
      from: 'Coach Zach <noreply@resend.dev>',
      to: email,
      subject: 'Thank you for your soccer training inquiry',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Thank you for your inquiry!</h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for reaching out about soccer training for ${playerName}. I've received your inquiry and will get back to you within 24 hours with more information about training programs and availability.</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">What to expect next:</h3>
            <ul style="color: #374151;">
              <li>Detailed information about training programs</li>
              <li>Pricing and scheduling options</li>
              <li>Available time slots in your area</li>
              <li>Next steps to get started</li>
            </ul>
          </div>
          
          
          
          <p>Best regards,<br>
          <strong>Coach Zach</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Coach Zach Soccer Training<br>
            Gilbert, Queen Creek, Chandler, Arizona<br>
            Phone: (480) 238-0040
          </p>
        </div>
      `
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}