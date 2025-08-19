# Environment variables

Create `.env.local` (development) or set env vars in Vercel for production.

Required (server-side)
- SUPABASE_URL=https://<project>.supabase.co
- SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # server only
- WAVE_API_KEY=<wave-secret-key>                 # server only

Optional / client
- NEXT_PUBLIC_APP_URL=http://localhost:3000
- NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>      # only if frontend needs direct Supabase read access

Recommendations
- Never commit secret keys.
- On Vercel, add the keys to Project Settings → Environment Variables.
- For local development, create `.env.local` at project root:
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  SUPABASE_URL=...
  SUPABASE_SERVICE_ROLE_KEY=...
  WAVE_API_KEY=...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...