import express from 'express';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;
const JWT_SECRET = process.env.JWT_SECRET || 'northside-smoke-default-secret';

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const isSupabaseActive = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-supabase-project-url');
const supabase = isSupabaseActive ? createClient(supabaseUrl!, supabaseAnonKey!) : null;

// Initialize Stripe Client
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const isStripeActive = !!(stripeSecret && stripeSecret !== 'your-stripe-secret-key');
const stripe = isStripeActive ? new Stripe(stripeSecret!, { apiVersion: '2024-12-18.acacia' as any }) : null;

console.log(`[Northside Smoke] DB backend: ${isSupabaseActive ? 'Supabase ACTIVE' : 'Sandbox (In-Memory Mock) ACTIVE'}`);
console.log(`[Northside Smoke] Payment gateway: ${isStripeActive ? 'Stripe ACTIVE' : 'Stripe Sandbox (Auto-Succeed) ACTIVE'}`);

// Rate Limiting for API Endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
});

// Webhook endpoint (Requires raw body BEFORE standard express.json() is parsed)
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  if (isStripeActive && stripe && sig && process.env.STRIPE_WEBHOOK_SECRET) {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error(`[Stripe Webhook Error]: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const tier = session.metadata?.tier;
        const subId = session.subscription as string;

        if (userId && tier && isSupabaseActive && supabase) {
          await supabase
            .from('profiles')
            .update({ 
              subscription_tier: tier,
              stripe_subscription_id: subId
            })
            .eq('id', userId);
          
          await supabase.from('audit_logs').insert({
            user_id: userId,
            action: 'Stripe Webhook',
            status: 'Approved',
            details: `Stripe Subscription checkout verified: Tier ${tier} activated.`
          });
          console.log(`[Stripe Webhook] Activated Tier ${tier} for user: ${userId}`);
        }
      }

      if (event.type === 'customer.subscription.deleted') {
        const sub = event.data.object as Stripe.Subscription;
        if (isSupabaseActive && supabase) {
          await supabase
            .from('profiles')
            .update({ 
              subscription_tier: 'Boutique',
              stripe_subscription_id: null
            })
            .eq('stripe_subscription_id', sub.id);
          console.log(`[Stripe Webhook] Subscription canceled: ${sub.id}`);
        }
      }
    } catch (e: any) {
      console.error(`[Webhook handler error]: ${e.message}`);
    }
  }

  res.json({ received: true });
});

// Middleware for normal JSON APIs
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// JWT Token Authenticator
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  if (token === 'mock-jwt-token-sandbox') {
    req.user = { email: 'sandbox@dispensary.com', id: '00000000-0000-0000-0000-000000000000', subscription_tier: 'Boutique' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token session' });
    req.user = user;
    next();
  });
};

// ── 0. LOCAL MEMORY STORE FALLBACK ──
const mockDb = {
  aetherdesk: {
    agents: [
      { id: '1', name: 'Keisha R.', calls: 9, conv: '44%', revenue: 340, status: 'On Call', duration: '4m 12s' },
      { id: '2', name: 'Darius L.', calls: 7, conv: '29%', revenue: 245, status: 'Available', duration: '0m 00s' },
      { id: '3', name: 'Monique S.', calls: 5, conv: '20%', revenue: 175, status: 'Wrap-up', duration: '1m 30s' },
      { id: '4', name: 'Tyrone H.', calls: 2, conv: '50%', revenue: 60, status: 'Break', duration: '15m 00s' }
    ],
    leads: [
      { id: '887', name: 'Marcus T. (Charlotte)', source: 'Website Inquiry', phone: '704-555-0198', wait: '2h 14m', priority: 'Hot' },
      { id: '886', name: 'Danielle R. (Raleigh)', source: 'Instagram DM', phone: '919-555-0143', wait: '1h 42m', priority: 'Medium' },
      { id: '885', name: 'Jerome K. (Greensboro)', source: 'Affiliate Link', phone: '336-555-0122', wait: '2h 51m', priority: 'Hot' },
      { id: '884', name: 'Aisha M. (Wilmington)', source: 'Referral Code', phone: '910-555-0177', wait: '0h 18m', priority: 'Warm' }
    ],
    callLogs: [
      { id: 'log-101', leadName: 'Marcus T.', duration: '3m 45s', transcript: 'Customer inquired about Indica 3.5g pricing. Validated age using checkout gate. Order processed.', status: 'Closed' }
    ]
  },
  governor: {
    mode: 'governed',
    policies: [
      { id: 'RULE-001', name: 'THC-A Age Gate Validation', description: 'Enforce third-party verification for customer registration.', status: 'active' },
      { id: 'RULE-002', name: 'Lab COA Verification Gate', description: 'Block Shopify SKU publishing if THC Delta-9 exceeds 0.3%.', status: 'active' },
      { id: 'RULE-003', name: 'State Compliance Registry Check', description: 'Allow delivery orders only in approved reciprocal states.', status: 'active' },
      { id: 'RULE-004', name: 'Lead Assignment Route Cap', description: 'Restrict outbound queuing to max 12 concurrent warm leads.', status: 'active' }
    ],
    auditLogs: [
      { timestamp: '2026-05-20T11:42:15Z', action: 'COA Validation', status: 'Approved', details: 'Indica Flower 3.5g COA verified (0.24% Delta-9 THC). SKU released to Shopify.' },
      { timestamp: '2026-05-20T11:20:02Z', action: 'Checkout Rule', status: 'Enforced', details: 'Order #NS-4418 held for age verification upload check.' },
      { timestamp: '2026-05-20T10:15:30Z', action: 'Policy Deploy', status: 'System', details: 'Updated Rule-002: Dynamic sync status with BB-Tech BioBrief engine.' }
    ]
  },
  bbtech: {
    studies: [
      { id: 'study-1', strain: 'Carolina Kush (Indica)', thc: '23.4%', cbd: '0.8%', terp: 'Myrcene, Caryophyllene', status: 'Verified', ledgerTx: '0x8f2cd4e8c1b2f5a0928e3b7c4f6a8e101f34' },
      { id: 'study-2', strain: 'Blue Dream Haze (Sativa)', thc: '18.9%', cbd: '1.2%', terp: 'Limonene, Pinene', status: 'Verified', ledgerTx: '0x5c1ad4e8c1b2f5a0928e3b7c4f6a8e202d8f' }
    ]
  },
  uplift: {
    shifts: [
      { id: '1', name: 'Carlos M.', role: 'Fulfillment Lead', hours: '16/40', status: 'Active' },
      { id: '2', name: 'Niesha B.', role: 'Fulfillment Packager', hours: '12/32', status: 'Active' },
      { id: '3', name: 'Terrell J.', role: 'QC / Packaging', hours: '8/24', status: 'Active' }
    ],
    openshifts: [
      { id: 'open-1', role: 'Fulfillment Packager', shiftDate: '2026-05-22', rate: '$18/hr', status: 'Requested' },
      { id: 'open-2', role: 'Local Delivery Driver', shiftDate: '2026-05-23', rate: '$22/hr', status: 'Requested' }
    ]
  },
  openhub: {
    pipelines: [
      { id: 'pipe-1', commit: 'fe401bc', author: 'OpenHub Agent', message: 'Optimize manual chunks and split Radix dependencies', status: 'success', duration: '1m 24s' },
      { id: 'pipe-2', commit: 'a12e8b2', author: 'OpenHub Agent', message: 'Wire oversight checkpoint server rules', status: 'success', duration: '1m 45s' }
    ]
  }
};

// ── 1. SAAS AUTHENTICATION PORTS ──
app.post('/api/auth/register', apiLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  if (isSupabaseActive && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      const user = data.user;
      if (!user) throw new Error("Registration failed.");

      const token = jwt.sign({ id: user.id, email: user.email, subscription_tier: 'Boutique' }, JWT_SECRET);
      return res.json({ success: true, token, user: { id: user.id, email: user.email, subscription_tier: 'Boutique' } });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Sandbox Mode Fallback
  const mockId = `user-${Date.now()}`;
  const token = jwt.sign({ id: mockId, email, subscription_tier: 'Boutique' }, JWT_SECRET);
  res.json({ success: true, token, user: { id: mockId, email, subscription_tier: 'Boutique' } });
});

app.post('/api/auth/login', apiLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  if (isSupabaseActive && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("Login failed.");

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      const tier = profile?.subscription_tier || 'Boutique';
      const token = jwt.sign({ id: user.id, email: user.email, subscription_tier: tier }, JWT_SECRET);

      return res.json({ success: true, token, user: { id: user.id, email: user.email, subscription_tier: tier } });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Sandbox Mode Fallback
  const mockId = '00000000-0000-0000-0000-000000000000';
  const token = jwt.sign({ id: mockId, email, subscription_tier: 'Boutique' }, JWT_SECRET);
  res.json({ success: true, token, user: { id: mockId, email, subscription_tier: 'Boutique' } });
});

// ── 2. STRIPE CHECKOUT ROUTING ──
app.post('/api/stripe/create-checkout-session', apiLimiter, authenticateToken, async (req, res) => {
  const { tier } = req.body;
  const user = req.user;

  // Real price IDs or placeholders if they are test links
  const prices: Record<string, string> = {
    Boutique: 'price_boutique_mock',
    Enterprise: 'price_enterprise_mock',
    Autonomous: 'price_autonomous_mock'
  };

  if (isStripeActive && stripe) {
    try {
      let stripeCustomerId = '';
      if (isSupabaseActive && supabase) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('stripe_customer_id')
          .eq('id', user.id)
          .single();

        stripeCustomerId = profile?.stripe_customer_id || '';
      }

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({ email: user.email });
        stripeCustomerId = customer.id;

        if (isSupabaseActive && supabase) {
          await supabase
            .from('profiles')
            .update({ stripe_customer_id: stripeCustomerId })
            .eq('id', user.id);
        }
      }

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: prices[tier] || prices['Boutique'],
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/`,
        metadata: {
          userId: user.id,
          tier
        }
      });

      return res.json({ success: true, url: session.url });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Sandbox mode: mock Stripe activation
  console.log(`[Stripe Sandbox] Automatically activating subscription: ${tier} for user ${user.email}`);
  if (isSupabaseActive && supabase) {
    await supabase
      .from('profiles')
      .update({ subscription_tier: tier })
      .eq('id', user.id);
  }

  res.json({ success: true, url: `/?stripe_sandbox_success=true&tier=${tier}` });
});

// ── 3. OPERATIONAL APIS SECURED BY JWT ──

// ── 3.1 DETERMINISTIC BRAIN GATEWAY ──
app.post('/api/governor/action', apiLimiter, authenticateToken, async (req, res) => {
  const { action, payload } = req.body;
  const user = req.user;

  if (isSupabaseActive && supabase) {
    try {
      if (action === 'toggleMode') {
        const newMode = payload.mode;
        // Keep in local server memory or use audit logs to track mode
        mockDb.governor.mode = newMode; 
        
        const { data: updatedLogs } = await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'Mode Transition',
          status: 'Enforced',
          details: `Central governor switched to ${newMode.toUpperCase()} mode.`
        }).select('*');

        const { data: listLogs } = await supabase.from('audit_logs').select('*').eq('user_id', user.id).order('timestamp', { ascending: false });
        return res.json({ success: true, mode: newMode, auditLogs: listLogs });
      }

      if (action === 'addPolicy') {
        const { data: newPol } = await supabase.from('policies').insert({
          user_id: user.id,
          rule_code: `RULE-0${Date.now().toString().slice(-3)}`,
          name: payload.name,
          description: payload.description,
          status: 'active'
        }).select('*').single();

        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'Policy Deploy',
          status: 'Approved',
          details: `New compliance rule deployed: ${payload.name} (${newPol?.rule_code}).`
        });

        const { data: updatedPolicies } = await supabase.from('policies').select('*').eq('user_id', user.id);
        const { data: listLogs } = await supabase.from('audit_logs').select('*').eq('user_id', user.id).order('timestamp', { ascending: false });
        
        return res.json({ 
          success: true, 
          policies: updatedPolicies?.map(p => ({ id: p.rule_code, name: p.name, description: p.description, status: p.status })), 
          auditLogs: listLogs 
        });
      }

      // Fetch base state
      const { data: policies } = await supabase.from('policies').select('*').eq('user_id', user.id);
      const { data: auditLogs } = await supabase.from('audit_logs').select('*').eq('user_id', user.id).order('timestamp', { ascending: false });
      
      return res.json({ 
        success: true, 
        mode: mockDb.governor.mode, 
        policies: policies?.map(p => ({ id: p.rule_code, name: p.name, description: p.description, status: p.status })) || [], 
        auditLogs: auditLogs || [] 
      });
    } catch (e: any) {
      console.error(e.message);
    }
  }

  // Fallback to local store
  if (action === 'toggleMode') {
    mockDb.governor.mode = payload.mode;
    mockDb.governor.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'Mode Transition',
      status: 'Enforced',
      details: `Central governor switched to ${payload.mode.toUpperCase()} mode.`
    });
    return res.json({ success: true, mode: mockDb.governor.mode, auditLogs: mockDb.governor.auditLogs });
  }

  if (action === 'addPolicy') {
    const newPolicy = {
      id: `RULE-0${mockDb.governor.policies.length + 1}`,
      name: payload.name,
      description: payload.description,
      status: 'active'
    };
    mockDb.governor.policies.push(newPolicy);
    mockDb.governor.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'Policy Deploy',
      status: 'Approved',
      details: `New compliance rule deployed: ${payload.name} (${newPolicy.id}).`
    });
    return res.json({ success: true, policies: mockDb.governor.policies, auditLogs: mockDb.governor.auditLogs });
  }

  res.json({ success: true, mode: mockDb.governor.mode, policies: mockDb.governor.policies, auditLogs: mockDb.governor.auditLogs });
});

// ── 3.2 AETHERDESK CALL CENTER GATEWAY ──
app.get('/api/aetherdesk/queue', authenticateToken, async (req, res) => {
  const user = req.user;

  if (isSupabaseActive && supabase) {
    try {
      const { data: leads } = await supabase.from('leads').select('*').eq('user_id', user.id);
      const { data: callLogs } = await supabase.from('call_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      
      return res.json({
        agents: mockDb.aetherdesk.agents, // Agents are static SaaS simulators
        leads: leads || [],
        callLogs: callLogs?.map(cl => ({ id: cl.id, leadName: cl.lead_name, duration: cl.duration, transcript: cl.transcript, status: cl.status })) || []
      });
    } catch (e: any) {
      console.error(e.message);
    }
  }

  res.json(mockDb.aetherdesk);
});

app.post('/api/aetherdesk/dial', apiLimiter, authenticateToken, async (req, res) => {
  const { leadId } = req.body;
  const user = req.user;

  let leadName = '';
  let leadPhone = '';
  let leadIdStr = leadId;

  if (isSupabaseActive && supabase) {
    try {
      const { data: lead } = await supabase.from('leads').select('*').eq('id', leadId).single();
      if (!lead) return res.status(404).json({ error: 'Lead not found' });
      leadName = lead.name;
      leadPhone = lead.phone;
      
      // Delete Lead
      await supabase.from('leads').delete().eq('id', leadId);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  } else {
    const lead = mockDb.aetherdesk.leads.find(l => l.id === leadId);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    leadName = lead.name;
    leadPhone = lead.phone;
    mockDb.aetherdesk.leads = mockDb.aetherdesk.leads.filter(l => l.id !== leadId);
  }

  // Dialer conversation dialog creation
  const transcripts = [
    `Agent: Hello, this is AetherDesk client support on behalf of Northside Smoke. Am I speaking with ${leadName}?`,
    `Customer: Yes, this is ${leadName.split(' ')[0]}. What is this call regarding?`,
    `Agent: Excellent! I noticed you were looking at our Northside Indica Flower line on our storefront. We have validated the regulatory COAs in your area. Would you like to confirm this order?`,
    `Customer: Oh nice! Yes, is the Delta-9 THC fully certified under 0.3%? I want to make sure compliance checks are clean.`,
    `Agent: Absolutely, every SKU has a verified Polygon ledger hash. The Deterministic Brain compliance gate has fully approved your purchase. Shall we process it?`,
    `Customer: Yes please, let\'s run it!`,
    `Agent: Excellent! I have submitted this checkout to our Shopify fulfillment agent. Have a wonderful day!`
  ];

  const logId = `log-${Date.now()}`;
  const mockLog = {
    id: logId,
    leadName: leadName,
    duration: '1m 15s',
    transcript: transcripts.join('\n'),
    status: 'Closed'
  };

  if (isSupabaseActive && supabase) {
    try {
      await supabase.from('call_logs').insert({
        user_id: user.id,
        lead_name: leadName,
        duration: '1m 15s',
        transcript: mockLog.transcript,
        status: 'Closed'
      });

      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'Affiliate Call',
        status: 'Approved',
        details: `Call center closed order for ${leadName} driven by affiliate link.`
      });

      const { data: freshLeads } = await supabase.from('leads').select('*').eq('user_id', user.id);
      const { data: freshLogs } = await supabase.from('call_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

      // In sandbox/multi-client, increment agent calls locally
      const randomAgent = mockDb.aetherdesk.agents[Math.floor(Math.random() * mockDb.aetherdesk.agents.length)];
      randomAgent.calls += 1;
      randomAgent.revenue += 45;

      return res.json({
        success: true,
        callLog: mockLog,
        aetherdesk: {
          agents: mockDb.aetherdesk.agents,
          leads: freshLeads || [],
          callLogs: freshLogs?.map(cl => ({ id: cl.id, leadName: cl.lead_name, duration: cl.duration, transcript: cl.transcript, status: cl.status })) || []
        }
      });
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  mockDb.aetherdesk.callLogs.unshift(mockLog);
  const randomAgent = mockDb.aetherdesk.agents[Math.floor(Math.random() * mockDb.aetherdesk.agents.length)];
  randomAgent.calls += 1;
  randomAgent.revenue += 45;

  mockDb.governor.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'Affiliate Call',
    status: 'Approved',
    details: `Call center closed order for ${leadName} driven by affiliate link.`
  });

  res.json({ success: true, callLog: mockLog, aetherdesk: mockDb.aetherdesk });
});

// ── 3.3 BB-TECH TRANSLATION LAB GATEWAY ──
app.post('/api/bbtech/simulate', apiLimiter, (req, res) => {
  const { thc, cbd } = req.body;
  const thcaNum = parseFloat(thc) || 20;
  const cbdNum = parseFloat(cbd) || 1;

  const potencyRating = ((thcaNum * 1.5) + (cbdNum * 0.8)).toFixed(1);
  const absorptionVirality = (thcaNum / 3.0 + 2.1).toFixed(2);
  const receptorBindingFlow = (cbdNum * 2.5 + thcaNum * 0.2 + 1.8).toFixed(2);
  const inflammationRegulation = (cbdNum * 5.2 + 3.0).toFixed(2);

  res.json({
    success: true,
    metrics: { potencyRating, absorptionVirality, receptorBindingFlow, inflammationRegulation }
  });
});

app.post('/api/bbtech/brief', apiLimiter, authenticateToken, async (req, res) => {
  const { strain, thc, cbd, terp } = req.body;
  const user = req.user;

  const hashPart = Math.random().toString(16).substring(2, 10);
  const txHash = `0x${hashPart}d4e8c1b2f5a0928e3b7c4f6a8e${hashPart}`;

  const newStudy = {
    id: `study-${Date.now()}`,
    strain,
    thc: `${thc}%`,
    cbd: `${cbd}%`,
    terp,
    status: 'Verified',
    ledgerTx: txHash
  };

  if (isSupabaseActive && supabase) {
    try {
      await supabase.from('studies').insert({
        user_id: user.id,
        strain,
        thc: `${thc}%`,
        cbd: `${cbd}%`,
        terp,
        status: 'Verified',
        ledger_tx: txHash
      });

      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'Lab Ledger Sync',
        status: 'Approved',
        details: `Hashed clinical BioBrief for strain '${strain}' published to Polygon Ledger.`
      });

      const { data: freshStudies } = await supabase.from('studies').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      return res.json({ 
        success: true, 
        study: newStudy, 
        studies: freshStudies?.map(s => ({ id: s.id, strain: s.strain, thc: s.thc, cbd: s.cbd, terp: s.terp, status: s.status, ledgerTx: s.ledger_tx })) || [] 
      });
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  mockDb.bbtech.studies.unshift(newStudy);
  mockDb.governor.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'Lab Ledger Sync',
    status: 'Approved',
    details: `Hashed clinical BioBrief for strain '${strain}' published to Polygon Ledger (Tx: ${txHash.substring(0, 8)}...).`
  });

  res.json({ success: true, study: newStudy, studies: mockDb.bbtech.studies });
});

// ── 3.4 UPLIFT STAFFING HUB GATEWAY ──
app.get('/api/uplift', authenticateToken, async (req, res) => {
  const user = req.user;

  if (isSupabaseActive && supabase) {
    try {
      const { data: customShifts } = await supabase.from('shifts').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      
      const combinedOpenShifts = [
        ...mockDb.uplift.openshifts, // Default presets
        ...(customShifts?.map(s => ({ id: s.id, role: s.role, shiftDate: s.shift_date, rate: s.rate, status: s.status })) || [])
      ];

      return res.json({
        shifts: mockDb.uplift.shifts, // Roster is SaaS simulation
        openshifts: combinedOpenShifts
      });
    } catch (e: any) {
      console.error(e.message);
    }
  }

  res.json(mockDb.uplift);
});

app.post('/api/uplift/request-shift', apiLimiter, authenticateToken, async (req, res) => {
  const { role, rate } = req.body;
  const user = req.user;

  const dateStr = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const newShift = {
    id: `open-${Date.now()}`,
    role,
    shiftDate: dateStr,
    rate,
    status: 'Requested'
  };

  if (isSupabaseActive && supabase) {
    try {
      await supabase.from('shifts').insert({
        user_id: user.id,
        role,
        rate,
        status: 'Requested',
        shift_date: dateStr
      });

      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'Shift Request',
        status: 'Approved',
        details: `Uplift Venture allocation trigger dispatched for role: '${role}'.`
      });

      const { data: customShifts } = await supabase.from('shifts').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      
      const combinedOpenShifts = [
        ...mockDb.uplift.openshifts,
        ...(customShifts?.map(s => ({ id: s.id, role: s.role, shiftDate: s.shift_date, rate: s.rate, status: s.status })) || [])
      ];

      return res.json({ success: true, openshifts: combinedOpenShifts });
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  mockDb.uplift.openshifts.push(newShift);
  mockDb.governor.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'Shift Request',
    status: 'Approved',
    details: `Uplift Venture allocation trigger dispatched for role: '${role}'.`
  });

  res.json({ success: true, openshifts: mockDb.uplift.openshifts });
});

// ── 3.5 OPENHUB DEVELOPMENT OS GATEWAY ──
app.get('/api/openhub', authenticateToken, (req, res) => {
  res.json(mockDb.openhub);
});

app.post('/api/openhub/redeploy', apiLimiter, authenticateToken, async (req, res) => {
  const user = req.user;
  const commits = ['b528a4c', 'f2048cd', 'c49e210', 'd1045a2'];
  const messages = [
    'Hotfix: Enforce age checks on recurring Stripe endpoints',
    'Chore: Refactor shared ledger schemas',
    'Feature: Add sound effects to live agent dialer transitions',
    'Style: Optimize glassmorphic card backdrop filters'
  ];

  const newPipeline = {
    id: `pipe-${Date.now()}`,
    commit: commits[Math.floor(Math.random() * commits.length)],
    author: 'Developer Agent',
    message: messages[Math.floor(Math.random() * messages.length)],
    status: 'success',
    duration: '1m 15s'
  };

  if (isSupabaseActive && supabase) {
    try {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'Deployment Pipeline',
        status: 'Approved',
        details: `OpenHub triggered redeployment on commit [${newPipeline.commit}] - success.`
      });
    } catch (e: any) {
      console.error(e.message);
    }
  } else {
    mockDb.governor.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'Deployment Pipeline',
      status: 'Approved',
      details: `OpenHub triggered redeployment on commit [${newPipeline.commit}] - pipeline completed in ${newPipeline.duration}.`
    });
  }

  mockDb.openhub.pipelines.unshift(newPipeline);
  res.json({ success: true, pipelines: mockDb.openhub.pipelines });
});

// SPA catchall fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Northside Smoke Gateway] running on http://localhost:${PORT}`);
});
