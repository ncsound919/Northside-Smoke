import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { CommandCenter } from './components/CommandCenter';
import { CallCenterPanel } from './components/CallCenterPanel';
import { GovernorPanel } from './components/GovernorPanel';
import { BiotechLabPanel } from './components/BiotechLabPanel';
import { WorkforcePanel } from './components/WorkforcePanel';
import { DeveloperPanel } from './components/DeveloperPanel';
import { Sparkles, Loader2 } from 'lucide-react';

import {
  initialMetrics,
  initialAgents,
  initialLeads,
  initialCallLogs,
  initialPolicies,
  initialAuditLogs,
  initialStudies,
  initialShifts,
  initialOpenShifts,
  initialPipelines,
  Metric,
  Agent,
  Lead,
  CallLog,
  Policy,
  AuditLog,
  Study,
  Shift,
  OpenShift,
  Pipeline
} from './shared/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Unified State
  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [callLogs, setCallLogs] = useState<CallLog[]>(initialCallLogs);
  const [mode, setMode] = useState<string>('governed');
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [studies, setStudies] = useState<Study[]>(initialStudies);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [openshifts, setOpenshifts] = useState<OpenShift[]>(initialOpenShifts);
  const [pipelines, setPipelines] = useState<Pipeline[]>(initialPipelines);

  // Dialer Simulator States
  const [dialingLeadId, setDialingLeadId] = useState<string | null>(null);
  const [activeCallLog, setActiveCallLog] = useState<CallLog | null>(null);

  // Sync state helpers
  const fetchGovernor = async () => {
    try {
      const res = await fetch('/api/governor/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.success) {
        if (data.mode) setMode(data.mode);
        if (data.policies) setPolicies(data.policies);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
      }
    } catch (e) {
      console.warn("Could not fetch governor state, using client-side fallback.");
    }
  };

  const fetchAetherDesk = async () => {
    try {
      const res = await fetch('/api/aetherdesk/queue');
      const data = await res.json();
      if (data.agents) setAgents(data.agents);
      if (data.leads) setLeads(data.leads);
      if (data.callLogs) setCallLogs(data.callLogs);
    } catch (e) {
      console.warn("Could not fetch AetherDesk state, using client-side fallback.");
    }
  };

  const fetchUplift = async () => {
    try {
      const res = await fetch('/api/uplift');
      const data = await res.json();
      if (data.shifts) setShifts(data.shifts);
      if (data.openshifts) setOpenshifts(data.openshifts);
    } catch (e) {
      console.warn("Could not fetch Uplift state, using client-side fallback.");
    }
  };

  const fetchOpenHub = async () => {
    try {
      const res = await fetch('/api/openhub');
      const data = await res.json();
      if (data.pipelines) setPipelines(data.pipelines);
    } catch (e) {
      console.warn("Could not fetch OpenHub state, using client-side fallback.");
    }
  };

  const refreshAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchGovernor(),
      fetchAetherDesk(),
      fetchUplift(),
      fetchOpenHub()
    ]);
    
    // Dynamically calculate metrics based on synced state lengths
    setMetrics([
      { label: "Today's Revenue", value: `$${4280 + (initialLeads.length - leads.length) * 45}`, delta: "+18% vs yesterday", status: "green", trend: "up" },
      { label: "Pending Orders", value: `${34 - (initialLeads.length - leads.length)}`, delta: "Avg 2.1h fulfill", status: "neutral", trend: "flat" },
      { label: "Call Center Leads", value: `${leads.length}`, delta: `${leads.length > 2 ? leads.length - 2 : 0} uncontacted`, status: leads.length > 2 ? "amber" : "green", trend: "down" },
      { label: "Active Agents", value: `${agents.length}/${agents.length + 2}`, delta: "2 idle, 0 down", status: "green", trend: "up" }
    ]);

    setIsLoading(false);
  };

  // Initial Sync
  useEffect(() => {
    const init = async () => {
      await refreshAllData();
      setIsInitializing(false);
    };
    init();
  }, [leads.length, agents.length]);

  // Operations Handlers
  const handleDialLead = async (leadId: string) => {
    setDialingLeadId(leadId);
    try {
      const res = await fetch('/api/aetherdesk/dial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId })
      });
      const data = await res.json();
      if (data.success) {
        setActiveCallLog(data.callLog);
        setLeads(data.aetherdesk.leads);
        setAgents(data.aetherdesk.agents);
        setCallLogs(data.aetherdesk.callLogs);
        await fetchGovernor();
      }
    } catch (e) {
      // Offline fallback: simulate dialing locally
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        const mockLog: CallLog = {
          id: `log-${Date.now()}`,
          leadName: lead.name,
          duration: '1m 15s',
          transcript: `Agent: Hello, this is AetherDesk client support on behalf of Northside Smoke. Am I speaking with ${lead.name}?\nCustomer: Yes, this is ${lead.name.split(' ')[0]}. What is this call regarding?\nAgent: Excellent! I noticed you were looking at our Northside Indica Flower line. Shall we process it?\nCustomer: Yes please, let's run it!\nAgent: Excellent! I have submitted this checkout to our Shopify fulfillment agent. Have a wonderful day!`,
          status: 'Closed'
        };
        setActiveCallLog(mockLog);
        setLeads(prev => prev.filter(l => l.id !== leadId));
        setCallLogs(prev => [mockLog, ...prev]);
        setAgents(prev => prev.map((a, i) => i === 0 ? { ...a, calls: a.calls + 1, revenue: a.revenue + 45 } : a));
        setAuditLogs(prev => [
          {
            timestamp: new Date().toISOString(),
            action: 'Affiliate Call',
            status: 'Approved',
            details: `[Fallback] Call center closed order for ${lead.name} driven by affiliate link.`
          },
          ...prev
        ]);
      }
    } finally {
      setDialingLeadId(null);
    }
  };

  const handleToggleMode = async (newMode: string) => {
    try {
      const res = await fetch('/api/governor/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleMode', payload: { mode: newMode } })
      });
      const data = await res.json();
      if (data.success) {
        setMode(data.mode);
        setAuditLogs(data.auditLogs);
      }
    } catch (e) {
      // Local fallback
      setMode(newMode);
      setAuditLogs(prev => [
        {
          timestamp: new Date().toISOString(),
          action: 'Mode Transition',
          status: 'Enforced',
          details: `[Fallback] Central governor switched to ${newMode.toUpperCase()} mode.`
        },
        ...prev
      ]);
    }
  };

  const handleAddPolicy = async (name: string, description: string) => {
    try {
      const res = await fetch('/api/governor/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addPolicy', payload: { name, description } })
      });
      const data = await res.json();
      if (data.success) {
        setPolicies(data.policies);
        setAuditLogs(data.auditLogs);
      }
    } catch (e) {
      // Local fallback
      const newPol: Policy = {
        id: `RULE-0${policies.length + 1}`,
        name,
        description,
        status: 'active'
      };
      setPolicies(prev => [...prev, newPol]);
      setAuditLogs(prev => [
        {
          timestamp: new Date().toISOString(),
          action: 'Policy Deploy',
          status: 'Approved',
          details: `[Fallback] New compliance rule deployed: ${name} (${newPol.id}).`
        },
        ...prev
      ]);
    }
  };

  const handleGenerateBrief = async (strain: string, thc: string, cbd: string, terp: string) => {
    try {
      const res = await fetch('/api/bbtech/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strain, thc, cbd, terp })
      });
      const data = await res.json();
      if (data.success) {
        setStudies(data.studies);
        await fetchGovernor();
      }
    } catch (e) {
      // Local fallback
      const hashPart = Math.random().toString(16).substring(2, 10);
      const txHash = `0x${hashPart}d4e8c1b2f5a0928e3b7c4f6a8e${hashPart}`;
      const newStudy: Study = {
        id: `study-${Date.now()}`,
        strain,
        thc: `${thc}%`,
        cbd: `${cbd}%`,
        terp,
        status: 'Verified',
        ledgerTx: txHash
      };
      setStudies(prev => [newStudy, ...prev]);
      setAuditLogs(prev => [
        {
          timestamp: new Date().toISOString(),
          action: 'Lab Ledger Sync',
          status: 'Approved',
          details: `[Fallback] Hashed clinical BioBrief for '${strain}' published to Polygon Ledger (Tx: ${txHash.substring(0, 8)}...).`
        },
        ...prev
      ]);
    }
  };

  const handleRequestShift = async (role: string, rate: string) => {
    try {
      const res = await fetch('/api/uplift/request-shift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, rate })
      });
      const data = await res.json();
      if (data.success) {
        setOpenshifts(data.openshifts);
        await fetchGovernor();
      }
    } catch (e) {
      // Local fallback
      const newShift: OpenShift = {
        id: `open-${Date.now()}`,
        role,
        shiftDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        rate,
        status: 'Requested'
      };
      setOpenshifts(prev => [...prev, newShift]);
      setAuditLogs(prev => [
        {
          timestamp: new Date().toISOString(),
          action: 'Shift Request',
          status: 'Approved',
          details: `[Fallback] Uplift Venture allocation trigger dispatched for role: '${role}'.`
        },
        ...prev
      ]);
    }
  };

  const handleTriggerRedeploy = async () => {
    try {
      const res = await fetch('/api/openhub/redeploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setPipelines(data.pipelines);
        await fetchGovernor();
      }
    } catch (e) {
      // Local fallback
      const commits = ['b528a4c', 'f2048cd', 'c49e210', 'd1045a2'];
      const messages = [
        'Hotfix: Enforce age checks on recurring Stripe endpoints',
        'Chore: Refactor shared ledger schemas',
        'Feature: Add sound effects to live agent dialer transitions',
        'Style: Optimize glassmorphic card backdrop filters'
      ];
      const newPipe: Pipeline = {
        id: `pipe-${Date.now()}`,
        commit: commits[Math.floor(Math.random() * commits.length)],
        author: 'Developer Agent',
        message: messages[Math.floor(Math.random() * messages.length)],
        status: 'success',
        duration: '1m 15s'
      };
      setPipelines(prev => [newPipe, ...prev]);
      setAuditLogs(prev => [
        {
          timestamp: new Date().toISOString(),
          action: 'Deployment Pipeline',
          status: 'Approved',
          details: `[Fallback] OpenHub triggered redeployment on commit [${newPipe.commit}].`
        },
        ...prev
      ]);
    }
  };

  // Rendering Loader during Initial Setup
  if (isInitializing) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, var(--forest-mid), var(--forest-deep))',
        color: 'var(--smoke-white)',
        gap: '20px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '2px solid var(--border-subtle)',
          borderTopColor: 'var(--gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px var(--gold-glow)',
          animation: 'spin 1.5s linear infinite'
        }}>
          <Sparkles size={24} color="var(--gold)" />
        </div>
        <div>
          <h1 className="ns-serif-title" style={{ fontSize: '24px', letterSpacing: '0.12em', textAlign: 'center' }}>
            Northside Smoke
          </h1>
          <p style={{ fontSize: '11px', color: 'var(--smoke-muted)', letterSpacing: '0.22em', marginTop: '6px', textAlign: 'center', textTransform: 'uppercase' }}>
            Connecting Unified Enterprise Core...
          </p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="ns-wrap" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Dynamic Ambient Background Shader */}
      <div className="ns-smoke-background" />

      {/* Main Content Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Navigation Sidebar & Header (Navigation internally handles both sidebar button renders and header logos) */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Content Panel Frame */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px 40px',
          position: 'relative'
        }}>
          {activeTab === 'overview' && (
            <CommandCenter
              metrics={metrics}
              auditLogs={auditLogs}
              policies={policies}
              onTriggerAudit={refreshAllData}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'callcenter' && (
            <CallCenterPanel
              agents={agents}
              leads={leads}
              callLogs={callLogs}
              onDialLead={handleDialLead}
              dialingLeadId={dialingLeadId}
              activeCallLog={activeCallLog}
              clearActiveCallLog={() => setActiveCallLog(null)}
            />
          )}

          {activeTab === 'governor' && (
            <GovernorPanel
              mode={mode}
              policies={policies}
              auditLogs={auditLogs}
              onToggleMode={handleToggleMode}
              onAddPolicy={handleAddPolicy}
            />
          )}

          {activeTab === 'biotech' && (
            <BiotechLabPanel
              studies={studies}
              onGenerateBrief={handleGenerateBrief}
            />
          )}

          {activeTab === 'workforce' && (
            <WorkforcePanel
              shifts={shifts}
              openshifts={openshifts}
              onRequestShift={handleRequestShift}
            />
          )}

          {activeTab === 'developer' && (
            <DeveloperPanel
              pipelines={pipelines}
              onTriggerRedeploy={handleTriggerRedeploy}
            />
          )}
        </main>
      </div>
    </div>
  );
}
