# IRONLOG — Deployment Guide

## You need: a browser. That's it. Everything is free.

---

## STEP 1 — Create Supabase project (2 min)

1. Go to **https://supabase.com** → Sign up (free, use GitHub login)
2. Click **"New Project"**
3. Name it `ironlog`, pick a strong database password, choose a region near you
4. Wait ~1 minute for it to spin up

## STEP 2 — Create the database tables (1 min)

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase-setup.sql` from this project
4. Copy-paste the ENTIRE contents into the SQL editor
5. Click **"Run"** → You should see "Success" messages

## STEP 3 — Get your API keys (30 sec)

1. Click **Settings** (gear icon, left sidebar) → **API**
2. Copy these two values:
   - **Project URL** → looks like `https://abcdefg.supabase.co`
   - **anon public** key → long string starting with `eyJ...`

## STEP 4 — Disable email confirmation (optional, recommended)

By default Supabase requires email confirmation. To skip this for easier use:

1. Go to **Authentication** → **Providers** → **Email**
2. Toggle OFF **"Confirm email"**
3. Click **Save**

(If you leave it ON, you'll need to check your email and click the confirm link after signing up)

## STEP 5 — Deploy to Vercel (3 min)

### Option A: Deploy from GitHub (recommended)

1. Create a GitHub repo and push this folder to it:
   ```bash
   cd ironlog
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/ironlog.git
   git push -u origin main
   ```

2. Go to **https://vercel.com** → Sign up with GitHub (free)
3. Click **"Add New Project"** → Import your `ironlog` repo
4. In the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL` = your Project URL from Step 3
   - `VITE_SUPABASE_ANON_KEY` = your anon key from Step 3
5. Click **Deploy** → Wait ~1 minute

### Option B: Deploy via Vercel CLI

1. Install: `npm i -g vercel`
2. Create a `.env` file from `.env.example` with your real keys
3. Run:
   ```bash
   cd ironlog
   npm install
   npm run build
   vercel --prod
   ```
4. Add environment variables in Vercel dashboard after first deploy

## STEP 6 — You're live!

Your app is now at: `https://ironlog-XXXXX.vercel.app`

You can rename it to a custom subdomain like `ironlog.vercel.app` in:
Vercel Dashboard → Your project → Settings → Domains

---

## How it works

| Feature | How it's stored |
|---------|----------------|
| Login/Signup | Supabase Auth (real email + password) |
| Workouts | Supabase `workouts` table (syncs across devices) |
| Notes | Supabase `notes` table (syncs across devices) |
| Security | Row Level Security — each user sees only their data |

## Local development

```bash
cp .env.example .env
# Fill in your Supabase URL and anon key in .env

npm install
npm run dev
# Opens at http://localhost:5173
```

## Cost

- **Supabase free tier**: 50,000 rows, 500MB storage, unlimited API requests
- **Vercel free tier**: 100GB bandwidth/month, automatic HTTPS
- **Total cost**: $0/month for personal use
