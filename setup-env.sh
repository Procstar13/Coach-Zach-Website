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
echo "2. Replace 'your_resend_api_key_here' with your actual Resend API key"
echo "3. Save the file"
echo ""
echo "🔑 To get your Resend API Key:"
echo "   1. Go to https://resend.com"
echo "   2. Sign up for a free account"
echo "   3. Go to API Keys in your dashboard"
echo "   4. Create a new API key"
echo "   5. Copy the key (starts with 're_')"
echo ""
echo "⚠️  Important Notes:"
echo "   - Resend offers 100 emails/day free"
echo "   - You can verify your domain for custom from addresses"
echo "   - The API key starts with 're_'"
echo ""
echo "🗄️  To get your Supabase credentials:"
echo "   - Go to https://supabase.com"
echo "   - Create a new project"
echo "   - Go to Settings > API"
echo "   - Copy the Project URL and anon key"
echo ""
echo "🔒 Security note: The .env file is automatically ignored by Git"
echo "   Your credentials will never be committed to the repository" 