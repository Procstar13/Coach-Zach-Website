# Security Implementation Guide

## Overview

This website implements multiple layers of security to protect against common threats and spam attacks.

## Security Features Implemented

### 🔒 Form Protection (Anti-Spam)

#### Honeypot Field
- **Hidden field** that bots fill out but humans don't see
- **Detection**: If honeypot field is filled, submission is rejected
- **Implementation**: CSS `display: none` with `tabindex="-1"`

#### Rate Limiting
- **Client-side**: 3 submissions per minute per email
- **Server-side**: 5 requests per minute per IP+email combination
- **Protection**: Prevents rapid-fire spam submissions

#### Input Validation & Sanitization
- **Name validation**: Letters and spaces only, 2-100 characters
- **Email validation**: Standard email format, max 254 characters
- **Age validation**: Numbers only, 3-99 range (all ages welcome)
- **Message sanitization**: Removes HTML tags, limits to 1000 characters

#### Suspicious Content Detection
- **Pattern matching**: Detects common spam keywords
- **Blocked patterns**: viagra, casino, loan, credit, "buy now", etc.
- **Action**: Rejects submissions with suspicious content

### 🛡️ API Security

#### Request Validation
- **Method restriction**: Only POST requests allowed
- **Content type**: Must be `application/json`
- **Timestamp validation**: Prevents replay attacks (5-minute window)

#### Input Sanitization
- **HTML tag removal**: Strips `<` and `>` characters
- **Length limits**: Prevents oversized payloads
- **Type checking**: Validates data types

#### Rate Limiting
- **IP-based**: Tracks requests by IP address
- **Email-based**: Additional tracking by email address
- **Window**: 1-minute sliding window
- **Limit**: 5 requests per window

### 🔐 Security Headers

#### Content Security Policy (CSP)
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://assets.calendly.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://api.resend.com https://calendly.com;
frame-src https://calendly.com;
```

#### Other Security Headers
- **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
- **X-Frame-Options**: `DENY` - Prevents clickjacking
- **X-XSS-Protection**: `1; mode=block` - XSS protection
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: Blocks camera, microphone, geolocation

## Monitoring & Logging

### Server-Side Logging
- **Bot detection**: Logs honeypot field submissions
- **Rate limiting**: Logs when limits are exceeded
- **Suspicious content**: Logs detected spam patterns
- **IP tracking**: Includes client IP in email notifications

### Error Handling
- **Generic messages**: Don't reveal internal details
- **Rate limit responses**: Clear but not revealing
- **Validation errors**: Specific but safe error messages

## Additional Recommendations

### For Production Deployment

#### 1. Domain Verification
- **Resend domain**: Verify your domain with Resend
- **Custom from address**: Use `noreply@yourdomain.com`
- **SPF/DKIM**: Set up email authentication

#### 2. Monitoring
- **Email alerts**: Set up alerts for unusual activity
- **Log monitoring**: Monitor API logs for patterns
- **Rate limit alerts**: Get notified of rate limit hits

#### 3. Advanced Protection (Optional)
- **reCAPTCHA**: Add Google reCAPTCHA for additional protection
- **Akismet**: Integrate spam detection service
- **IP blocking**: Block known malicious IP ranges

### For Ongoing Maintenance

#### 1. Regular Updates
- **Dependencies**: Keep npm packages updated
- **Security patches**: Monitor for security advisories
- **Rate limits**: Adjust based on legitimate traffic

#### 2. Monitoring
- **Email volume**: Monitor for unusual spikes
- **Form submissions**: Track legitimate vs spam ratio
- **Error rates**: Monitor for technical issues

#### 3. Backup & Recovery
- **Email backups**: Ensure email delivery reliability
- **Form data**: Consider backing up legitimate submissions
- **Configuration**: Document all security settings

## Testing Security

### Manual Testing
1. **Honeypot test**: Fill honeypot field, should be rejected
2. **Rate limit test**: Submit multiple forms quickly
3. **Input validation**: Try invalid names, emails, ages
4. **Suspicious content**: Test with spam keywords

### Automated Testing
```bash
# Test rate limiting
curl -X POST https://yourdomain.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","playerName":"Test","playerAge":"10"}'

# Test honeypot
curl -X POST https://yourdomain.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","playerName":"Test","playerAge":"10","website":"spam"}'
```

## Security Checklist

- ✅ Honeypot field implemented
- ✅ Rate limiting (client + server)
- ✅ Input validation & sanitization
- ✅ Suspicious content detection
- ✅ Security headers configured
- ✅ Error handling implemented
- ✅ Logging & monitoring
- ✅ HTTPS enforcement
- ✅ Content Security Policy
- ✅ XSS protection
- ✅ Clickjacking protection

## Emergency Contacts

If you detect security issues:
1. **Immediate**: Check Vercel logs for unusual activity
2. **Email spam**: Review Resend dashboard for abuse
3. **Rate limiting**: Adjust limits if legitimate traffic affected
4. **Suspicious activity**: Block IPs in Vercel dashboard

---

**Note**: This security implementation provides strong protection against common threats while maintaining a good user experience for legitimate visitors. 