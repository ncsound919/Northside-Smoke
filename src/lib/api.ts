const API_BASE = '/api';

async function fetchWithAuth(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  
  return response.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) => 
    fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email: string, password: string) => 
    fetchWithAuth('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  
  // Governor
  getGovernorState: () => fetchWithAuth('/governor/action'),
  toggleMode: (mode: string) => 
    fetchWithAuth('/governor/action', { method: 'POST', body: JSON.stringify({ action: 'toggleMode', payload: { mode } }) }),
  addPolicy: (name: string, description: string) => 
    fetchWithAuth('/governor/action', { method: 'POST', body: JSON.stringify({ action: 'addPolicy', payload: { name, description } }) }),
  
  // AetherDesk
  getAetherDeskQueue: () => fetchWithAuth('/aetherdesk/queue'),
  dialLead: (leadId: string) => 
    fetchWithAuth('/aetherdesk/dial', { method: 'POST', body: JSON.stringify({ leadId }) }),
  
  // BB-Tech
  getStudies: () => fetchWithAuth('/bbtech/brief'),
  generateBrief: (strain: string, thc: string, cbd: string, terp: string) => 
    fetchWithAuth('/bbtech/brief', { method: 'POST', body: JSON.stringify({ strain, thc, cbd, terp }) }),
  simulateLab: (thc: string, cbd: string) => 
    fetchWithAuth('/bbtech/simulate', { method: 'POST', body: JSON.stringify({ thc, cbd }) }),
  
  // Uplift
  getWorkforce: () => fetchWithAuth('/uplift'),
  requestShift: (role: string, rate: string) => 
    fetchWithAuth('/uplift/request-shift', { method: 'POST', body: JSON.stringify({ role, rate }) }),
  
  // OpenHub
  getPipelines: () => fetchWithAuth('/openhub'),
  redeploy: () => 
    fetchWithAuth('/openhub/redeploy', { method: 'POST' }),
  
  // Stripe
  createCheckout: (tier: string) => 
    fetchWithAuth('/stripe/create-checkout-session', { method: 'POST', body: JSON.stringify({ tier }) }),
};

export default api;