-- NORTHSIDE SMOKE ENTERPRISE SAAS DATABASE MIGRATION SCRIPT
-- Run this in the Supabase SQL Editor to set up all required tables and relationships.

-- 1. Profiles & Subscriptions
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    subscription_tier TEXT NOT NULL DEFAULT 'Boutique', -- Boutique, Enterprise, Autonomous
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to read their own profile" ON public.profiles 
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update their own profile" ON public.profiles 
    FOR UPDATE USING (auth.uid() = id);

-- 2. Call Center Leads
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    source TEXT NOT NULL,
    phone TEXT NOT NULL,
    wait TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('Hot', 'Medium', 'Warm')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leads access control" ON public.leads 
    USING (auth.uid() = user_id);

-- 3. Call Center Telephony Logs
CREATE TABLE IF NOT EXISTS public.call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lead_name TEXT NOT NULL,
    duration TEXT NOT NULL,
    transcript TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Call logs access control" ON public.call_logs 
    USING (auth.uid() = user_id);

-- 4. Biotech Clinical Studies
CREATE TABLE IF NOT EXISTS public.studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    strain TEXT NOT NULL,
    thc TEXT NOT NULL,
    cbd TEXT NOT NULL,
    terp TEXT NOT NULL,
    status TEXT NOT NULL,
    ledger_tx TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Studies access control" ON public.studies 
    USING (auth.uid() = user_id);

-- 5. Workforce Shift Allocations
CREATE TABLE IF NOT EXISTS public.shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    rate TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Requested',
    shift_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shifts access control" ON public.shifts 
    USING (auth.uid() = user_id);

-- 6. Compliance Policies (Deterministic Brain)
CREATE TABLE IF NOT EXISTS public.policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rule_code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Policies access control" ON public.policies 
    USING (auth.uid() = user_id);

-- 7. Audit Compliance Log Ticker
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    status TEXT NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Audit logs access control" ON public.audit_logs 
    USING (auth.uid() = user_id);

-- Triggers for profile auto-creation (hooks into Supabase Auth users table)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, subscription_tier)
    VALUES (new.id, new.email, 'Boutique');
    
    -- Insert default compliance policies
    INSERT INTO public.policies (user_id, rule_code, name, description, status) VALUES
    (new.id, 'RULE-001', 'THC-A Age Gate Validation', 'Enforce third-party verification for customer registration.', 'active'),
    (new.id, 'RULE-002', 'Lab COA Verification Gate', 'Block Shopify SKU publishing if THC Delta-9 exceeds 0.3%.', 'active'),
    (new.id, 'RULE-003', 'State Compliance Registry Check', 'Allow delivery orders only in approved reciprocal states.', 'active'),
    (new.id, 'RULE-004', 'Lead Assignment Route Cap', 'Restrict outbound queuing to max 12 concurrent warm leads.', 'active');

    -- Insert default lead queues
    INSERT INTO public.leads (user_id, name, source, phone, wait, priority) VALUES
    (new.id, 'Marcus T. (Charlotte)', 'Website Inquiry', '704-555-0198', '2h 14m', 'Hot'),
    (new.id, 'Danielle R. (Raleigh)', 'Instagram DM', '919-555-0143', '1h 42m', 'Medium'),
    (new.id, 'Jerome K. (Greensboro)', 'Affiliate Link', '336-555-0122', '2h 51m', 'Hot'),
    (new.id, 'Aisha M. (Wilmington)', 'Referral Code', '910-555-0177', '0h 18m', 'Warm');

    -- Insert initial audit log
    INSERT INTO public.audit_logs (user_id, action, status, details) VALUES
    (new.id, 'Workspace Provision', 'Approved', 'SaaS platform initialized. Default compliance policies and lead queues created.');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
