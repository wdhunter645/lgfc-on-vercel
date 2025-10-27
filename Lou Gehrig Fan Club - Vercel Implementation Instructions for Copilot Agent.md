# Lou Gehrig Fan Club - Vercel Implementation Instructions for Copilot Agent

## Project Overview

Implement the Lou Gehrig Fan Club website using Next.js on Vercel with GitHub for version control, Supabase for database, and Backblaze B2 for media storage.

**Repository:** https://github.com/wdhunter645/lgfc-on-vercel  
**Tech Stack:** Next.js 14+, React, TypeScript, Vercel, Supabase, Backblaze B2

-----

## Phase 1: Environment Setup

### 1.1 Clone and Initialize Repository

```bash
# Clone the repository
git clone https://github.com/wdhunter645/lgfc-on-vercel.git
cd lgfc-on-vercel

# Install dependencies
npm install

# Verify development environment
npm run dev
# Should run on http://localhost:3000
```

### 1.2 Review Existing Structure

The repository contains:

- `/app/` - Next.js App Router directory
- `/public/prototype/` - Static HTML/CSS prototype (reference design)
- `vercel.json` - Vercel configuration
- `IMPLEMENTATION_GUIDE.md` - Detailed implementation guide

**Key Action:** Review the prototype at `/public/prototype/index.html` - this is the visual reference for all React components.

-----

## Phase 2: Vercel Deployment Setup

### 2.1 Connect GitHub Repository to Vercel

1. **Login to Vercel Dashboard:** https://vercel.com/dashboard
1. **Import Project:**
- Click “Add New…” → “Project”
- Select “Import Git Repository”
- Choose GitHub and authorize Vercel
- Select repository: `wdhunter645/lgfc-on-vercel`
1. **Configure Project Settings:**
   
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build (default)
   Output Directory: .next (default)
   Install Command: npm install (default)
   Node.js Version: 18.x or 20.x (recommended)
   ```
1. **Environment Variables (leave empty for now):**
- Will be added in Phase 3 after setting up Supabase and Backblaze
1. **Deploy:** Click “Deploy” button

### 2.2 Configure Git Integration

**Automatic Deployments:**

- Production: `main` branch → https://[project-name].vercel.app
- Preview: All pull requests and branches get preview URLs
- Comments: Enable GitHub bot comments on PRs

**Branch Protection (optional):**

```bash
# Set up in GitHub repository settings
# Require pull request reviews before merging to main
# Require status checks (Vercel deployment) to pass
```

-----

## Phase 3: Database Setup (Supabase)

### 3.1 Create Supabase Project

1. **Sign up/Login:** https://supabase.com
1. **Create New Project:**
- Organization: Create or select
- Project Name: `lgfc-production`
- Database Password: Generate strong password (save securely)
- Region: Choose closest to target audience
- Pricing Plan: Free tier for development
1. **Wait for provisioning** (2-3 minutes)

### 3.2 Database Schema Design

Create tables for the following features:

**Table: `weekly_votes`**

```sql
CREATE TABLE weekly_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_id VARCHAR(50) NOT NULL,
  image_a_url TEXT NOT NULL,
  image_b_url TEXT NOT NULL,
  votes_a INTEGER DEFAULT 0,
  votes_b INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_week_id ON weekly_votes(week_id);
CREATE INDEX idx_dates ON weekly_votes(start_date, end_date);
```

**Table: `vote_records`**

```sql
CREATE TABLE vote_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_id VARCHAR(50) NOT NULL,
  voter_ip VARCHAR(45),
  voter_fingerprint TEXT,
  selected_option CHAR(1) CHECK (selected_option IN ('A', 'B')),
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_voter_tracking ON vote_records(week_id, voter_ip);
```

**Table: `friends_of_club`**

```sql
CREATE TABLE friends_of_club (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_display_order ON friends_of_club(display_order);
```

**Table: `timeline_events`**

```sql
CREATE TABLE timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_event_date ON timeline_events(date);
```

**Table: `faq_items`**

```sql
CREATE TABLE faq_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(50),
  display_order INTEGER,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_category ON faq_items(category);
CREATE INDEX idx_published ON faq_items(is_published);
```

**Table: `calendar_events`**

```sql
CREATE TABLE calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(200),
  event_type VARCHAR(50),
  registration_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_event_date ON calendar_events(event_date);
```

### 3.3 Configure Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE weekly_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends_of_club ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Public read access for display data
CREATE POLICY "Public read access" ON weekly_votes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON friends_of_club FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON timeline_events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON faq_items FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access" ON calendar_events FOR SELECT USING (is_published = true);

-- Voting requires special handling (will be managed via API)
CREATE POLICY "Allow vote insertion" ON vote_records FOR INSERT WITH CHECK (true);
```

### 3.4 Get Supabase Credentials

1. Go to Project Settings → API
1. Copy the following:
- **Project URL:** `https://[project-ref].supabase.co`
- **Anon/Public Key:** `eyJhbG...` (public key for client-side)
- **Service Role Key:** `eyJhbG...` (secret key for server-side, keep secure!)

-----

## Phase 4: Media Storage Setup (Backblaze B2)

### 4.1 Create Backblaze Account

1. **Sign up:** https://www.backblaze.com/b2/sign-up.html
1. **Verify email and complete setup**

### 4.2 Create B2 Bucket

1. **Navigate to Buckets**
1. **Create Bucket:**
- Bucket Name: `lgfc-media-production`
- Files in Bucket: Public
- Encryption: Disabled (for public content)
- Object Lock: Disabled
1. **Note Bucket Details:**
- Bucket ID
- Endpoint URL (e.g., `s3.us-west-004.backblazeb2.com`)

### 4.3 Create Application Key

1. **Navigate to App Keys**
1. **Add New Application Key:**
- Name: `lgfc-vercel-production`
- Allow access to: `lgfc-media-production` (specific bucket)
- Permissions: Read and Write
- Allow List All Bucket Names: No
1. **Save Credentials (shown once!):**
- `keyID`: Your application key ID
- `applicationKey`: Your application key (secret)
- `endpoint`: Bucket endpoint

### 4.4 Configure CORS (if needed)

```json
[
  {
    "corsRuleName": "allow-vercel",
    "allowedOrigins": [
      "https://[your-vercel-domain].vercel.app",
      "https://[your-custom-domain].com"
    ],
    "allowedOperations": [
      "b2_download_file_by_id",
      "b2_download_file_by_name"
    ],
    "allowedHeaders": ["*"],
    "exposeHeaders": ["x-bz-content-sha1"],
    "maxAgeSeconds": 3600
  }
]
```

-----

## Phase 5: Environment Variables Configuration

### 5.1 Add to Vercel Dashboard

Navigate to: Project Settings → Environment Variables

**Production Environment:**

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... (secret, server-only)

# Backblaze B2
BACKBLAZE_KEY_ID=your_key_id
BACKBLAZE_APPLICATION_KEY=your_application_key
BACKBLAZE_BUCKET_NAME=lgfc-media-production
BACKBLAZE_ENDPOINT=s3.us-west-004.backblazeb2.com
NEXT_PUBLIC_MEDIA_CDN_URL=https://f004.backblazeb2.com/file/lgfc-media-production

# Application
NEXT_PUBLIC_SITE_URL=https://[your-domain].vercel.app
```

**Development Environment:**

```
# Create a separate Supabase project for development
NEXT_PUBLIC_SUPABASE_URL=https://[dev-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Use same Backblaze or create dev bucket
BACKBLAZE_KEY_ID=your_key_id
BACKBLAZE_APPLICATION_KEY=your_application_key
BACKBLAZE_BUCKET_NAME=lgfc-media-development
```

### 5.2 Local Development

Create `.env.local` (add to `.gitignore`):

```bash
# Copy from Vercel dashboard or use development credentials
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BACKBLAZE_KEY_ID=
BACKBLAZE_APPLICATION_KEY=
BACKBLAZE_BUCKET_NAME=
BACKBLAZE_ENDPOINT=
NEXT_PUBLIC_MEDIA_CDN_URL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

-----

## Phase 6: Component Development

### 6.1 Convert Prototype to React Components

Reference: `/public/prototype/index.html` for styling and structure

**Priority Order:**

1. `Hero.tsx` - Hero banner with Lou Gehrig imagery
1. `Voting.tsx` - Weekly matchup voting system
1. `Friends.tsx` - Friends of the club showcase
1. `Timeline.tsx` - Career milestones
1. `Faq.tsx` - News & Q&A section
1. `Calendar.tsx` - Club events calendar
1. `Footer.tsx` - Site footer

### 6.2 Create Component Structure

**Location:** `/app/components/`

**Example Component Template (Hero.tsx):**

```typescript
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroProps {
  // Define props
}

export default function Hero({}: HeroProps) {
  return (
    <section className="hero" id="hero">
      {/* Component JSX matching prototype design */}
    </section>
  );
}
```

### 6.3 Styling Approach

**Options:**

1. **Tailwind CSS (recommended):** Already configured in Next.js
1. **CSS Modules:** Import from prototype styles
1. **Styled Components:** If preferred

**Action:** Extract styles from `/public/prototype/styles.css` and convert to chosen method.

-----

## Phase 7: API Routes Development

### 7.1 Voting API

**File:** `/app/api/vote/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { weekId, option } = await request.json();
    
    // Get IP for duplicate prevention
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check if already voted
    const { data: existing } = await supabase
      .from('vote_records')
      .select('id')
      .eq('week_id', weekId)
      .eq('voter_ip', ip)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { error: 'Already voted this week' },
        { status: 400 }
      );
    }
    
    // Record vote
    await supabase.from('vote_records').insert({
      week_id: weekId,
      voter_ip: ip,
      selected_option: option
    });
    
    // Update vote count
    const column = option === 'A' ? 'votes_a' : 'votes_b';
    await supabase.rpc('increment_vote', {
      week: weekId,
      vote_column: column
    });
    
    // Return updated counts
    const { data: votes } = await supabase
      .from('weekly_votes')
      .select('votes_a, votes_b')
      .eq('week_id', weekId)
      .single();
    
    return NextResponse.json({ success: true, votes });
  } catch (error) {
    return NextResponse.json(
      { error: 'Vote failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Get current week's voting data
  const { data } = await supabase
    .from('weekly_votes')
    .select('*')
    .gte('end_date', new Date().toISOString())
    .order('start_date', { ascending: false })
    .limit(1)
    .single();
  
  return NextResponse.json(data);
}
```

**Create SQL Function:**

```sql
CREATE OR REPLACE FUNCTION increment_vote(week VARCHAR, vote_column VARCHAR)
RETURNS void AS $$
BEGIN
  IF vote_column = 'votes_a' THEN
    UPDATE weekly_votes SET votes_a = votes_a + 1 WHERE week_id = week;
  ELSE
    UPDATE weekly_votes SET votes_b = votes_b + 1 WHERE week_id = week;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### 7.2 Content APIs

Create similar API routes for:

- `/app/api/friends/route.ts` - Get friends of club
- `/app/api/timeline/route.ts` - Get timeline events
- `/app/api/faq/route.ts` - Get FAQ items (with search)
- `/app/api/calendar/route.ts` - Get calendar events

### 7.3 Media Upload API

**File:** `/app/api/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: `https://${process.env.BACKBLAZE_ENDPOINT}`,
  region: 'us-west-004',
  credentials: {
    accessKeyId: process.env.BACKBLAZE_KEY_ID!,
    secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY!
  }
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.BACKBLAZE_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type
    }));
    
    const url = `${process.env.NEXT_PUBLIC_MEDIA_CDN_URL}/${fileName}`;
    
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

**Install AWS SDK:**

```bash
npm install @aws-sdk/client-s3
```

-----

## Phase 8: Integration & Testing

### 8.1 Component Integration

**File:** `/app/page.tsx`

```typescript
import Hero from './components/Hero';
import Voting from './components/Voting';
import Friends from './components/Friends';
import Timeline from './components/Timeline';
import Faq from './components/Faq';
import Calendar from './components/Calendar';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <Voting />
      <Friends />
      <Timeline />
      <Faq />
      <Calendar />
      <Footer />
    </main>
  );
}
```

### 8.2 Testing Checklist

**Local Testing:**

- [ ] All components render correctly
- [ ] Voting system works (vote, prevent duplicates)
- [ ] Data fetching from Supabase works
- [ ] Images load from Backblaze
- [ ] Mobile responsive design
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

**Production Testing:**

- [ ] Deployment successful on Vercel
- [ ] Environment variables working
- [ ] API routes accessible
- [ ] CORS configured correctly
- [ ] SSL/HTTPS working
- [ ] Performance (Lighthouse score > 90)

### 8.3 Debugging Common Issues

**Issue: Supabase connection fails**

```typescript
// Add error logging
console.error('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.error('Has anon key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

**Issue: Backblaze uploads fail**

```bash
# Test credentials with B2 CLI
b2 authorize-account <keyID> <applicationKey>
b2 upload-file <bucketName> <localFile> <b2FileName>
```

**Issue: Environment variables not loading**

- Check variable names (exact match, case-sensitive)
- Redeploy after adding variables
- Verify environment (production vs preview)

-----

## Phase 9: Performance Optimization

### 9.1 Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/images/lou-gehrig.jpg"
  alt="Lou Gehrig"
  width={800}
  height={600}
  priority // For hero images
  placeholder="blur" // Optional
/>
```

### 9.2 Caching Strategy

**Vercel Configuration:** Update `vercel.json`

```json
{
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

**Database Queries:**

```typescript
// Use Supabase realtime for live data
const { data, error } = await supabase
  .from('weekly_votes')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10);
```

### 9.3 Bundle Size Optimization

```bash
# Analyze bundle
npm run build
npx @next/bundle-analyzer

# Use dynamic imports for large components
const Calendar = dynamic(() => import('./components/Calendar'), {
  loading: () => <p>Loading calendar...</p>
});
```

-----

## Phase 10: Production Launch

### 10.1 Pre-Launch Checklist

- [ ] All environment variables set in Vercel
- [ ] Database tables created and populated with initial data
- [ ] Backblaze bucket configured and tested
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Analytics configured (Vercel Analytics or Google Analytics)
- [ ] Error monitoring (Sentry or similar)
- [ ] SEO metadata added
- [ ] Social media preview images
- [ ] Favicon and PWA icons

### 10.2 Custom Domain Setup

**In Vercel Dashboard:**

1. Project Settings → Domains
1. Add Domain: `yourdomain.com`
1. Configure DNS:
   
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
1. Wait for DNS propagation (up to 48 hours)

### 10.3 SEO Configuration

**File:** `/app/layout.tsx`

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lou Gehrig Fan Club',
  description: 'Celebrating the Iron Horse and his incredible legacy',
  keywords: 'Lou Gehrig, baseball, Yankees, Iron Horse',
  openGraph: {
    title: 'Lou Gehrig Fan Club',
    description: 'Celebrating the Iron Horse',
    url: 'https://yourdomain.com',
    siteName: 'Lou Gehrig Fan Club',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lou Gehrig Fan Club',
    description: 'Celebrating the Iron Horse',
    images: ['/images/twitter-image.jpg']
  }
};
```

### 10.4 Deployment

```bash
# Commit all changes
git add .
git commit -m "Production ready deployment"
git push origin main

# Vercel auto-deploys from main branch
# Monitor deployment at https://vercel.com/dashboard
```

-----

## Phase 11: Monitoring & Maintenance

### 11.1 Setup Monitoring

**Vercel Analytics:**

- Enable in Project Settings → Analytics
- Monitor page views, performance, and Web Vitals

**Error Tracking:**

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 11.2 Database Backups

**Supabase:**

- Automatic daily backups (free plan: 7 days)
- Manual backup: Project Settings → Database → Download backup

**Backblaze:**

- Enable versioning in bucket settings
- Lifecycle rules for old file cleanup

### 11.3 Regular Maintenance Tasks

**Weekly:**

- [ ] Update weekly voting matchup
- [ ] Review vote counts and detect anomalies
- [ ] Check error logs

**Monthly:**

- [ ] Update dependencies: `npm update`
- [ ] Review database usage
- [ ] Check media storage usage
- [ ] Performance audit

**Quarterly:**

- [ ] Security updates: `npm audit fix`
- [ ] Backup review and testing
- [ ] Content refresh

-----

## Troubleshooting Guide

### Common Errors

**Error: “Unable to connect to Supabase”**

- Verify environment variables are set
- Check Supabase project is not paused (free tier)
- Verify API keys are correct

**Error: “Failed to upload to Backblaze”**

- Check application key permissions
- Verify bucket name matches environment variable
- Test credentials with B2 CLI

**Error: “Module not found”**

- Run `npm install` to ensure all dependencies installed
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

**Error: “Voting not working”**

- Check API route is accessible: `/api/vote`
- Verify IP detection in production
- Check database RLS policies

-----

## Additional Resources

**Documentation:**

- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Backblaze B2: https://www.backblaze.com/b2/docs/

**Support:**

- Project Email: LouGehrigFanClub@gmail.com
- Repository Issues: https://github.com/wdhunter645/lgfc-on-vercel/issues

-----

## Success Metrics

**Launch Goals:**

- Page load time < 2 seconds
- Lighthouse score > 90
- Mobile-friendly (responsive design)
- Zero critical errors in first week
- 100+ votes in first weekly matchup

**Growth Metrics:**

- Weekly active users
- Total votes cast
- Social media shares
- Returning visitors

-----

## Next Steps After Launch

1. **Content Population:**
- Add initial timeline events
- Populate FAQ section
- Add friends of the club
- Schedule calendar events
1. **Marketing:**
- Social media announcement
- Email newsletter
- Submit to baseball communities
1. **Feature Enhancements:**
- Admin panel for content management
- Email notifications for events
- User accounts and profiles
- Comment system for timeline events
1. **Analytics:**
- Set up conversion tracking
- Monitor user behavior
- A/B testing for voting UI

-----

## Copilot Agent Quick Reference

**One-Command Deployment:**

```bash
# After initial setup
git push origin main  # Auto-deploys to Vercel
```

**Environment Check:**

```bash
vercel env ls  # List all environment variables
vercel env pull  # Download .env.local for development
```

**Quick Deploy from CLI:**

```bash
vercel  # Preview deployment
vercel --prod  # Production deployment
```

**Database Migration:**

```bash
# Run SQL in Supabase SQL Editor or via CLI
supabase db push  # If using Supabase CLI
```

-----

**END OF IMPLEMENTATION INSTRUCTIONS**

These instructions provide a complete roadmap for deploying the Lou Gehrig Fan Club website. Follow phases sequentially for best results.