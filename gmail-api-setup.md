# Gmail API Setup Guide for Coach Zach Soccer Training Website

This guide will walk you through setting up Gmail API to handle contact form submissions.

## Prerequisites
- A Google account (Gmail)
- Access to Google Cloud Console

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top
3. Click "New Project"
4. Name it something like "Coach Zach Soccer Training"
5. Click "Create"

## Step 2: Enable Gmail API

1. In your new project, go to "APIs & Services" > "Library"
2. Search for "Gmail API"
3. Click on "Gmail API"
4. Click "Enable"

## Step 3: Create Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Name it "coach-zach-email"
4. Description: "Service account for sending emails from contact form"
5. Click "Create and Continue"
6. For "Grant this service account access to project":
   - Role: "Gmail API" > "Gmail API Admin"
7. Click "Continue"
8. Click "Done"

## Step 4: Create and Download Service Account Key

1. In the Service Accounts list, click on your new service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON"
5. Click "Create"
6. The JSON file will download automatically

## Step 5: Configure Environment Variables

1. Open the downloaded JSON file
2. Copy the values to your `.env` file:

```env
GOOGLE_PROJECT_ID=your-project-id-from-json
GOOGLE_PRIVATE_KEY_ID=private_key_id-from-json
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-private-key-from-json\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=client_email-from-json
GOOGLE_CLIENT_ID=client_id-from-json
GOOGLE_CLIENT_X509_CERT_URL=client_x509_cert_url-from-json
```

**Important:** Make sure to:
- Keep the quotes around the `GOOGLE_PRIVATE_KEY`
- Replace `\n` with actual newlines in the private key
- The private key should be the entire key including the BEGIN and END lines

## Step 6: Share Gmail with Service Account

1. Open your Gmail account
2. Go to Settings > Accounts and Import
3. In "Grant access to your account", click "Add another account"
4. Enter the service account email (from `GOOGLE_CLIENT_EMAIL`)
5. Click "Next Step"
6. Grant the requested permissions

## Step 7: Test the Setup

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Fill out the contact form on your website
4. Check your Gmail for the inquiry email
5. Check the sender's email for the confirmation email

## Troubleshooting

### Common Issues:

1. **"Invalid Credentials" Error**
   - Make sure all environment variables are set correctly
   - Check that the private key is properly formatted with newlines
   - Verify the service account email is shared with your Gmail

2. **"Gmail API not enabled" Error**
   - Go back to Google Cloud Console
   - Make sure Gmail API is enabled in your project

3. **"Insufficient permissions" Error**
   - Check that the service account has the correct role
   - Verify that you've shared your Gmail with the service account

4. **"Quota exceeded" Error**
   - Gmail API has daily quotas
   - Check your usage in Google Cloud Console
   - Consider upgrading to a paid plan if needed

### Security Best Practices:

1. **Never commit your `.env` file to Git**
   - It's already in `.gitignore`
   - Keep your service account keys secure

2. **Rotate keys regularly**
   - Delete old service account keys
   - Create new ones periodically

3. **Monitor usage**
   - Check Google Cloud Console for API usage
   - Set up alerts for unusual activity

## Production Deployment

When deploying to Vercel:

1. Add all environment variables in Vercel dashboard
2. Make sure to include the quotes around `GOOGLE_PRIVATE_KEY`
3. Test the form after deployment

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check Vercel function logs
3. Verify all environment variables are set correctly
4. Test with a simple email first

## Next Steps

Once Gmail API is working:
1. Consider setting up email templates
2. Add email tracking/analytics
3. Implement spam protection
4. Set up email notifications for high-priority inquiries 