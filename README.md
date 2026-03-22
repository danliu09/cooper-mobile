# SMECO COOPER Mobile

iOS + Android mobile app for SMECO's AI-powered data warehouse. Built with React Native / Expo.

Talks to the same domain functions as LibreChat — just via REST API instead of MCP/SSE.

```
LibreChat (desktop)  → MCP/SSE (ports 3001-3010) → ask_hr(), ask_reliability(), ...
This app (mobile)    → REST API (ports 4001-4010) → ask_hr(), ask_reliability(), ...
```

## Screenshots

_Coming soon_

## Setup

### Prerequisites
- Node.js 18+
- [Expo Go](https://expo.dev/go) app on your iPhone or Android device
- SMECO COOPER backend running (`rest_api.py` on analyticsdev2)

### Install & Run

```bash
git clone git@github.com:danliu09/cooper-mobile.git
cd cooper-mobile
npm install
```

Edit `constants/config.ts` — set `API_HOST` to your server's IP:
```typescript
export const API_HOST = "http://192.168.x.x";  // your server IP
```

Start the dev server:
```bash
npx expo start
```

Scan the QR code with Expo Go on your phone.

### Build for App Store

```bash
npx eas build --platform ios
npx eas submit --platform ios
```

Requires an [Apple Developer Account](https://developer.apple.com/) ($99/year) and [Expo EAS](https://expo.dev/eas) setup.

## Architecture

```
cooper-mobile/
├── app/                        # Screens (Expo Router, file-based)
│   ├── _layout.tsx             # Tab navigation (Domains, Status, Settings)
│   ├── index.tsx               # Home — 10 domain cards with health status
│   ├── status.tsx              # Server health dashboard
│   ├── settings.tsx            # Server URL config
│   └── domain/
│       └── [name].tsx          # Per-domain chat interface
├── components/
│   ├── ChatMessage.tsx         # Chat bubble (user/assistant)
│   ├── DomainCard.tsx          # Domain picker card
│   └── SmecoChart.tsx          # Chart renderer (Recharts via WebView)
├── services/
│   └── api.ts                  # REST API client
├── constants/
│   ├── config.ts               # Domain list, ports, server URL
│   └── theme.ts                # SMECO brand colors
└── app.json                    # Expo config
```

## 10 Domains

| Domain | Port | Description |
|--------|------|-------------|
| Reliability | 4001 | SAIDI/CAIDI/SAIFI/MAIFI, TMED, IEEE days |
| HR | 4002 | Employee headcount, demographics, tenure |
| Weather | 4003 | Temperature, degree days, NWS forecasts |
| SCADA | 4004 | Alarms, sequence of events, telemetry |
| OMS | 4005 | Live outages, incident history |
| CC&B | 4006 | Billing, payments, field activities |
| EIP | 4007 | Smart meters, service points, usage |
| AMI | 4008 | Raw meter reads, interval data |
| Ellipse | 4009 | Work orders, inventory, purchase orders |
| WMS | 4010 | Warehouse cycle counts, picks, receiving |

## Backend

The REST API gateway lives in [smeco-cooper](https://github.com/danliu09/smeco-cooper) (`rest_api.py`). Start it with:

```bash
cd /path/to/smeco-cooper
./start_rest_api.sh
```

## Tech Stack

- **React Native** + **Expo** (cross-platform iOS/Android)
- **Expo Router** (file-based navigation)
- **TypeScript**
- **Recharts** (charts via WebView)
- **FastAPI** backend (Python, in smeco-cooper repo)
