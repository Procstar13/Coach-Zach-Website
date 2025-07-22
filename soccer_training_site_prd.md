# 📝 PRD: Coach Zach – Private Soccer Training Website

## Overview
A simple, SEO-optimized, mobile-first landing page for booking private soccer training sessions in the local area. The site should be fast, clean, and conversion-focused. Deployed on Vercel with booking integration, contact form, and local SEO metadata.

---

## 1. Goals
- Book more 1-on-1 and small group training sessions
- Generate leads through a contact form
- Provide legitimacy and social proof to parents
- Rank locally on Google for soccer training searches

---

## 2. Tech Stack
- **Frontend:** React, Tailwind CSS (optional), Next.js (via Cursor)
- **Backend:** None needed (unless storing form data; optional to integrate with Airtable/Sheets)
- **Deployment:** Vercel
- **Booking:** Calendly or TidyCal (embed or link)
- **Form Handling:** Formspree, Resend, or basic Netlify-style handler

---

## 3. Pages / Sections

### ✅ Homepage (One-Page Layout)
#### Hero Section
- H1: **Private Soccer Training in [Your City]**
- Subhead: *1-on-1 and small group sessions for ages [X–Y]. Improve skills, confidence, and game performance.*
- CTA Button → Scrolls to booking

#### About the Trainer
- Name: Coach Zach
- Coaching/playing experience
- Coaching philosophy: *Development-focused, confidence-first coaching tailored to each player*

#### Services
- 1-on-1 Training
- Small Group Training (2–5 players)
- Optional: Clinics / Combine-Style Testing
- Pricing: *Add later or "Pricing available on request"*

#### Testimonials
- At least one sample: *“Coach Zach helped my son boost his game IQ and confidence.”*

#### Booking Calendar
- Embed Calendly or TidyCal widget
- Options:
  - 30-min session
  - 1-hour session
  - Group session
- Collect name, age, email, session type

#### Contact Form
- Name
- Parent Email
- Player Name + Age
- Message/Goals

#### Footer
- Social links: Facebook, Instagram
- Email: [you@example.com]
- Phone: [optional]
- Basic disclaimer: *“Not affiliated with local soccer clubs or organizations.”*

---

## 4. SEO Requirements
- Meta Title: *“Private Soccer Training in [City] | Coach Zach”*
- Meta Description: *“Book 1-on-1 or small group soccer coaching with Coach Zach in [City]. Improve technical skills, confidence, and speed with customized training.”*
- Alt text for all images
- Open Graph meta tags for FB/X preview
- Schema.org markup for LocalBusiness
- Mobile responsive, <1s load time, image optimization

---

## 5. Integrations
- **Booking**: Calendly or TidyCal
- **CRM Export**: Google Sheets, Airtable, or Zapier-connected form handler
- **Email Handling**: Formspree, Resend, or custom webhook
- **Analytics**: Google Analytics (Gtag or GA4)

---

## 6. Domain & Hosting
- Vercel deployment pipeline
- Connect to domain: `coachzachsoccer.com` (placeholder)
- SSL included

---

## 7. Stretch Features (Optional for MVP)
- Blog for SEO content ("5 drills to improve footwork")
- Payment integration (Square or Stripe)
- Dynamic calendar sync with Google
- Client dashboard or profile login (not for MVP)

---

## Deliverables
- One responsive landing page
- Booking system integration
- Working contact form
- Optimized SEO metadata
- Deployed to Vercel with domain ready

