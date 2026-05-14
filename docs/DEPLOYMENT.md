# 🚀 Mémoire — Deployment Guide

## Overview

| Component | Service | Cost |
|-----------|---------|------|
| Frontend  | Vercel  | Free tier |
| Backend   | Render  | Free tier (with sleep) |
| Database  | Neon    | Free tier (0.5GB) |
| Storage   | Cloudinary | Free tier (25GB) |
| Email     | Resend  | Free tier (100/day) |

---

## 1. Neon PostgreSQL Setup

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project: `memoire`
3. Select region closest to your users
4. Copy the **Connection String** (looks like `postgresql://...`)
5. Neon provides two connection strings:
   - `DATABASE_URL` — pooled connection (for regular queries)  
   - `DIRECT_URL` — direct connection (for Prisma migrations)

```bash
# Run migrations
cd server
npx prisma migrate deploy

# Optional: seed initial data
npm run seed
```

---

## 2. Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com) and create account
2. From Dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
3. Create upload preset (optional):
   - Go to Settings → Upload
   - Create preset named `memoire`

---

## 3. Resend Email Setup

1. Go to [resend.com](https://resend.com)
2. Create account and API key
3. Add and verify your domain (or use `onboarding@resend.dev` for testing)
4. Copy API key to `RESEND_API_KEY`

---

## 4. Deploy Backend to Render

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial production deployment"
git push origin main
```

### Step 2: Create Render Service
1. Go to [render.com](https://render.com)
2. New → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `memoire-api`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Environment Variables in Render
Add all variables from `server/.env.example`:

```
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_ACCESS_SECRET=<generate: openssl rand -hex 64>
JWT_REFRESH_SECRET=<generate: openssl rand -hex 64>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
RESEND_API_KEY=re_your_key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Mémoire
APP_URL=https://your-app.vercel.app
ANTHROPIC_API_KEY=sk-ant-optional
```

### Step 4: Run Migrations on Render
After deploying, use Render Shell or run:
```bash
npx prisma migrate deploy
```

---

## 5. Deploy Frontend to Vercel

### Step 1: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. New Project → Import from GitHub
3. Select your repository
4. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Next.js

### Step 2: Environment Variables in Vercel
```
NEXT_PUBLIC_API_URL=https://memoire-api.onrender.com/api
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Step 3: Deploy
Click Deploy. Vercel auto-deploys on every push to main.

---

## 6. Custom Domain (Optional)

### Vercel (Frontend)
1. Vercel Dashboard → Domains
2. Add `yourdomain.com` and `www.yourdomain.com`
3. Follow DNS instructions

### Render (Backend)  
1. Render Dashboard → Custom Domains
2. Add `api.yourdomain.com`
3. Update `CLIENT_URL` in Render env vars

---

## 7. Production Checklist

- [ ] `NODE_ENV=production` set on Render
- [ ] JWT secrets are long random strings (64+ chars)
- [ ] Database migrations run successfully
- [ ] Email sending works (test with real email)
- [ ] Cloudinary uploads working
- [ ] CORS configured with production frontend URL
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active (auto on Vercel/Render)
- [ ] Rate limiting enabled (already configured)
- [ ] Helmet security middleware enabled (already configured)

---

## 8. Local Development

```bash
# Install all dependencies
npm run install:all

# Setup databases
cp server/.env.example server/.env
cp client/.env.example client/.env.local
# Fill in your env values

# Run database migrations
cd server && npx prisma migrate dev && cd ..

# Start dev servers (runs both concurrently)
npm run dev
```

Frontend: http://localhost:3000  
Backend: http://localhost:5000  
Prisma Studio: `npm run db:studio`

---

## 9. Monitoring & Maintenance

### Database backups
Neon automatically creates daily backups on paid plans.
For free tier, export manually:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Logs
- Vercel: Dashboard → Deployments → Function Logs
- Render: Dashboard → Logs tab

### Scaling
When ready to scale:
- Render: Upgrade from Free to Starter ($7/month) to avoid sleep
- Neon: Upgrade for more storage and compute
- Cloudinary: Upgrade for more bandwidth

---

## Support

For issues, check:
1. Environment variables are correctly set
2. Database migrations are applied
3. CORS is configured with correct URLs
4. JWT secrets match between deployments
