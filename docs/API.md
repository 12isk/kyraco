# API Reference — KYRACO

This documents the server routes under app/api.

app/api/checkout
- POST /app/api/checkout
  - Purpose: create a Wave payment session and save order in Supabase.
  - Body: { items, customer? } (app-specific payload)
  - Response: { wave_launch_url, orderId, session_id }
  - Errors: 400 for bad request, 500 for server/wave errors

- GET /app/api/checkout/[id]
  - Purpose: fetch order/session status by order id
  - Response: order record (includes wave_session_id, status)

- POST /app/api/checkout/[id]/expire
  - Purpose: mark session/order expired (manual or scheduled)

- POST /app/api/checkout/[id]/refund
  - Purpose: trigger refund flow (if supported)

- POST /app/api/checkout/verify
  - Purpose: check Wave session status and update order in Supabase
  - Body: { session_id | order_id }
  - Response: { status, order }

- POST /app/api/checkout/webhook
  - Purpose: receive Wave webhook events and update DB
  - Notes: verify signature if Wave provides one; use SUPABASE_SERVICE_ROLE_KEY to update DB

Other API folders
- app/api/donations (similar to checkout; handles one-off donations)
- app/api/orders (order listing / retrieval)
- app/api/*/verify, /search — helper endpoints used by the client UI

Implementation notes
- All server routes should use the server-side Supabase client in lib/supabase.js (SUPABASE_SERVICE_ROLE_KEY).
- Use WAVE_API_KEY server-side only. Never expose it to the client.
- Routes return JSON. For debugging, log full upstream request/response on server (remove verbose logs for production).