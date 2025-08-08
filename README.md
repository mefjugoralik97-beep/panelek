# Becken Panel (Next.js + API routes)

## Quick start

1. Copy `.env.example` to `.env` and fill `DATABASE_URL` and `JWT_SECRET`. Set `ALLOW_SETUP=true` for initial setup.
2. Deploy on Render / Vercel or run locally:
   - `npm install`
   - `npm run dev` (local)
3. To create admin and sources, call POST `/api/setup` (only when ALLOW_SETUP=true)
   - Example body: `{ "email":"admin@panel.pl", "password":"Admin123!", "name":"Administrator" }`
   - After setup, set `ALLOW_SETUP=false` in environment.
4. Open `/auth/login` and login as admin to access `/admin` or as driver for `/driver`.

