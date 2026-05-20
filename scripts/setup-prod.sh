#!/bin/bash
# Northside Smoke Production Setup Script
# Run this after deploying to Vercel

echo "=== Northside Smoke Production Setup ==="
echo ""

# Set your environment variables in Vercel dashboard or CLI
# Below are the commands to set them via Vercel CLI

echo "Step 1: Setting Environment Variables in Vercel..."
echo ""

# Replace these with your actual values
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production  
vercel env add VITE_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add JWT_SECRET production
vercel env add ALLOWED_ORIGINS production

echo "Step 2: Redeploying with environment variables..."
vercel --prod

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Run supabase_migration.sql in Supabase SQL Editor"
echo "2. Configure Stripe webhook: https://your-domain.com/api/stripe/webhook"
echo "3. Test the application end-to-end"