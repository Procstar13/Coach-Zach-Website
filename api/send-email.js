import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Add debugging
    console.log('API endpoint called');
    console.log('Method:', req.method);
    console.log('API Key present:', !!process.env.RESEND_API_KEY);
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        console.log('Method not allowed');
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        console.log('Request body:', req.body);
        
        // Handle both contact form and booking form field names
        const { 
            name, 
            email, 
            playerName, 
            playerAge, 
            message,
            // Booking form fields
            parentName,
            parentEmail,
            sessionType,
            date,
            time,
            location,
            goals
        } = req.body;

        // Use booking form fields if available, otherwise use contact form fields
        const parentNameFinal = parentName || name;
        const parentEmailFinal = parentEmail || email;
        const messageFinal = goals || message;

        console.log('Processed data:', {
            parentNameFinal,
            parentEmailFinal,
            playerName,
            playerAge,
            sessionType
        });

        // Basic validation
        if (!parentNameFinal || !parentEmailFinal || !playerName || !playerAge) {
            console.log('Validation failed - missing required fields');
            return res.status(400).json({ message: 'Missing required fields' });
        }

        console.log('Validation passed, sending email...');

        // Email content for Coach Zach
        const coachEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #16a34a;">New Soccer Training Inquiry</h2>
                
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
                    <p><strong>Parent Name:</strong> ${parentNameFinal}</p>
                    <p><strong>Email:</strong> ${parentEmailFinal}</p>
                    <p><strong>Player Name:</strong> ${playerName}</p>
                    <p><strong>Player Age:</strong> ${playerAge}</p>
                </div>
                
                ${sessionType ? `
                    <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #374151; margin-top: 0;">Session Details</h3>
                        <p><strong>Session Type:</strong> ${sessionType}</p>
                        ${date ? `<p><strong>Preferred Date:</strong> ${date}</p>` : ''}
                        ${time ? `<p><strong>Preferred Time:</strong> ${time}</p>` : ''}
                        ${location ? `<p><strong>Preferred Location:</strong> ${location}</p>` : ''}
                    </div>
                ` : ''}
                
                ${messageFinal ? `
                    <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #374151; margin-top: 0;">Message / Goals</h3>
                        <p style="white-space: pre-wrap;">${messageFinal}</p>
                    </div>
                ` : ''}
                
                <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #1e40af;">
                        <strong>Service Areas:</strong> Gilbert, Queen Creek, Chandler, Arizona<br>
                        <strong>Age Range:</strong> 5-17 years old
                    </p>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                <p style="color: #6b7280; font-size: 14px;">
                    This inquiry was submitted from your soccer training website.<br>
                    Time: ${new Date().toISOString()}
                </p>
            </div>
        `;

        // Send email to Coach Zach
        console.log('Sending email to Coach Zach...');
        const coachEmailResult = await resend.emails.send({
            from: 'Coach Zach <noreply@resend.dev>',
            to: 'ztproctor@gmail.com',
            subject: sessionType ? `New Soccer Training Booking from ${parentNameFinal}` : `New Soccer Training Inquiry from ${parentNameFinal}`,
            html: coachEmailHtml
        });
        console.log('Coach email result:', coachEmailResult);

        // Confirmation email content for parent
        const confirmationEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #16a34a;">${sessionType ? 'Thank you for your booking inquiry!' : 'Thank you for your inquiry!'}</h2>
                
                <p>Hi ${parentNameFinal},</p>
                
                <p>Thank you for reaching out about soccer training for ${playerName}. I've received your ${sessionType ? 'booking inquiry' : 'inquiry'} and will get back to you within 24 hours with more information about training programs and availability.</p>
                
                <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #374151; margin-top: 0;">What to expect next:</h3>
                    <ul style="color: #374151;">
                        <li>Detailed information about training programs</li>
                        <li>Pricing and scheduling options</li>
                        <li>Available time slots in your area</li>
                        <li>Next steps to get started</li>
                    </ul>
                </div>
                
                <p>If you have any urgent questions, feel free to call me directly at <strong>(480) 238-0040</strong>.</p>
                
                <p>Best regards,<br>
                <strong>Coach Zach</strong></p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                <p style="color: #6b7280; font-size: 14px;">
                    Coach Zach Soccer Training<br>
                    Gilbert, Queen Creek, Chandler, Arizona<br>
                    Phone: (480) 238-0040
                </p>
            </div>
        `;

        // Send confirmation email to parent
        console.log('Sending confirmation email to parent...');
        const confirmationEmailResult = await resend.emails.send({
            from: 'Coach Zach <noreply@resend.dev>',
            to: parentEmailFinal,
            subject: sessionType ? 'Thank you for your soccer training booking inquiry' : 'Thank you for your soccer training inquiry',
            html: confirmationEmailHtml
        });
        console.log('Confirmation email result:', confirmationEmailResult);

        console.log('All emails sent successfully');
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 