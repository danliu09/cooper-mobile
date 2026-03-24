# SMECO COOPER Mobile — Roadmap

## Completed
- [x] Clone Galaxies-dev template, restore Clerk auth
- [x] Strip RevenueCat, OpenAI, DALL-E
- [x] Copy COOPER API client + domain config
- [x] Update app.json + branding (SMECO COOPER, com.smeco.cooper)
- [x] Wire ChatPage to COOPER REST API (askAuto/askDomain, domain selector)
- [x] Build standalone web app (web/index.html)
- [x] Deploy to analytics.smeco.com/ai/ and /ai-mobile/
- [x] Merge reliability domain into OMS (9 domains)

## Next Up
- [ ] AD/SSO auth — replace Clerk with Azure AD (SMECO enterprise login)
- [ ] Mobile UI redesign — SMECO branding, colors, logo
- [ ] Chart rendering — display chart_suggestion data from API responses (bar, line, pie)
- [ ] Set up .env with Clerk publishable key for mobile testing
- [ ] Test mobile app on device (Expo Go or EAS build)
- [ ] SQL result tables — render tabular data from query responses
- [ ] Conversation context — send chat history with each request for multi-turn conversations
- [ ] Domain health dashboard — show all domain statuses on a dedicated screen
- [ ] Offline indicator — warn when API is unreachable
