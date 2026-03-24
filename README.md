# SMECO COOPER Mobile

Mobile and web interface for the SMECO COOPER AI data assistant. Ask natural-language questions across SMECO's operational data domains.

## Features

- **9 data domains**: HR, Weather, SCADA, OMS & Reliability, CC&B, EIP, AMI, Ellipse, WMS
- **Auto-routing**: Automatically classifies questions to the right domain
- **Domain selector**: Override auto-routing to target a specific domain
- **Chat history**: SQLite-backed conversation persistence (mobile app)
- **Health checks**: Live domain status indicators

## Web App

Single-file web app at `web/index.html`. No build step required.

**Live at:**
- `https://analytics.smeco.com/ai/`
- `https://analytics.smeco.com/ai-mobile/`

### Deploy

```bash
scp web/index.html liud1@analytics.smeco.com:/var/www/analytics-hub/ai-mobile/index.html
# Then copy to /ai/:
ssh -t liud1@analytics.smeco.com "sudo cp /var/www/analytics-hub/ai-mobile/index.html /var/www/analytics-hub/ai/index.html"
```

## Mobile App (React Native)

Built with Expo + Expo Router. Requires Clerk auth.

```bash
npm install
npx expo start
```

### Environment Variables

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## API Backend

Connects to COOPER FastAPI servers on analyticsdev2.smeco.com (ports 4000-4010), proxied through `analytics.smeco.com/ai/api/`.

## Stack

- [Expo](https://expo.dev/) + [Expo Router](https://docs.expo.dev/routing/introduction/)
- [Clerk](https://clerk.com/) for authentication
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite-next/) for chat persistence
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for animations
- [FlashList](https://shopify.github.io/flash-list/) for efficient list rendering

Based on the [Galaxies.dev](https://galaxies.dev) ChatGPT clone template.
