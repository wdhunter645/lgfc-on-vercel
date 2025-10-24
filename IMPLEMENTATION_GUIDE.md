# LGFC Website Implementation Guide for Vercel

## Overview
This guide outlines the best approach for implementing and deploying the Lou Gehrig Fan Club (LGFC) website on Vercel using Next.js.

## Architecture

### Current Structure
- **Framework**: Next.js 16.0.0 with App Router
- **Styling**: Tailwind CSS 4.x
- **Deployment Platform**: Vercel
- **Static Prototype**: Located in `/public/prototype/`

### Deployment Strategy

#### Phase 1: Prototype Foundation (✅ Complete)
The static HTML/CSS prototype serves as the visual reference for the React implementation:

- **Location**: `/public/prototype/`
- **Files**:
  - `index.html` - Complete static scaffold with all sections
  - `styles.css` - Consolidated styling
  - `README.md` - Section reference guide

- **Access**: The prototype is accessible at `https://[your-domain]/prototype/index.html`

#### Phase 2: React Component Conversion (Next Steps)
Convert static sections into reusable React components:

```
app/
  components/
    Hero.tsx          - Hero banner section
    Voting.tsx        - Weekly matchup voting interface
    Friends.tsx       - Friends of the Club showcase
    Timeline.tsx      - Career milestones timeline
    Faq.tsx          - News & Q&A accordion
    Calendar.tsx     - Club calendar widget
    Footer.tsx       - Site footer with links
    Header.tsx       - Navigation header
```

#### Phase 3: Data Integration
- Connect to **Supabase** for database operations
- Integrate **Backblaze B2** for media storage
- Create `/api/vote` endpoint for voting functionality
- Implement server actions for form submissions

#### Phase 4: Production Optimization
- Image optimization using Next.js Image component
- SEO optimization with metadata API
- Performance monitoring
- Analytics integration

## Vercel Configuration

### vercel.json
The project includes a `vercel.json` configuration for optimal deployment:

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### Environment Variables (Required for Production)
Set these in Vercel Dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
BACKBLAZE_KEY_ID=your_b2_key_id
BACKBLAZE_APPLICATION_KEY=your_b2_app_key
```

## Deployment Process

### Initial Deployment
1. **Connect Repository**: Link GitHub repo to Vercel
2. **Configure Project**:
   - Framework: Next.js
   - Root Directory: `/`
   - Build Command: `npm run build` (or use default)
   - Output Directory: `.next` (default)

3. **Set Environment Variables**: Add required variables in Vercel dashboard

4. **Deploy**: Vercel will automatically build and deploy

### Continuous Deployment
- Every push to `main` branch triggers automatic deployment
- Preview deployments created for pull requests
- Rollback available in Vercel dashboard

## Development Workflow

### Local Development
```bash
npm install           # Install dependencies
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Test production build
npm run start        # Start production server locally
npm run lint         # Run ESLint
```

### Component Development
1. Reference prototype at `/prototype/index.html`
2. Create component in `app/components/`
3. Extract styles to Tailwind classes
4. Test component in isolation
5. Integrate into main page

### Testing Prototype
Access prototype during development:
- Local: `http://localhost:3000/prototype/index.html`
- Production: `https://[your-domain]/prototype/index.html`

## Best Practices

### Performance
- Use Next.js Image component for all images
- Implement lazy loading for below-fold content
- Optimize fonts with next/font
- Enable static generation where possible

### SEO
- Add comprehensive metadata to each page
- Include Open Graph tags
- Generate sitemap.xml
- Implement structured data (JSON-LD)

### Security
- Never commit environment variables
- Use environment variables for all API keys
- Implement rate limiting on API routes
- Validate all user inputs

### Accessibility
- Maintain semantic HTML structure from prototype
- Include ARIA labels
- Ensure keyboard navigation
- Test with screen readers

## Key Features to Implement

### 1. Weekly Matchup Voting
- Real-time vote counting
- Prevent duplicate votes (IP or session based)
- Display results dynamically
- Archive past matchups

### 2. Friends of the Club
- Dynamic partner showcase
- External link validation
- Responsive grid layout

### 3. Timeline
- Interactive milestone display
- Chronological ordering
- Media integration

### 4. FAQ System
- Search functionality
- Collapsible accordion
- Admin interface for management

### 5. Calendar Integration
- Event display
- Calendar export (iCal)
- Time zone handling

### 6. Social Wall
- Elfsight widget integration
- Responsive embedding
- Performance optimization

## Monitoring & Analytics

### Vercel Analytics
Enable in project settings:
- Web Vitals tracking
- Page view analytics
- API route monitoring

### Error Tracking
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay

## Support & Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Prototype Reference
- Location: `/public/prototype/`
- All sections fully designed
- Ready for component extraction

## Next Steps

1. ✅ Prototype structure created
2. ⏳ Start with Hero component conversion
3. ⏳ Implement Voting component with API
4. ⏳ Add remaining sections incrementally
5. ⏳ Connect to Supabase backend
6. ⏳ Deploy to Vercel production

---

**Note**: This guide provides a roadmap for implementing the LGFC website. Follow the phased approach to ensure a smooth transition from prototype to production.
