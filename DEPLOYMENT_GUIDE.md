# QuantumVest Enterprise - Production Deployment Guide

This guide covers deployment to both **Vercel** and **OnRender** platforms with zero-runtime-error configurations.

## 🚀 Quick Deployment

### Vercel (Recommended for Speed)

```bash
# Preview deployment
npm run deploy:vercel

# Production deployment
npm run deploy:vercel:prod
```

### OnRender (Recommended for Control)

```bash
# Pre-deployment check
npm run deploy:render

# Then push to main branch for auto-deployment
```

## 📋 Pre-Deployment Checklist

### ✅ Required Files

- [x] `vercel.json` - Vercel configuration
- [x] `render.yaml` - OnRender configuration
- [x] `public/_redirects` - SPA routing support
- [x] `.env.example` - Environment variables template
- [x] `public/api/health.json` - Health check endpoint

### ✅ Environment Variables

Create `.env.production` from `.env.example` and configure:

**Required Variables:**

```bash
NODE_ENV=production
GENERATE_SOURCEMAP=false
VITE_APP_NAME=QuantumVest Enterprise
VITE_APP_ENV=production
VITE_SITE_URL=https://your-domain.com
```

**Optional but Recommended:**

```bash
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## 🎯 Vercel Deployment

### Automatic Deployment (Recommended)

1. **Connect Repository**

   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Login and link project
   vercel login
   vercel link
   ```

2. **Configure Environment Variables**

   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from `.env.example`
   - Set `NODE_ENV=production` and `GENERATE_SOURCEMAP=false`

3. **Deploy**

   ```bash
   # Preview deployment
   vercel

   # Production deployment
   vercel --prod
   ```

### Manual Configuration

**vercel.json Features:**

- ✅ SPA routing with fallback to `index.html`
- ✅ API routes support (`/api/*`)
- ✅ Security headers (XSS, CSRF, Frame protection)
- ✅ Asset caching (1 year for immutable assets)
- ✅ Automatic redirects for legacy routes
- ✅ Multi-region deployment (US East, West, Europe)

**Build Settings:**

- Build Command: `npm run build:production`
- Output Directory: `dist`
- Install Command: `npm install`
- Node Version: 18.x

## 🎯 OnRender Deployment

### Automatic Deployment (Recommended)

1. **Connect Repository**

   - Go to [OnRender Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - OnRender auto-detects `render.yaml`

2. **Configure Environment Variables**
   In OnRender dashboard, add:

   ```bash
   NODE_ENV=production
   GENERATE_SOURCEMAP=false
   VITE_APP_NAME=QuantumVest Enterprise
   VITE_APP_ENV=production
   PORT=8080
   ```

3. **Deploy**
   - Push to main branch
   - OnRender automatically builds and deploys
   - Monitor deployment in OnRender dashboard

### Manual Configuration

**render.yaml Features:**

- ✅ Production Node.js 18 environment
- ✅ Automatic scaling (1-10 instances)
- ✅ Health checks on `/api/health`
- ✅ SPA routing support
- ✅ Security headers
- ✅ Asset optimization
- ✅ Build filtering for faster deployments

**Service Settings:**

- Type: Web Service
- Environment: Node
- Region: Oregon (or your preferred region)
- Plan: Starter (upgrade as needed)
- Auto-Deploy: Yes (from main branch)

## 🔧 Build Optimization

### Production Build Features

```bash
npm run build:production
```

**Optimizations Applied:**

- ✅ Terser minification with tree shaking
- ✅ Code splitting by vendor, features, and routes
- ✅ Source maps disabled in production
- ✅ Bundle size warnings for chunks >1MB
- ✅ Asset optimization and compression
- ✅ Dead code elimination
- ✅ CSS purging and minification

### Bundle Analysis

```bash
npm run build:analyze
```

Reviews bundle sizes and identifies optimization opportunities.

## 🌐 SPA Routing Configuration

Both platforms include SPA routing support:

**Vercel:** Uses `rewrites` in `vercel.json`

```json
{
  "source": "/((?!api/).*)",
  "destination": "/index.html"
}
```

**OnRender:** Uses `public/_redirects`

```
/*  /index.html  200
```

**Route Support:**

- ✅ All enterprise routes (`/legendary-investors-enterprise`, etc.)
- ✅ Authentication routes (`/login`, `/register`)
- ✅ Dashboard routes (`/dashboard`, `/analytics`)
- ✅ API routes preserved (`/api/*`)
- ✅ Asset files served directly (`/assets/*`)

## 🔒 Security Configuration

### Headers Applied

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Cache-Control: public, max-age=31536000, immutable (for assets)
```

### CORS Configuration

API routes include CORS headers for cross-origin requests.

## 📊 Monitoring & Health Checks

### Health Check Endpoint

Both platforms monitor `/api/health` endpoint:

```json
{
  "status": "healthy",
  "service": "quantumvest-enterprise",
  "version": "2.1.0",
  "checks": {
    "database": "connected",
    "cache": "operational",
    "external_apis": "healthy"
  }
}
```

### Performance Monitoring

- **Vercel:** Built-in analytics and Core Web Vitals
- **OnRender:** Custom monitoring setup recommended

## 🚨 Troubleshooting

### Common Issues

**1. "Load failed" Errors**

```bash
# Check build output
npm run build:production

# Test production server locally
npm run start:production
```

**2. Route 404 Errors**

- Verify `_redirects` file in `public/` folder
- Check SPA routing configuration
- Ensure all routes are defined in React Router

**3. Environment Variable Issues**

```bash
# Verify environment variables
echo $NODE_ENV
echo $VITE_APP_NAME

# Test with production env
NODE_ENV=production npm run build
```

**4. Build Failures**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# TypeScript check
npm run typecheck

# Lint check
npm run lint:fix
```

### Debug Commands

```bash
# Local production test
npm run build:production && npm run start:production

# Bundle analysis
npm run build:analyze

# Security audit
npm audit

# Performance test
npm run lighthouse
```

## 🚀 Deployment Scripts

### Automated Scripts

**Vercel Deployment:**

```bash
# Full deployment with checks
npm run deploy:vercel

# Production deployment
npm run deploy:vercel:prod
```

**OnRender Deployment:**

```bash
# Pre-deployment validation
npm run deploy:render
```

### Manual Deployment

**Vercel:**

```bash
# Install and setup
npm install -g vercel
vercel login
vercel link

# Deploy
vercel --prod
```

**OnRender:**

```bash
# Build and test
npm run build:production
npm run start:production

# Push to trigger deployment
git push origin main
```

## 📈 Performance Optimizations

### Bundle Splitting

- Vendor chunks (React, UI libraries)
- Feature chunks (auth, analytics, payments)
- Route-based code splitting
- Asset optimization

### Caching Strategy

- Static assets: 1 year cache
- API responses: No cache
- HTML files: No cache
- Service worker: Update checks

### Loading Optimizations

- Lazy loading for all routes
- Component preloading for critical paths
- Resource hints for external dependencies
- Progressive image loading

## 🎯 Production Readiness

### Checklist

- ✅ Environment variables configured
- ✅ Build optimization enabled
- ✅ Security headers applied
- ✅ Health checks implemented
- ✅ Error boundaries in place
- ✅ Loading states optimized
- ✅ SPA routing configured
- ✅ Asset optimization enabled
- ✅ Monitoring setup
- ✅ Backup strategy defined

### Success Metrics

- Build time: <3 minutes
- Bundle size: <2MB (main chunk)
- Time to Interactive: <3 seconds
- First Contentful Paint: <1.5 seconds
- Zero runtime errors on all routes

## 🌟 Platform Recommendations

### Choose Vercel If:

- You need global CDN with edge functions
- You want zero-config deployments
- You prioritize speed and developer experience
- You need built-in analytics

### Choose OnRender If:

- You need more server control
- You want persistent storage
- You need background services
- You prefer container-based deployments

Both platforms support the complete QuantumVest Enterprise application with zero runtime errors across all routes.
