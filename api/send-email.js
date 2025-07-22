import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Security: Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Security: Input sanitization
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .substring(0, 1000); // Limit length
}

// Security: Rate limiting check
function checkRateLimit(identifier) {
    const now = Date.now();
    const requests = rateLimitStore.get(identifier) || [];
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
    
    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }
    
    // Add current request
    recentRequests.push(now);
    rateLimitStore.set(identifier, recentRequests);
    return true;
}

// Security: Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

// Security: Validate name format
function isValidName(name) {
    const nameRegex = /^[A-Za-z\s]{2,100}$/;
    return nameRegex.test(name);
}

// Security: Validate age
function isValidAge(age) {
    const ageNum = parseInt(age);
    return ageNum >= 5 && ageNum <= 17;
}

export default async function handler(req, res) {
    // Security: Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Security: Check content type
    if (req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ message: 'Invalid content type' });
    }

    try {
        const { name, email, playerName, playerAge, message, website, timestamp, token } = req.body;

        // Security: Check honeypot field
        if (website && website.trim() !== '') {
            console.log('Bot detected via honeypot field');
            return res.status(400).json({ message: 'Invalid submission' });
        }

        // Security: Rate limiting by IP and email
        const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const rateLimitKey = `${clientIP}-${email}`;
        
        if (!checkRateLimit(rateLimitKey)) {
            return res.status(429).json({ message: 'Too many requests. Please try again later.' });
        }

        // Security: Input sanitization
        const sanitizedName = sanitizeInput(name);
        const sanitizedEmail = email.toLowerCase().trim();
        const sanitizedPlayerName = sanitizeInput(playerName);
        const sanitizedMessage = sanitizeInput(message);

        // Security: Enhanced validation
        if (!sanitizedName || !sanitizedEmail || !sanitizedPlayerName || !playerAge) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (!isValidEmail(sanitizedEmail)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        if (!isValidName(sanitizedName)) {
            return res.status(400).json({ message: 'Invalid name format' });
        }

        if (!isValidName(sanitizedPlayerName)) {
            return res.status(400).json({ message: 'Invalid player name format' });
        }

        if (!isValidAge(playerAge)) {
            return res.status(400).json({ message: 'Player age must be between 5 and 17' });
        }

        // Security: Check for suspicious patterns
        const suspiciousPatterns = [
            /viagra/i, /casino/i, /loan/i, /credit/i, /buy.*now/i,
            /click.*here/i, /free.*money/i, /make.*money/i
        ];

        const allText = `${sanitizedName} ${sanitizedPlayerName} ${sanitizedMessage}`.toLowerCase();
        for (const pattern of suspiciousPatterns) {
            if (pattern.test(allText)) {
                console.log('Suspicious content detected:', pattern);
                return res.status(400).json({ message: 'Invalid content detected' });
            }
        }

        // Security: Check timestamp (prevent replay attacks)
        const currentTime = Date.now();
        const requestTime = parseInt(timestamp);
        if (isNaN(requestTime) || Math.abs(currentTime - requestTime) > 300000) { // 5 minutes
            return res.status(400).json({ message: 'Invalid request timestamp' });
        }

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'Coach Zach <noreply@coachzachsoccer.com>',
            to: ['ztproctor@gmail.com'],
            subject: `New Soccer Training Inquiry from ${sanitizedName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #16a34a;">New Soccer Training Inquiry</h2>
                    
                    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
                        <p><strong>Parent Name:</strong> ${sanitizedName}</p>
                        <p><strong>Email:</strong> ${sanitizedEmail}</p>
                        <p><strong>Player Name:</strong> ${sanitizedPlayerName}</p>
                        <p><strong>Player Age:</strong> ${playerAge}</p>
                    </div>
                    
                    ${sanitizedMessage ? `
                        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #374151; margin-top: 0;">Message / Goals</h3>
                            <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
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
                        IP: ${clientIP} | Time: ${new Date().toISOString()}
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return res.status(500).json({ message: 'Failed to send email' });
        }

        // Send confirmation email to parent
        await resend.emails.send({
            from: 'Coach Zach <noreply@coachzachsoccer.com>',
            to: [sanitizedEmail],
            subject: 'Thank you for your soccer training inquiry',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #16a34a;">Thank you for your inquiry!</h2>
                    
                    <p>Hi ${sanitizedName},</p>
                    
                    <p>Thank you for reaching out about soccer training for ${sanitizedPlayerName}. I've received your inquiry and will get back to you within 24 hours with more information about training programs and availability.</p>
                    
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
            `,
        });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 