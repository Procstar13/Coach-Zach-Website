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

# Gmail SMTP Configuration (for email functionality)
# Your Gmail address
GMAIL_USER=your_gmail_address@gmail.com

# Gmail App Password (NOT your regular Gmail password)
# Get this from: https://myaccount.google.com/apppasswords
GMAIL_APP_PASSWORD=your_gmail_app_password_here

# Example:
# GMAIL_USER=ztproctor@gmail.com
# GMAIL_APP_PASSWORD=abcd efgh ijkl mnop

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
echo "2. Replace 'your_gmail_address@gmail.com' with your actual Gmail address"
echo "3. Replace 'your_gmail_app_password_here' with your Gmail app password"
echo "4. Save the file"
echo ""
echo "🔑 To get your Gmail App Password:"
echo "   1. Go to https://myaccount.google.com/apppasswords"
echo "   2. Sign in with your Gmail account"
echo "   3. Select 'Mail' and 'Other (Custom name)'"
echo "   4. Name it 'Coach Zach Website'"
echo "   5. Click 'Generate'"
echo "   6. Copy the 16-character password (with spaces)"
echo ""
echo "⚠️  Important Notes:"
echo "   - You MUST enable 2-factor authentication on your Gmail first"
echo "   - Use the App Password, NOT your regular Gmail password"
echo "   - The App Password will look like: 'abcd efgh ijkl mnop'"
echo ""
echo "🗄️  To get your Supabase credentials:"
echo "   - Go to https://supabase.com"
echo "   - Create a new project"
echo "   - Go to Settings > API"
echo "   - Copy the Project URL and anon key"
echo ""
echo "🔒 Security note: The .env file is automatically ignored by Git"
echo "   Your credentials will never be committed to the repository" 