# QuantumVest Enterprise - Vercel Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Setup

- [ ] Vercel CLI installed globally (`npm install -g vercel`)
- [ ] Logged into Vercel account (`vercel login`)
- [ ] Environment variables configured in Vercel dashboard
- [ ] Domain configured (if using custom domain)

### ✅ Code Quality

- [ ] All TypeScript errors resolved (`npm run typecheck`)
- [ ] ESLint warnings addressed (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] Production build succeeds (`npm run build:production`)

### ✅ Dependencies

- [ ] Package-lock.json exists and up to date
- [ ] No security vulnerabilities (`npm audit`)
- [ ] All dependencies compatible with Node.js 18+

### ✅ Configuration Files

- [ ] `vercel.json` properly configured
- [ ] `.vercelignore` excludes unnecessary files
- [ ] Environment variables set in `.env.production`
- [ ] Build scripts optimized for production

## Deployment Commands

### Quick Deploy (Preview)

```bash
npm run deploy:vercel
```

### Production Deploy

```bash
npm run deploy:vercel:prod
```

### Manual Deploy

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Post-Deployment Verification

### ✅ Functionality Tests

- [ ] Homepage loads correctly
- [ ] Navigation works on all screen sizes
- [ ] All major routes accessible (/dashboard, /enterprise-innovations, etc.)
- [ ] Responsive navbar functions properly
- [ ] No console errors in browser
- [ ] Performance metrics acceptable (Core Web Vitals)

### ✅ Technical Verification

- [ ] HTTPS enabled
- [ ] Security headers present
- [ ] 404 pages redirect to index.html (SPA routing)
- [ ] Static assets load from CDN
- [ ] Gzip compression enabled

### ✅ Route Testing

Test these critical routes:

- [ ] `/` - Homepage
- [ ] `/dashboard` - Main dashboard
- [ ] `/platform-navigation` - Platform navigation
- [ ] `/enterprise-innovations` - Enterprise features
- [ ] `/pricing` - Pricing page
- [ ] `/super-admin` - Admin dashboard
- [ ] `/components` - Component library

## Environment Variables for Vercel Dashboard

Set these in your Vercel project settings:

```bash
# Required for all deployments
NODE_ENV=production
VITE_APP_ENV=production
VITE_SITE_URL=https://your-domain.vercel.app

# Optional: Third-party services
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_ANALYTICS_ID=your_analytics_id
```

## Performance Optimization

### Bundle Analysis

```bash
npm run build:analyze
```

### Lighthouse Testing

```bash
npm run performance:lighthouse
```

### Bundle Size Check

```bash
npm run performance:bundle-size
```

## Troubleshooting

### Common Issues

1. **Build Fails**

   - Check TypeScript errors: `npm run typecheck`
   - Verify all imports exist
   - Check for missing dependencies

2. **Routes Return 404**

   - Verify `vercel.json` rewrites configuration
   - Check SPA routing setup

3. **Environment Variables Not Working**

   - Ensure variables are prefixed with `VITE_`
   - Set in Vercel dashboard, not just in files
   - Redeploy after adding variables

4. **Performance Issues**
   - Check bundle size with analyzer
   - Verify code splitting is working
   - Optimize images and assets

## Custom Domain Setup

1. Add domain in Vercel dashboard
2. Configure DNS records:
   ```
   Type: CNAME
   Name: www (or @)
   Value: cname.vercel-dns.com
   ```
3. Wait for DNS propagation
4. Verify SSL certificate

## Monitoring and Analytics

- **Vercel Analytics**: Monitor Core Web Vitals
- **Error Tracking**: Set up Sentry (optional)
- **Performance**: Use Lighthouse CI
- **Uptime**: Configure monitoring service

## Rollback Plan

If deployment fails:

1. Revert to previous version in Vercel dashboard
2. Fix issues locally
3. Redeploy when ready

## Security Checklist

- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] No sensitive data in client-side code
- [ ] API keys properly secured
- [ ] CSP headers configured

## Success Criteria

Deployment is successful when:

- [ ] All routes load without errors
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Core Web Vitals are in green
- [ ] No critical console errors
- [ ] All enterprise features functional
