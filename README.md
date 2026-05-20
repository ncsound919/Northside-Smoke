# Northside Smoke 🌿

A premium cannabis dispensary SaaS dashboard with compliance-first architecture, affiliate call center integration, and biotech lab management.

## Features

- **Command Center** — Real-time revenue metrics and analytics
- **Affiliate Call Center (AetherDesk)** — AI-powered lead conversion and commission tracking
- **Biotech Lab (BB-Tech)** — Strain certification and Polygon ledger verification
- **Workforce Management (Uplift)** — Shift scheduling and fulfillment team coordination
- **Governance Mode** — Compliance rule enforcement and audit logging

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, TailwindCSS, Radix UI
- **Backend:** Express.js, Supabase (PostgreSQL), Stripe
- **Authentication:** JWT with role-based access

## Prerequisites

- Node.js 20+
- npm 9+

## Installation

```bash
# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe Billing Integration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-signing-secret
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# JWT Authentication
JWT_SECRET=your-jwt-auth-secret-key-change-this-in-production

# Server Configuration
PORT=3005

# CORS (comma-separated origins)
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

## Development

```bash
# Start frontend dev server
npm run dev

# Start backend server (in separate terminal)
npm run dev:server
```

## Build

```bash
npm run build
```

Production artifacts will be in the `dist/` folder.

## Deployment

### Build & Start

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t northside-smoke .
docker run -p 3005:3005 northside-smoke
```

## Compliance

This application includes age verification gates and compliance measures required for cannabis product sales. Ensure all local regulations are met before deployment.

## License

Proprietary — All rights reserved.