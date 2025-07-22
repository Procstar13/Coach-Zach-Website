import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Mock availability data - in production, this would come from a database
const availableSlots = {
  'monday': ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
  'tuesday': ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
  'wednesday': ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
  'thursday': ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
  'friday': ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
  'saturday': ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'],
  'sunday': ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00']
};

const sessionTypes = {
  '1on1': { name: '1-on-1 Training', duration: 60, price: 75 },
  'group': { name: 'Small Group Training', duration: 90, price: 50 },
  'assessment': { name: 'Skill Assessment', duration: 45, price: 60 }
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get available slots
    const { day } = req.query;
    
    if (!day || !availableSlots[day.toLowerCase()]) {
      return res.status(400).json({ message: 'Invalid day' });
    }
    
    return res.status(200).json({
      slots: availableSlots[day.toLowerCase()],
      sessionTypes
    });
  }
  
  if (req.method === 'POST') {
    // Book a session
    try {
      const { 
        parentName, 
        parentEmail, 
        playerName, 
        playerAge, 
        sessionType, 
        date, 
        time, 
        location,
        goals 
      } = req.body;

      // Validation
      if (!parentName || !parentEmail || !playerName || !playerAge || !sessionType || !date || !time) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(parentEmail)) {
        return res.status(400).json({ message: 'Invalid email address' });
      }

      // Age validation
      const age = parseInt(playerAge);
      if (age < 5 || age > 17) {
        return res.status(400).json({ message: 'Player age must be between 5 and 17' });
      }

      // Check if slot is available
      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
      if (!availableSlots[dayOfWeek] || !availableSlots[dayOfWeek].includes(time)) {
        return res.status(400).json({ message: 'Selected time slot is not available' });
      }

      const session = sessionTypes[sessionType];
      if (!session) {
        return res.status(400).json({ message: 'Invalid session type' });
      }

      // Format date for display
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Send confirmation email to Coach Zach
      await resend.emails.send({
        from: 'Coach Zach <noreply@coachzachsoccer.com>',
        to: ['ztproctor@gmail.com'],
        subject: `New Session Booking: ${playerName} - ${formattedDate}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">New Session Booking</h2>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Session Details</h3>
              <p><strong>Session Type:</strong> ${session.name}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Duration:</strong> ${session.duration} minutes</p>
              <p><strong>Location:</strong> ${location || 'TBD'}</p>
              <p><strong>Price:</strong> $${session.price}</p>
            </div>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Player Information</h3>
              <p><strong>Player Name:</strong> ${playerName}</p>
              <p><strong>Player Age:</strong> ${playerAge}</p>
              <p><strong>Parent Name:</strong> ${parentName}</p>
              <p><strong>Parent Email:</strong> ${parentEmail}</p>
            </div>
            
            ${goals ? `
              <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Training Goals</h3>
                <p style="white-space: pre-wrap;">${goals}</p>
              </div>
            ` : ''}
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                <strong>Action Required:</strong> Please confirm this booking and provide location details.
              </p>
            </div>
          </div>
        `,
      });

      // Send confirmation email to parent
      await resend.emails.send({
        from: 'Coach Zach <noreply@coachzachsoccer.com>',
        to: [parentEmail],
        subject: `Session Booking Confirmation - ${formattedDate}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Session Booking Confirmation</h2>
            
            <p>Hi ${parentName},</p>
            
            <p>Thank you for booking a soccer training session with Coach Zach! Here are your session details:</p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Session Details</h3>
              <p><strong>Session Type:</strong> ${session.name}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Duration:</strong> ${session.duration} minutes</p>
              <p><strong>Price:</strong> $${session.price}</p>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">What to Expect</h3>
              <ul style="color: #92400e;">
                <li>Coach Zach will contact you within 24 hours to confirm location</li>
                <li>Please arrive 5 minutes early</li>
                <li>Bring water, soccer ball, and appropriate athletic wear</li>
                <li>Payment will be collected at the session</li>
              </ul>
            </div>
            
            <p>If you need to reschedule or have any questions, please call Coach Zach at <strong>(480) 238-0040</strong>.</p>
            
            <p>Looking forward to working with ${playerName}!</p>
            
            <p>Best regards,<br>
            <strong>Coach Zach</strong></p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              Coach Zach Soccer Training<br>
              Gilbert, Queen Creek, Chandler, Arizona<br>
              Phone: (480) 238-0040
            </p>
          </div>
        `,
      });

      // In production, you would save this booking to a database
      // For now, we'll just return success
      
      res.status(200).json({ 
        message: 'Session booked successfully',
        bookingId: `BK${Date.now()}`,
        session: {
          type: session.name,
          date: formattedDate,
          time: time,
          duration: session.duration,
          price: session.price
        }
      });

    } catch (error) {
      console.error('Booking error:', error);
      res.status(500).json({ message: 'Failed to book session' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
} 