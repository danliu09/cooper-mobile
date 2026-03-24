# 2025-03-23: Strip OpenAI/RevenueCat, Wire COOPER API, Deploy Web App

## Summary
Converted the Galaxies.dev ChatGPT clone template into the SMECO COOPER mobile + web app.
Stripped all OpenAI and RevenueCat dependencies, wired the COOPER REST API, and deployed
a standalone web app to analytics.smeco.com.

## Changes Made

### 1. Stripped RevenueCat / OpenAI / DALL-E
- `providers/RevenueCat.tsx` — replaced with passthrough provider (no SDK)
- `app/(auth)/(modal)/purchase.tsx` — gutted, auto-redirects back
- `app/(auth)/(modal)/settings.tsx` — removed API key/org fields, now shows COOPER API info + domain list + sign out
- `app/(auth)/(drawer)/dalle.tsx` — converted to **Domains** screen with health-check indicators
- `app/(auth)/(drawer)/explore.tsx` — converted from "Explore GPTs" to COOPER Domains explorer
- `app/(auth)/(drawer)/_layout.tsx` — removed RevenueCat import/usage, rebranded drawer items
- Removed `react-native-openai`, `openai`, `react-native-purchases` from `package.json`

### 2. Copied COOPER API Client from cooper-mobile-old
- `services/api.ts` — askAuto(), askDomain(), checkHealth(), classifyQuestion(), etc.
- `constants/config.ts` — 9 domain registry (reliability merged into OMS), proxy/direct mode

### 3. Updated Branding
- `app.json` — name: "SMECO COOPER", bundle IDs: com.smeco.cooper
- `package.json` — name: smeco-cooper

### 4. Wired ChatPage to COOPER REST API
- `components/ChatPage.tsx` — replaced OpenAI streaming with askAuto()/askDomain(), domain selector dropdown
- `components/MessageIdeas.tsx` — SMECO-relevant starter prompts (outages, SAIDI/SAIFI, feeders)
- `utils/Interfaces.ts` — added loading flag to Message

### 5. Built & Deployed Standalone Web App
- `web/index.html` — single-file HTML/JS app (~14KB), no build step
  - Chat interface, domain selector, health check indicator, idea cards
  - Mobile-optimized for Workspace ONE browser
- Deployed to analytics.smeco.com:
  - `/ai-mobile/` — new location block in Nginx
  - `/ai/` — replaced existing Expo web export with same file
- Nginx config: `/etc/nginx/conf.d/analytics-hub.conf` on eai15alxp1

### 6. Domain Update
- Removed reliability as separate domain (port 4001 stopped)
- OMS label updated to "OMS & Reliability"
- Router now shows 9 domains

## Files Changed
- 13 modified, 3 new (`constants/config.ts`, `services/api.ts`, `web/index.html`)
- Net: -813 lines removed, +318 lines added (from template → COOPER)

## Deployment Notes
- Web app served at `https://analytics.smeco.com/ai/` and `/ai-mobile/`
- Both use Nginx basic auth (.htpasswd)
- Backend: analyticsdev2.smeco.com ports 4000-4010, proxied via analytics.smeco.com/ai/api/
- Mobile app not yet tested on device (needs Expo Go or EAS build)
