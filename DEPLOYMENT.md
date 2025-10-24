# Vercel Deployment Quick Start Guide

This guide provides step-by-step instructions for deploying the Lou Gehrig Fan Club website to Vercel.

## Prerequisites

- GitHub account with access to this repository
- Vercel account (free tier is sufficient for initial deployment)

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import this Git repository:
   - Select **GitHub** as the Git provider
   - Find `wdhunter645/lgfc-on-vercel`
   - Click **"Import"**

### 2. Configure Project Settings

Vercel will auto-detect Next.js. Verify these settings:

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build (default)
Output Directory: .next (default)
Install Command: npm install (default)
```

**Important**: Leave all settings as default unless you have specific requirements.

### 3. Deploy

Click **"Deploy"** button. Vercel will:
- Clone the repository
- Install dependencies (`npm install`)
- Build the application (`npm run build`)
- Deploy to production

First deployment typically takes 2-3 minutes.

### 4. Verify Deployment

Once deployed, Vercel provides:
- **Production URL**: `https://[project-name].vercel.app`
- **Deployment Status**: Check the "Deployments" tab

#### Test the Prototype

Visit: `https://[your-domain].vercel.app/prototype/index.html`

You should see the complete Lou Gehrig Fan Club prototype with:
- Navigation header
- Hero banner
- Weekly matchup voting section
- Friends of the Club
- Career timeline
- News & Q&A
- Results table
- Calendar
- Social wall
- Footer

## Environment Variables (Optional - For Future Features)

When ready to add backend features, add these in Vercel Dashboard:

1. Go to **Project Settings** → **Environment Variables**
2. Add the following:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
BACKBLAZE_KEY_ID=your_backblaze_key_id
BACKBLAZE_APPLICATION_KEY=your_backblaze_app_key
```

3. Click **Save**
4. Redeploy for changes to take effect

## Continuous Deployment

After initial setup:

- **Automatic Deployments**: Every push to `main` branch triggers deployment
- **Preview Deployments**: Pull requests get unique preview URLs
- **Instant Rollback**: Revert to any previous deployment in one click

### Branch Configuration

Current setup:
- `main` branch → Production deployment
- Other branches → Preview deployments
- PRs → Automatic preview links in PR comments

## Domain Configuration (Optional)

To use a custom domain:

1. Go to **Project Settings** → **Domains**
2. Add your domain (e.g., `lougehrigfanclub.com`)
3. Follow DNS configuration instructions
4. Vercel automatically provisions SSL certificate

## Performance & Analytics

Enable in project settings:

- **Vercel Analytics**: Track Core Web Vitals and performance
- **Speed Insights**: Monitor real-world page performance
- **Deployment Logs**: Debug build and runtime issues

## Troubleshooting

### Build Failures

Check **Deployment Logs** in Vercel Dashboard:

```bash
# Common issues and solutions:

# 1. Dependency issues
Solution: Clear build cache in Project Settings

# 2. Build timeout
Solution: Check for long-running build steps

# 3. Environment variables missing
Solution: Add required variables in Project Settings
```

### Prototype Not Loading

1. Verify files exist in `/public/prototype/`:
   - `index.html`
   - `styles.css`
   - `README.md`

2. Access at: `https://[domain]/prototype/index.html`
   - Note: Must include `index.html` in URL

3. Check browser console for errors

### Font Loading Issues

The project is configured to work without external font loading. If you see font-related errors:

1. Check `app/layout.tsx` doesn't import Google Fonts
2. Rebuild and redeploy

## Monitoring

### Deployment Health

Monitor in Vercel Dashboard:
- Build duration
- Function execution
- Bandwidth usage
- Error rates

### Logs

Access real-time logs:
1. Go to **Deployments**
2. Click on a deployment
3. View **Build Logs** and **Function Logs**

## Cost Considerations

### Free Tier Includes:
- Unlimited deployments
- 100 GB bandwidth per month
- Automatic HTTPS
- Preview deployments
- Core Web Vitals monitoring

### Pro Tier Features:
- Custom domains (multiple)
- Team collaboration
- Advanced analytics
- Priority support

## Next Steps

After successful deployment:

1. ✅ Verify prototype is accessible
2. ✅ Test all sections render correctly
3. ⏳ Begin React component conversion (see IMPLEMENTATION_GUIDE.md)
4. ⏳ Add backend integration (Supabase, Backblaze B2)
5. ⏳ Implement voting API endpoint
6. ⏳ Configure custom domain

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

## Project Documentation

- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Full implementation strategy
- [README.md](./README.md) - Project overview and setup
- [lgfc-on-vercel.md](./lgfc-on-vercel.md) - Original specifications

---

**Questions?** Contact: LouGehrigFanClub@gmail.com

**Deployment Date**: Ready to deploy immediately after merging this PR
