# Lou Gehrig Fan Club Website
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

This is a [Next.js](https://nextjs.org) project for the Lou Gehrig Fan Club, celebrating the Iron Horse and his incredible legacy.

**Status:** CI/CD workflows configured and tested with Vercel deployment.

## Project Structure

```
lgfc-on-vercel/
├── app/                    # Next.js app router
│   ├── components/        # React components (to be created)
│   ├── page.tsx          # Main page
│   └── layout.tsx        # Root layout
├── public/
│   └── prototype/        # Static HTML/CSS prototype
│       ├── index.html    # Complete visual scaffold
│       ├── styles.css    # Consolidated styling
│       └── README.md     # Prototype reference guide
├── IMPLEMENTATION_GUIDE.md  # Comprehensive deployment guide
└── vercel.json           # Vercel configuration
```

## Getting Started

### Development

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Accessing the Prototype

The static prototype is available at:
- **Local**: [http://localhost:3000/prototype/index.html](http://localhost:3000/prototype/index.html)
- **Production**: `https://[your-domain]/prototype/index.html`

The prototype serves as the visual reference for React component development.

### Building for Production

```bash
npm run build
npm run start
```

## Deployment on Vercel

### Quick Deploy

1. **Connect Repository**: Import this repository in [Vercel Dashboard](https://vercel.com/new)
2. **Configure Project**:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
3. **Deploy**: Click "Deploy" and Vercel will handle the rest

### Environment Variables

For production features (Supabase, Backblaze B2), add these in Vercel Dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
BACKBLAZE_KEY_ID=your_b2_key_id
BACKBLAZE_APPLICATION_KEY=your_b2_app_key
```

### Verifying Supabase Setup

To verify that Supabase is properly configured:

```bash
# Check environment variables
npm run check:env

# Verify complete Supabase setup
npm run verify:supabase

# Test database connection
npm run db:test
```

See [SUPABASE_VERIFICATION.md](./SUPABASE_VERIFICATION.md) for detailed verification results and [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for setup instructions.

### Continuous Deployment

- Automatic deployments on push to `main` branch
- Preview deployments for all pull requests
- Production URL: `https://[your-project].vercel.app`

## Implementation Roadmap

See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for the complete implementation strategy.

### Phase 1: Prototype Foundation ✅
- Static HTML/CSS scaffold in `/public/prototype/`
- All sections designed and styled
- Vercel configuration ready

### Phase 2: React Components (In Progress)
- Convert prototype sections to React components
- Implement in `app/components/`:
  - `Hero.tsx` - Hero banner
  - `Voting.tsx` - Weekly matchup voting
  - `Friends.tsx` - Friends showcase
  - `Timeline.tsx` - Career milestones
  - `Faq.tsx` - News & Q&A
  - `Calendar.tsx` - Club calendar
  - `Footer.tsx` - Site footer

### Phase 3: Data Integration
- Connect to Supabase for database
- Integrate Backblaze B2 for media storage
- Create API endpoints for voting and forms

### Phase 4: Production Launch
- Performance optimization
- SEO implementation
- Analytics integration
- Launch to production

## Features

- ✅ **Static Prototype**: Complete visual reference
- ⏳ **Weekly Matchup**: Vote on Lou Gehrig pictures
- ⏳ **Friends of the Club**: Partner organizations
- ⏳ **Timeline**: Career milestones and achievements
- ⏳ **FAQ System**: News and Q&A with search
- ⏳ **Calendar**: Club events and activities
- ⏳ **Social Wall**: Elfsight integration
- ⏳ **Responsive Design**: Mobile-friendly layout

## Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

### Vercel Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)

### Project Documentation
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Detailed implementation guide
- [lgfc-on-vercel.md](./lgfc-on-vercel.md) - Original project specifications

## Support

For questions or issues, contact: LouGehrigFanClub@gmail.com

---

**Note**: This project is currently in active development. The prototype is complete and serves as the foundation for React component development.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/cubic"><img src="https://avatars.githubusercontent.com/u/414982?v=4?s=100" width="100px;" alt="cubic"/><br /><sub><b>cubic</b></sub></a><br /><a href="https://github.com/wdhunter645/wdhunter645/lgfc-on-vercel/commits?author=cubic" title="Code">💻</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!