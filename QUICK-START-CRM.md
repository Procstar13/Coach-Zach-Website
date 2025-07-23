# Quick Start CRM Implementation Guide

## Step 1: Set Up Supabase (5 minutes)

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up with your email
   - Create a new project called "coach-zach-soccer-crm"

2. **Get Your Credentials**
   - Go to Settings > API in your Supabase dashboard
   - Copy the "Project URL" and "anon public" key

3. **Set Up Database**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Click "Run" to create all tables and sample data

## Step 2: Update Your Environment (2 minutes)

1. **Run the setup script:**
   ```bash
   chmod +x setup-env.sh
   ./setup-env.sh
   ```

2. **Edit your `.env` file:**
   - Replace `your_supabase_project_url_here` with your actual Supabase URL
   - Replace `your_supabase_anon_key_here` with your actual anon key

## Step 3: Install Dependencies (1 minute)

```bash
npm install
```

## Step 4: Test the Integration (2 minutes)

1. **Replace your booking API:**
   - Rename `api/booking.js` to `api/booking-backup.js`
   - Rename `api/booking-with-supabase.js` to `api/booking.js`

2. **Test a booking:**
   - Go to your booking form
   - Fill out and submit a test booking
   - Check your Supabase dashboard to see the data

## Step 5: Access Your Admin Dashboard

1. **Open the admin dashboard:**
   - Navigate to `admin-dashboard.html` in your browser
   - Update the Supabase credentials in the JavaScript section

2. **What you'll see:**
   - Customer overview with statistics
   - List of all customers and players
   - Session history and payment tracking
   - Revenue reports

## Immediate Benefits

✅ **Customer Data Storage**: All bookings now save customer information
✅ **Duplicate Prevention**: System recognizes returning customers
✅ **Session Tracking**: Complete history of all sessions
✅ **Basic Reporting**: Revenue and attendance metrics
✅ **Professional Dashboard**: Clean interface for managing your business

## Next Steps (Optional)

1. **Customize the Dashboard**: Add your branding and specific fields
2. **Add Payment Tracking**: Record actual payments received
3. **Customer Portal**: Let customers view their own data
4. **Automated Reminders**: Send session reminders via email
5. **Mobile App**: Build a mobile interface for on-the-go management

## Cost Breakdown

- **Supabase Free Tier**: $0/month (covers 1000+ customers)
- **Resend**: $0/month (up to 100 emails/day)
- **Vercel**: $0/month (for hosting)

**Total Cost: $0/month** for a professional CRM system!

## Support

If you run into any issues:
1. Check the Supabase dashboard for error messages
2. Verify your environment variables are correct
3. Check the browser console for JavaScript errors
4. Ensure your database schema was created successfully

## Security Notes

- Your `.env` file is automatically ignored by Git
- Supabase includes built-in security features
- All customer data is encrypted and secure
- You can export your data anytime from Supabase

---

**You now have a professional CRM system for your soccer training business!** 🎉 