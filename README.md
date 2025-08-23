# KYRACO — "Un Billet pour l'Écologie"

Lightweight Next.js site and campaign front-end for KYRACO (Côte d'Ivoire). Contains e-commerce pages, landing pages, campaign landing, thank-you flow, and server API routes to create payment sessions and save order state.

Quick links
- App entry/layout: [app/layout.js](app/layout.js) — imports [`CartProvider`](app/CartContext.jsx) and [`Menu`](components/menu/index.jsx)
- Landing page: [app/landing/page.jsx](app/landing/page.jsx) and [app/landing/ClientPage.jsx](app/landing/ClientPage.jsx)
- Thank-you / verification UI: [app/landing/thankyou/ClientSuccess.jsx](app/landing/thankyou/ClientSuccess.jsx)
- Checkout API: [app/api/checkout/route.js](app/api/checkout/route.js) — exported handler: `POST`
- Payment helper: [lib/waveApi.js](lib/waveApi.js) — `createCheckoutSession`
- Database/service client: [lib/supabase.js](lib/supabase.js) — exported `supabase`
- Button component used across landing: [components/landing/Button.tsx](components/landing/Button.tsx)
- Package manifest: [package.json](package.json)

Table of contents
- Overview
- Quick start
- Environment variables
- Project structure (high level)
- Key flows & files
- Styling & components
- Scripts
- Deployment
- Troubleshooting
- Docs
- References

## Overview
This repository is a Next.js app (App Router) for KYRACO's campaign. It uses server route handlers under app/api to create/check payment sessions (Wave) and stores order/session IDs in Supabase. The app provides campaign landing pages, a checkout flow, and thank-you/verification UI.

Quick start
1. Install dependencies:
```bash
npm install
```
2. Run development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
Open http://localhost:3000.

## Environment variables
Create a `.env.local` at the project root with the values required for your environment. Example variables used by the code:

```bash
# filepath: .env.example
# ...existing code...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (server-side; service role key used by API routes)
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Wave / payment provider secret key (server-side)
WAVE_API_KEY=sk_...

# Optional public keys for client usage
NEXT_PUBLIC_SUPABASE_ANON_KEY=pk_...
```

## Project structure (important files)
- app/layout.js — root layout that injects the CartProvider and global Menu component.
- app/CartContext.jsx — cart state provider used throughout the app.
- app/landing/page.jsx and app/landing/ClientPage.jsx — landing route and UI components.
- app/landing/thankyou/ClientSuccess.jsx — client-side verification/thank-you UI.
- app/api/checkout/route.js — checkout POST handler that creates payment sessions and records orders.
- app/api/checkout/[id]/route.js and related nested routes — session check, expire, refund, verify endpoints.
- lib/waveApi.js — Wave payment helper (createCheckoutSession, verify helpers).
- lib/supabase.js — Supabase client used by server routes.
- components/ — UI components grouped by feature (landing, products, menu, buttons).
- styles.module.css files — component-level styling using CSS modules.

## Key flows & files
- Checkout creation
  - Frontend sends a POST to app/api/checkout (handler in app/api/checkout/route.js).
  - The server handler calls createCheckoutSession (lib/waveApi.js) to obtain a Wave session and launch URL.
  - The handler saves session/order metadata in Supabase via supabase (lib/supabase.js) and returns urls/ids to the frontend.
- Session verification / thank-you
  - ClientSuccess reads query parameters (order/session ids) and calls the verification endpoints under app/api/checkout/*.
  - Verification endpoints check Wave for final status and update order state in Supabase.
- Webhooks
  - app/api/checkout/webhook (and donations/webhook) can receive asynchronous event notifications from Wave and update the database accordingly.

### Styling & components
- Uses CSS modules for component-level styles (e.g., components/*/styles.module.css, app/*/styles.module.css).
- Important reusable components:
  - components/landing/Button.tsx — main button used on landing and thank-you pages.
  - components/menu/index.jsx — global navigation/menu component.
  - components/products/* — product lists, filters, and cards for the shop section.

### Scripts (from package.json)
- npm run dev — start Next dev server
- npm run build — build for production
- npm start — start server after build
- Add test/lint scripts as needed

## Deployment
- Intended for Vercel. Configure environment variables (SUPABASE_SERVICE_ROLE_KEY, WAVE_API_KEY, NEXT_PUBLIC_APP_URL, etc.) in your Vercel project settings.
- Ensure production NEXT_PUBLIC_APP_URL matches your deployment URL so server routes generate correct redirects.

#### Troubleshooting tips
- Authorization / 401 errors: confirm WAVE_API_KEY and SUPABASE_SERVICE_ROLE_KEY values.
- If fetch calls to Wave fail, log the request and response in the server route before parsing.
- For CORS/redirect issues, verify NEXT_PUBLIC_APP_URL and the request origin used by the API route.
- Inspect Vercel function logs for runtime errors from route handlers.

### Docs — KYRACO

This folder contains developer-facing documentation for the KYRACO Next.js application.

Files:
- API.md — server route reference for app/api
- ENV.md — environment variables and usage
- CONTRIBUTING.md — contribution guidelines and workflow

Read these first and open the referenced files in app/ and lib/ for implementation details.
#### References
- Layout and providers: app/layout.js, app/CartContext.jsx
- Landing components: app/landing/page.jsx, app/landing/ClientPage.jsx
- Thank-you/verification UI: app/landing/thankyou/ClientSuccess.jsx
- Checkout API & helpers: app/api/checkout/route.js, lib/waveApi.js, lib/supabase.js
- Shared UI: components/landing/Button.tsx, components/menu/index.jsx
