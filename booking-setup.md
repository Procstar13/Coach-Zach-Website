# Booking System Setup Guide

## Overview

You now have **two booking options** set up and ready to use:

1. **Calendly Integration** - Easy, professional, minimal setup
2. **Custom Booking System** - Full control, custom features

## Option 1: Calendly Integration (Recommended)

### Quick Setup (5 minutes)

1. **Sign up for Calendly**:
   - Go to [calendly.com](https://calendly.com)
   - Create free account
   - Set up your availability calendar

2. **Create Event Types**:
   - 1-on-1 Training (60 minutes)
   - Small Group Training (90 minutes)
   - Skill Assessment (45 minutes)

3. **Update the Website**:
   - Replace `YOUR_CALENDLY_USERNAME` in `index.html` with your actual username
   - The calendar will automatically appear on your site

4. **Customize** (Optional):
   - Add your logo to Calendly
   - Customize confirmation emails
   - Set up payment integration

### Benefits:
- ✅ **Professional appearance**
- ✅ **Automatic availability sync**
- ✅ **Payment processing** (Stripe/PayPal)
- ✅ **Calendar integration** (Google/Outlook)
- ✅ **No coding required**

---

## Option 2: Custom Booking System

### Setup Instructions

1. **Deploy to Vercel** (if not already done):
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Set Environment Variable**:
   - Add `RESEND_API_KEY` in Vercel dashboard
   - Same key used for contact form emails

3. **Customize Your Schedule**:
   Edit `api/booking.js` lines 7-13:
   ```javascript
   const availableSlots = {
     'monday': ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
     'tuesday': ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
     // ... update with your actual availability
   };
   ```

4. **Update Pricing**:
   Edit `api/booking.js` lines 15-19:
   ```javascript
   const sessionTypes = {
     '1on1': { name: '1-on-1 Training', duration: 60, price: 75 },
     'group': { name: 'Small Group Training', duration: 90, price: 50 },
     'assessment': { name: 'Skill Assessment', duration: 45, price: 60 }
   };
   ```

5. **Test the System**:
   - Visit your site
   - Click "Book Custom Session"
   - Fill out the booking form
   - Check your email for confirmation

### Features Included:

#### For Parents:
- **Session type selection** with pricing
- **Real-time availability** checking
- **Date and time picker**
- **Location preferences**
- **Training goals** input
- **Booking summary** before confirmation
- **Professional confirmation emails**

#### For You (Coach Zach):
- **Detailed booking notifications** with all client info
- **Session details** (type, date, time, location)
- **Player information** (name, age, goals)
- **Professional email templates**
- **Booking management** (easy to track)

### Customization Options:

#### Update Availability:
```javascript
// In api/booking.js
const availableSlots = {
  'monday': ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
  'tuesday': ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
  'wednesday': ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
  'thursday': ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
  'friday': ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
  'saturday': ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'],
  'sunday': ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00']
};
```

#### Update Pricing:
```javascript
// In api/booking.js
const sessionTypes = {
  '1on1': { name: '1-on-1 Training', duration: 60, price: 75 },
  'group': { name: 'Small Group Training', duration: 90, price: 50 },
  'assessment': { name: 'Skill Assessment', duration: 45, price: 60 }
};
```

#### Customize Email Templates:
Edit the HTML email templates in `api/booking.js` to match your branding.

---

## Which Option Should You Choose?

### Choose Calendly If:
- You want **quick setup** (5 minutes)
- You need **payment processing**
- You want **calendar integration**
- You prefer **minimal maintenance**

### Choose Custom System If:
- You want **full control** over the experience
- You need **custom features**
- You want **integrated branding**
- You prefer **no monthly fees**

---

## Testing Your Booking System

### For Calendly:
1. Visit your website
2. Click on the embedded calendar
3. Select a session type and time
4. Complete the booking process
5. Check your email for confirmation

### For Custom System:
1. Visit `yourdomain.com/booking-form.html`
2. Fill out the booking form
3. Select session type, date, and time
4. Submit the booking
5. Check both your email and the parent's email

---

## Next Steps

1. **Choose your preferred option**
2. **Set up your availability**
3. **Test the booking process**
4. **Customize email templates**
5. **Add payment processing** (if needed)

Both systems are **production-ready** and will work immediately after setup!

---

**Need help?** Both systems are designed to be self-service, but you can always modify the code to add custom features as your business grows. 