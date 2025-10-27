# Deployment Guide for Lou Gehrig Fan Club Website

This guide provides step-by-step instructions for deploying the LGFC website to Vercel with complete backend integration.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Backend Services Setup](#backend-services-setup)
4. [Vercel Deployment](#vercel-deployment)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18.x or 20.x installed
- Git installed
- GitHub account
- Vercel account (free tier works)
- Supabase account (optional, for database features)
- Backblaze B2 account (optional, for media storage)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/wdhunter645/lgfc-on-vercel.git
cd lgfc-on-vercel
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables (Optional)

If you want to test with backend services locally:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Backblaze B2 Storage Configuration
BACKBLAZE_KEY_ID=your-key-id-here
BACKBLAZE_APPLICATION_KEY=your-application-key-here
BACKBLAZE_BUCKET_NAME=lgfc-media-production
BACKBLAZE_ENDPOINT=s3.us-west-004.backblazeb2.com
NEXT_PUBLIC_MEDIA_CDN_URL=https://f004.backblazeb2.com/file/lgfc-media-production

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note:** The application will work without these credentials using mock data for development.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 5. Build and Test

```bash
npm run build
npm run start
```

## Backend Services Setup

### Setting Up Supabase (Optional)

The voting, FAQ, timeline, and other dynamic features require a Supabase database.

#### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name:** lgfc-production
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to your audience
5. Wait for provisioning (2-3 minutes)

#### 2. Create Database Tables

Go to SQL Editor in Supabase and run the SQL scripts from the documentation:

```sql
-- See "Lou Gehrig Fan Club - Vercel Implementation Instructions for Copilot Agent.md"
-- Section 3.2 for complete database schema
```

Key tables needed:
- `weekly_votes` - For voting feature
- `vote_records` - For tracking votes
- `friends_of_club` - Partner organizations
- `timeline_events` - Career milestones
- `faq_items` - Q&A content
- `calendar_events` - Club events

#### 3. Get API Credentials

1. Go to Project Settings → API
2. Copy:
   - **Project URL:** `https://[project-ref].supabase.co`
   - **Anon/Public Key:** For client-side access
   - **Service Role Key:** For server-side access (keep secret!)

### Setting Up Backblaze B2 (Optional)

For media storage and image uploads.

#### 1. Create Backblaze Account

1. Go to [backblaze.com](https://www.backblaze.com/b2/sign-up.html)
2. Sign up and verify email

#### 2. Create B2 Bucket

1. Navigate to Buckets
2. Click "Create a Bucket"
3. Configure:
   - **Bucket Name:** lgfc-media-production
   - **Files in Bucket:** Public
   - **Encryption:** Disabled
4. Save the Bucket ID and Endpoint URL

#### 3. Create Application Key

1. Navigate to App Keys
2. Click "Add New Application Key"
3. Configure:
   - **Name:** lgfc-vercel-production
   - **Bucket:** lgfc-media-production
   - **Permissions:** Read and Write
4. Save the `keyID` and `applicationKey` (shown only once!)

## Vercel Deployment

### Method 1: Deploy via Vercel Dashboard (Recommended)

#### 1. Connect Repository to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `wdhunter645/lgfc-on-vercel`
4. Authorize Vercel to access your repository

#### 2. Configure Project

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./`
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)
- **Node.js Version:** 20.x

#### 3. Add Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

**For Production Environment:**

```
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
BACKBLAZE_KEY_ID=[your-key-id]
BACKBLAZE_APPLICATION_KEY=[your-app-key]
BACKBLAZE_BUCKET_NAME=lgfc-media-production
BACKBLAZE_ENDPOINT=s3.us-west-004.backblazeb2.com
NEXT_PUBLIC_MEDIA_CDN_URL=https://f004.backblazeb2.com/file/lgfc-media-production
NEXT_PUBLIC_SITE_URL=https://[your-domain].vercel.app
```

**Note:** Leave environment variables empty if you haven't set up the backend services yet. The site will work with mock data.

#### 4. Deploy

Click "Deploy" and Vercel will build and deploy your site.

Your site will be available at: `https://[project-name].vercel.app`

### Method 2: Deploy via GitHub Actions (Configured)

The repository includes a GitHub Actions workflow (`.github/workflows/vercel-prod.yml`) for automatic deployments.

#### 1. Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `VERCEL_TOKEN` - Get from Vercel Dashboard → Settings → Tokens
- `VERCEL_ORG_ID` - Get from Vercel Dashboard → Settings → General
- `VERCEL_PROJECT_ID` - Get from Project Settings → General

#### 2. Push to Main Branch

```bash
git push origin main
```

The workflow will automatically deploy to Vercel.

## Testing

### Local Testing Checklist

- [ ] All components render correctly
- [ ] Navigation links work
- [ ] Responsive design on mobile/tablet/desktop
- [ ] API endpoints return data (or mock data)
- [ ] Voting system works (if database configured)
- [ ] FAQ search functionality works
- [ ] Build succeeds: `npm run build`
- [ ] Lint passes: `npm run lint`

### Production Testing Checklist

- [ ] Site loads at Vercel URL
- [ ] All sections display correctly
- [ ] Images and assets load
- [ ] Voting system works (if database configured)
- [ ] FAQ search works
- [ ] Mobile responsive design verified
- [ ] SSL certificate active (HTTPS)
- [ ] Check browser console for errors

### Testing Without Backend

The application is designed to work without backend services configured:

- **Friends section:** Shows mock partner data
- **Timeline:** Shows mock career milestones
- **FAQ:** Shows mock questions and answers
- **Voting:** Shows message that database is not configured
- **Calendar:** Shows empty (no events)

This allows you to deploy and test the frontend before setting up backend services.

## Continuous Deployment

Once connected to Vercel:

- **Main Branch:** Automatic deployment to production
- **Pull Requests:** Automatic preview deployments
- **Other Branches:** Can be deployed as previews

## Troubleshooting

### Build Fails

**Problem:** Build fails in Vercel

**Solutions:**
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version is 18.x or 20.x
4. Test build locally: `npm run build`

### Environment Variables Not Working

**Problem:** API calls fail or return errors

**Solutions:**
1. Verify environment variables are set in Vercel dashboard
2. Check variable names match exactly (case-sensitive)
3. Redeploy after adding variables
4. Check if variables are set for correct environment (Production/Preview)

### Database Connection Fails

**Problem:** "Database not configured" messages

**Solutions:**
1. Verify Supabase credentials are correct
2. Check Supabase project is not paused (free tier)
3. Ensure Row Level Security (RLS) policies are configured
4. Test connection from SQL Editor in Supabase

### Images Not Loading

**Problem:** Image uploads fail or don't display

**Solutions:**
1. Verify Backblaze B2 credentials
2. Check bucket permissions (should be Public)
3. Verify CORS configuration if needed
4. Test credentials with B2 CLI

### Voting Not Working

**Problem:** Votes not being recorded

**Solutions:**
1. Check browser console for errors
2. Verify there's an active voting matchup in database
3. Check that `weekly_votes` table has current data
4. Ensure IP detection is working (check headers)

## Monitoring

### Vercel Analytics

Enable in Vercel Dashboard → Project → Analytics

Monitors:
- Page views
- Performance metrics
- Web Vitals

### Error Tracking (Optional)

Consider adding Sentry for error tracking:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## Maintenance

### Regular Tasks

**Weekly:**
- Update weekly voting matchup in Supabase
- Review error logs
- Check vote counts

**Monthly:**
- Update dependencies: `npm update`
- Review database usage
- Check storage usage in Backblaze

**Quarterly:**
- Security updates: `npm audit fix`
- Content refresh
- Performance audit

## Support

- **Email:** LouGehrigFanClub@gmail.com
- **Repository Issues:** [GitHub Issues](https://github.com/wdhunter645/lgfc-on-vercel/issues)
- **Documentation:** See other `.md` files in repository

## Next Steps

After deployment:

1. Populate database with initial content
2. Upload Lou Gehrig images to Backblaze
3. Create first weekly voting matchup
4. Add FAQ items
5. Set up calendar events
6. Configure custom domain (optional)
7. Set up analytics and monitoring
8. Plan marketing and social media

---

**Congratulations!** Your Lou Gehrig Fan Club website is now deployed! 🎉
