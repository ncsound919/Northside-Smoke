export interface Metric {
  label: string;
  value: string;
  delta: string;
  status: 'green' | 'amber' | 'red' | 'neutral';
  trend: 'up' | 'down' | 'flat';
}

export interface Agent {
  id: string;
  name: string;
  calls: number;
  conv: string;
  revenue: number;
  status: string;
  duration: string;
}

export interface Lead {
  id: string;
  name: string;
  source: string;
  phone: string;
  wait: string;
  priority: 'Hot' | 'Medium' | 'Warm';
}

export interface CallLog {
  id: string;
  leadName: string;
  duration: string;
  transcript: string;
  status: string;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  status: string;
}

export interface AuditLog {
  timestamp: string;
  action: string;
  status: string;
  details: string;
}

export interface Study {
  id: string;
  strain: string;
  thc: string;
  cbd: string;
  terp: string;
  status: string;
  ledgerTx: string;
}

export interface Shift {
  id: string;
  name: string;
  role: string;
  hours: string;
  status: string;
}

export interface OpenShift {
  id: string;
  role: string;
  shiftDate: string;
  rate: string;
  status: string;
}

export interface Pipeline {
  id: string;
  commit: string;
  author: string;
  message: string;
  status: string;
  duration: string;
}

export const initialMetrics: Metric[] = [
  { label: "Today's Revenue", value: "$4,280", delta: "+18% vs yesterday", status: "green", trend: "up" },
  { label: "Pending Orders", value: "34", delta: "Avg 2.1h fulfill", status: "neutral", trend: "flat" },
  { label: "Call Center Leads", value: "12", delta: "3 uncontacted", status: "amber", trend: "down" },
  { label: "Active Agents", value: "6/8", delta: "2 idle, 0 down", status: "green", trend: "up" }
];

export const initialAgents: Agent[] = [
  { id: '1', name: 'Keisha R.', calls: 9, conv: '44%', revenue: 340, status: 'On Call', duration: '4m 12s' },
  { id: '2', name: 'Darius L.', calls: 7, conv: '29%', revenue: 245, status: 'Available', duration: '0m 00s' },
  { id: '3', name: 'Monique S.', calls: 5, conv: '20%', revenue: 175, status: 'Wrap-up', duration: '1m 30s' },
  { id: '4', name: 'Tyrone H.', calls: 2, conv: '50%', revenue: 60, status: 'Break', duration: '15m 00s' }
];

export const initialLeads: Lead[] = [
  { id: '887', name: 'Marcus T. (Charlotte)', source: 'Website Inquiry', phone: '704-555-0198', wait: '2h 14m', priority: 'Hot' },
  { id: '886', name: 'Danielle R. (Raleigh)', source: 'Instagram DM', phone: '919-555-0143', wait: '1h 42m', priority: 'Medium' },
  { id: '885', name: 'Jerome K. (Greensboro)', source: 'Affiliate Link', phone: '336-555-0122', wait: '2h 51m', priority: 'Hot' },
  { id: '884', name: 'Aisha M. (Wilmington)', source: 'Referral Code', phone: '910-555-0177', wait: '0h 18m', priority: 'Warm' }
];

export const initialCallLogs: CallLog[] = [
  { id: 'log-101', leadName: 'Marcus T.', duration: '3m 45s', transcript: 'Customer inquired about Indica 3.5g pricing. Validated age using checkout gate. Order processed.', status: 'Closed' }
];

export const initialPolicies: Policy[] = [
  { id: 'RULE-001', name: 'THC-A Age Gate Validation', description: 'Enforce third-party verification for customer registration.', status: 'active' },
  { id: 'RULE-002', name: 'Lab COA Verification Gate', description: 'Block Shopify SKU publishing if THC Delta-9 exceeds 0.3%.', status: 'active' },
  { id: 'RULE-003', name: 'State Compliance Registry Check', description: 'Allow delivery orders only in approved reciprocal states.', status: 'active' },
  { id: 'RULE-004', name: 'Lead Assignment Route Cap', description: 'Restrict outbound queuing to max 12 concurrent warm leads.', status: 'active' }
];

export const initialAuditLogs: AuditLog[] = [
  { timestamp: '2026-05-20T11:42:15Z', action: 'COA Validation', status: 'Approved', details: 'Indica Flower 3.5g COA verified (0.24% Delta-9 THC). SKU released to Shopify.' },
  { timestamp: '2026-05-20T11:20:02Z', action: 'Checkout Rule', status: 'Enforced', details: 'Order #NS-4418 held for age verification upload check.' },
  { timestamp: '2026-05-20T10:15:30Z', action: 'Policy Deploy', status: 'System', details: 'Updated Rule-002: Dynamic sync status with BB-Tech BioBrief engine.' }
];

export const initialStudies: Study[] = [
  { id: 'study-1', strain: 'Carolina Kush (Indica)', thc: '23.4%', cbd: '0.8%', terp: 'Myrcene, Caryophyllene', status: 'Verified', ledgerTx: '0x8f2cd4e8c1b2f5a0928e3b7c4f6a8e101f34' },
  { id: 'study-2', strain: 'Blue Dream Haze (Sativa)', thc: '18.9%', cbd: '1.2%', terp: 'Limonene, Pinene', status: 'Verified', ledgerTx: '0x5c1ad4e8c1b2f5a0928e3b7c4f6a8e202d8f' }
];

export const initialShifts: Shift[] = [
  { id: '1', name: 'Carlos M.', role: 'Fulfillment Lead', hours: '16/40', status: 'Active' },
  { id: '2', name: 'Niesha B.', role: 'Fulfillment Packager', hours: '12/32', status: 'Active' },
  { id: '3', name: 'Terrell J.', role: 'QC / Packaging', hours: '8/24', status: 'Active' }
];

export const initialOpenShifts: OpenShift[] = [
  { id: 'open-1', role: 'Fulfillment Packager', shiftDate: '2026-05-22', rate: '$18/hr', status: 'Requested' },
  { id: 'open-2', role: 'Local Delivery Driver', shiftDate: '2026-05-23', rate: '$22/hr', status: 'Requested' }
];

export const initialPipelines: Pipeline[] = [
  { id: 'pipe-1', commit: 'fe401bc', author: 'OpenHub Agent', message: 'Optimize manual chunks and split Radix dependencies', status: 'success', duration: '1m 24s' },
  { id: 'pipe-2', commit: 'a12e8b2', author: 'OpenHub Agent', message: 'Wire oversight checkpoint server rules', status: 'success', duration: '1m 45s' }
];
