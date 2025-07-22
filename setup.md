# Email Setup Guide for Coach Zach Soccer Training

## Quick Setup (5 minutes)

### 1. Get Resend API Key
1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Copy your API key from dashboard

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy your site
vercel

# Follow the prompts:
# - Project name: coach-zach-soccer
# - Directory: ./ (current directory)
# - Override settings: No
```

### 3. Add Environment Variable
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to Settings → Environment Variables
4. Add: `RESEND_API_KEY` = your Resend API key
5. Redeploy: `vercel --prod`

### 4. Test the Form
1. Visit your deployed site
2. Fill out the contact form
3. Check your email for the inquiry
4. Check the parent's email for the auto-reply

## What You Get

### Email to You (Coach Zach)
- Professional HTML email with all form data
- Contact information clearly formatted
- Player details and goals
- Service area information

### Auto-Reply to Parent
- Thank you message with next steps
- Professional branding
- Contact information
- What to expect timeline

## Customization

### Update Email Templates
Edit `api/send-email.js` to customize:
- Email subject lines
- HTML email design
- Contact information
- Branding colors

### Add Domain Verification
1. Add your domain to Resend
2. Update `from` email in the API file
3. Use: `Coach Zach <noreply@yourdomain.com>`

## Troubleshooting

### Common Issues:
- **"Failed to send email"**: Check RESEND_API_KEY is set correctly
- **"Method not allowed"**: Make sure you're using POST method
- **"Invalid email"**: Check email format validation

### Support:
- Resend docs: [resend.com/docs](https://resend.com/docs)
- Vercel docs: [vercel.com/docs](https://vercel.com/docs)

## Cost
- **Resend**: 100 emails/day free, then $0.80/1000 emails
- **Vercel**: Free tier includes 100GB bandwidth/month
- **Total**: $0 for typical usage!

---

**Ready to go live!** Your contact form will now send professional emails to both you and your potential clients. 