# SMECO COOPER Mobile

## What this is
React Native (Expo) mobile app + standalone web app for the SMECO COOPER AI assistant.
Talks to the COOPER FastAPI backend via REST API (proxy through analytics.smeco.com or direct to analyticsdev2).

## Architecture
- **React Native app** (`app/`, `components/`, `providers/`) — Expo Router, Clerk auth, SQLite chat history
- **Web app** (`web/index.html`) — standalone single-file HTML/JS, no build step, deployed to analytics.smeco.com
- **API client** (`services/api.ts`) — `askAuto()`, `askDomain()`, `checkHealth()`, etc.
- **Config** (`constants/config.ts`) — domain registry, proxy/direct mode toggle

## Domains (9 active)
HR, Weather, SCADA, OMS & Reliability, CC&B, EIP, AMI, Ellipse, WMS.
Reliability was merged into OMS (2025-03-23).

## Deployment
- Web app: `analytics.smeco.com/ai/` and `/ai-mobile/` — both serve `web/index.html`
- Nginx config: `/etc/nginx/conf.d/analytics-hub.conf` on analytics.smeco.com (eai15alxp1)
- Backend: analyticsdev2.smeco.com ports 4000-4010
- To redeploy web: `scp web/index.html liud1@analytics.smeco.com:/var/www/analytics-hub/ai-mobile/index.html` then sudo cp to `/var/www/analytics-hub/ai/index.html`

## Auth
- Clerk for mobile app auth (EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env)
- Nginx basic auth for web app (.htpasswd)

## Git
- Remote: git@github.com:danliu09/cooper-mobile.git (SSH)
- Old app backed up at /home/dan/cooper-mobile-old/
