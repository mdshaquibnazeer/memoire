# 🌹 Mémoire — Cinematic Memory Platform

> Create unforgettable personalized websites for anniversaries, weddings, birthdays, and love stories.

![Mémoire Platform](https://placehold.co/1200x600/1a0a2e/e8c4b8?text=M%C3%A9moire+Platform)

## Overview

Mémoire is a production-ready SaaS platform that lets users craft emotionally resonant, cinematic websites to celebrate life's most important moments. With premium animations, elegant themes, and a powerful builder — your memories deserve more than a photo album.

## Features

- 🎬 **Cinematic Themes** — Romantic Glow, Cinematic Memories, Scrapbook Love
- 🔐 **Secure Auth** — JWT + Refresh tokens, bcrypt, email verification
- 🎵 **Music Player** — Ambient audio with autoplay support
- 📸 **Media Uploads** — Images, videos, audio via Cloudinary
- ⏳ **Memory Timeline** — Animated storytelling timeline
- 🖼️ **Masonry Gallery** — Cinematic hover effects + lightbox
- 🔗 **Dynamic URLs** — `/memory/abc123` or `/story/john-emma`
- 📱 **PWA Support** — Mobile-first, installable
- 🤖 **AI Messages** — Claude-powered love message generation
- 🔒 **Password Protected** — Private memory pages
- 📅 **Scheduled Publishing** — Publish at the perfect moment
- 📊 **Admin Panel** — User management and moderation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Animations | Framer Motion, GSAP |
| UI Components | ShadCN UI |
| Backend | Node.js, Express.js, TypeScript |
| Database | Neon PostgreSQL + Prisma ORM |
| Storage | Cloudinary |
| Auth | JWT + Refresh Tokens + bcrypt |
| Email | Resend |
| Deployment | Vercel (Frontend) + Render (Backend) |

## Quick Start

```bash
# Clone and setup
git clone https://github.com/your-username/memoire.git
cd memoire

# Install all dependencies
npm run install:all

# Setup environment variables
cp client/.env.example client/.env.local
cp server/.env.example server/.env

# Setup database
cd server && npx prisma migrate dev

# Run development
npm run dev
```

## Project Structure

```
memoire/
├── client/          # Next.js 14 frontend
├── server/          # Express.js backend  
├── shared/          # Shared TypeScript types
├── docs/            # Documentation
└── README.md
```

## Deployment

- **Frontend**: Deploy `client/` to Vercel
- **Backend**: Deploy `server/` to Render
- **Database**: Neon PostgreSQL (free tier available)
- **Media**: Cloudinary (free tier: 25GB)

See [Deployment Guide](./docs/DEPLOYMENT.md) for full instructions.

---

*Built with love for moments that deserve to last forever.*

