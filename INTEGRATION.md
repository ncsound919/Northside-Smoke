# Northside Smoke Integration Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vercel)                        │
│                    https://northside-smoke.vercel.app          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                 │
│  │  Stripe  │◄───│ Express  │◄───│ Supabase │                │
│  │  Checkout│    │   API    │    │ Database │                │
│  └──────────┘    └──────────┘    └──────────┘                 │
│       │                │                │                      │
│       ▼                ▼                ▼                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    WEBHOOK HANDLER                        │  │
│  │  - checkout.session.completed                              │  │
│  │  - customer.subscription.deleted                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Supabase Integration

### 1.1 Database Schema

```sql
-- Run in Supabase SQL Editor
-- supabase_migration.sql already exists, but here are key tables:

-- Users/Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT DEFAULT 'Boutique',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Tracking (AetherDesk)
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  phone TEXT,
  source TEXT,
  priority TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call Logs
CREATE TABLE call_logs (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  lead_name TEXT,
  duration TEXT,
  transcript TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance Policies
CREATE TABLE policies (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  rule_code TEXT,
  name TEXT,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  status TEXT,
  details TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biotech Studies
CREATE TABLE studies (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  strain TEXT,
  thc TEXT,
  cbd TEXT,
  terp TEXT,
  status TEXT DEFAULT 'Verified',
  ledger_tx TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workforce Shifts
CREATE TABLE shifts (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  role TEXT,
  shift_date DATE,
  rate TEXT,
  status TEXT DEFAULT 'Requested',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.2 Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
# Get from: Supabase Dashboard → Settings → API
```

### 1.3 Client Initialization

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 1.4 RLS Policies (Row Level Security)

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Similar policies for other tables
```

---

## 2. Stripe Integration

### 2.1 Stripe Dashboard Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create API keys (Secret Key)
3. Create Webhook endpoint: `https://your-domain.com/api/stripe/webhook`
4. Get Webhook signing secret

### 2.2 Environment Variables

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
# Get from: Stripe Dashboard → Developers → API Keys
```

### 2.3 Subscription Tiers

```typescript
// server.ts
const prices: Record<string, string> = {
  Boutique: 'price_boutique_monthly_id',
  Enterprise: 'price_enterprise_monthly_id',
  Autonomous: 'price_autonomous_monthly_id',
};
// Create in: Stripe Dashboard → Products → Create Product
```

### 2.4 Webhook Handler

```typescript
// server.ts - already implemented
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  
  if (event.type === 'checkout.session.completed') {
    // Update user subscription in Supabase
  }
  
  if (event.type === 'customer.subscription.deleted') {
    // Downgrade user to free tier
  }
});
```

---

## 3. Vercel Deployment

### 3.1 Deploy Steps

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo:
# 1. Go to https://vercel.com
# 2. Import GitHub repository
# 3. Add environment variables
# 4. Deploy
```

### 3.2 Environment Variables (Vercel)

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
JWT_SECRET=your-secure-jwt-secret
ALLOWED_ORIGINS=https://northside-smoke.vercel.app
```

### 3.3 Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/server.ts" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 3.4 Serverless Functions (Alternative)

For Vercel serverless, convert `server.ts` to Vercel API routes:

```
/api
├── auth
│   ├── login.ts
│   └── register.ts
├── stripe
│   ├── webhook.ts
│   └── checkout.ts
├── governor
│   └── action.ts
├── aetherdesk
│   ├── queue.ts
│   └── dial.ts
└── [...].ts  # Catch-all
```

---

## 4. Integration Checklist

### Supabase
- [ ] Create Supabase project
- [ ] Run migration SQL
- [ ] Configure RLS policies
- [ ] Add environment variables to Vercel

### Stripe
- [ ] Create Stripe account
- [ ] Get API keys
- [ ] Create subscription products
- [ ] Configure webhooks
- [ ] Add environment variables to Vercel

### Vercel
- [ ] Connect GitHub repository
- [ ] Add all environment variables
- [ ] Deploy application
- [ ] Test production URL

---

## 5. Production Checklist

- [ ] Enable RLS on all tables
- [ ] Use real Stripe keys (not test)
- [ ] Set production JWT_SECRET
- [ ] Configure CORS allowed origins
- [ ] Set up custom domain (optional)
- [ ] Enable Stripe webhook verification
- [ ] Test checkout flow end-to-end
- [ ] Verify webhook updates database

---

## 6. Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Add domain to `ALLOWED_ORIGINS` |
| Webhook not working | Check Stripe webhook URL is correct |
| RLS blocking inserts | Check user is authenticated |
| Build failing | Check all env vars are set |

### Testing Webhooks Locally

```bash
# Use Stripe CLI
stripe listen --forward-to localhost:3005/api/stripe/webhook
```

---

## 7. Security Notes

- Never commit Stripe secret keys
- Use environment variables for all secrets
- Enable RLS on all tables
- Validate all API inputs with Zod
- Use Helmet middleware
- Configure CORS properly