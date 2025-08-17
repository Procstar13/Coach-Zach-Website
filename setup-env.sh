#!/bin/bash

# Coach Zach Soccer Training Website - Environment Setup Script
echo "🔧 Setting up environment variables for Coach Zach Soccer Training Website"
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    echo "   Current .env file will be backed up to .env.backup"
    cp .env .env.backup
fi

# Create .env file
echo "📝 Creating .env file..."
cat > .env << 'EOF'
# Coach Zach Soccer Training Website - Environment Variables
# Generated on $(date)

# Resend API Configuration (for email functionality)
# Get your API key from: https://resend.com/api-keys
RESEND_API_KEY=your_resend_api_key_here

# Example: RESEND_API_KEY=re_1234567890abcdef...

# Optional: Custom domain for sending emails
# RESEND_DOMAIN=coachzachsoccer.com

# Twilio Configuration (for chat functionality)
# Get these from your Twilio Console: https://console.twilio.com/
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
COACH_ZACH_PHONE=your_personal_phone_number_here

# Example: TWILIO_ACCOUNT_SID=AC1234567890abcdef...
# Example: TWILIO_AUTH_TOKEN=1234567890abcdef...
# Example: TWILIO_PHONE_NUMBER=+1234567890
# Example: COACH_ZACH_PHONE=+1234567890

# Supabase Configuration (for CRM functionality)
# Get these from your Supabase project settings
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Development settings (optional)
# NODE_ENV=development
# PORT=3000
EOF

echo "✅ .env file created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Open the .env file in your editor"
echo "2. Replace the placeholder values with your actual credentials"
echo "3. Save the file"
echo ""
echo "🔑 To get your Resend API Key:"
echo "   1. Go to https://resend.com"
echo "   2. Sign up for a free account"
echo "   3. Go to API Keys in your dashboard"
echo "   4. Create a new API key"
echo "   5. Copy the key (starts with 're_')"
echo ""
echo "📱 To get your Twilio credentials:"
echo "   1. Go to https://console.twilio.com/"
echo "   2. Sign in to your Twilio account"
echo "   3. Copy your Account SID and Auth Token from the dashboard"
echo "   4. Go to Phone Numbers > Manage > Active numbers"
echo "   5. Copy your Twilio phone number"
echo "   6. Add your personal phone number for receiving SMS"
echo ""
echo "⚠️  Important Notes:"
echo "   - Resend offers 100 emails/day free"
echo "   - Twilio charges per SMS sent (~$0.0079 per message in US)"
echo "   - The .env file is automatically ignored by Git"
echo "   - Your credentials will never be committed to the repository"
echo ""
echo "🗄️  To get your Supabase credentials:"
echo "   - Go to https://supabase.com"
echo "   - Create a new project"
echo "   - Go to Settings > API"
echo "   - Copy the Project URL and anon key" 