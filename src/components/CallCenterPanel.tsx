import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneCall, 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Play,
  Check,
  Disc,
  MessageSquare
} from 'lucide-react';
import { Agent, Lead, CallLog } from '../shared/mockData';

interface CallCenterPanelProps {
  agents: Agent[];
  leads: Lead[];
  callLogs: CallLog[];
  onDialLead: (leadId: string) => Promise<void>;
  dialingLeadId: string | null;
  activeCallLog: CallLog | null;
  clearActiveCallLog: () => void;
}

export const CallCenterPanel: React.FC<CallCenterPanelProps> = ({
  agents,
  leads,
  callLogs,
  onDialLead,
  dialingLeadId,
  activeCallLog,
  clearActiveCallLog
}) => {
  const [dialingText, setDialingText] = useState('');
  const [dialStep, setDialStep] = useState(0);
  const [displayedTranscript, setDisplayedTranscript] = useState<string[]>([]);

  // Simulated calling steps & script animations
  useEffect(() => {
    if (!activeCallLog) {
      setDialStep(0);
      setDisplayedTranscript([]);
      return;
    }

    const scriptLines = activeCallLog.transcript.split('\n');
    let currentLine = 0;
    setDialStep(1); // Connecting...
    
    const ringTimer = setTimeout(() => {
      setDialStep(2); // Active Call...
      
      const interval = setInterval(() => {
        if (currentLine < scriptLines.length) {
          setDisplayedTranscript(prev => [...prev, scriptLines[currentLine]]);
          currentLine++;
        } else {
          clearInterval(interval);
          setDialStep(3); // Completed!
        }
      }, 2000);

      return () => clearInterval(interval);
    }, 1500);

    return () => clearTimeout(ringTimer);
  }, [activeCallLog]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER SECTION */}
      <div>
        <h2 className="ns-serif-title" style={{ fontSize: '26px' }}>Affiliate Call Center</h2>
        <p style={{ fontSize: '12px', color: 'var(--smoke-muted)' }}>
          Powered by AetherDesk · Real-time affiliate lead conversion & commission tracking
        </p>
      </div>

      {/* METRIC ROW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {[
          { label: 'Outbound Calls Today', val: '23', sub: '+6 vs yesterday', color: 'var(--gold)' },
          { label: 'Conversion Rate', val: '34%', sub: '8 Sales closed', color: 'var(--mint-green)' },
          { label: 'Uncontacted Leads', val: `${leads.length}`, sub: 'Hot queues waiting', color: leads.length > 2 ? 'var(--amber-gold)' : 'var(--mint-green)' },
          { label: 'Revenue Attributed', val: '$820', sub: '$87 average order', color: 'var(--gold)' }
        ].map((item, idx) => (
          <div key={idx} className="ns-glass-panel" style={{ padding: '16px 20px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--smoke-muted)' }}>{item.label}</span>
            <div className="ns-serif-title" style={{ fontSize: '28px', color: item.color, margin: '4px 0 2px' }}>{item.val}</div>
            <span style={{ fontSize: '10px', color: 'var(--smoke-muted)' }}>{item.sub}</span>
          </div>
        ))}
      </div>

      {/* ACTIVE CALL SIMULATOR WINDOW (GLOWS WHEN ACTIVE) */}
      {activeCallLog && (
        <div className="ns-glass-panel" style={{
          padding: '24px',
          border: '0.5px solid var(--gold)',
          boxShadow: '0 0 20px var(--gold-glow)',
          background: 'rgba(201,169,110,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Disc size={16} color={dialStep === 2 ? 'var(--ruby-red)' : 'var(--gold)'} className={dialStep === 2 ? 'animate-pulse' : ''} />
              <span className="ns-serif-title" style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {dialStep === 1 ? 'Connecting Outbound Link...' : dialStep === 2 ? 'Active Voice Session' : 'Call Log Hashed & Stored'}
              </span>
            </div>
            {dialStep === 3 && (
              <button onClick={clearActiveCallLog} className="ns-button-subtle" style={{ padding: '4px 10px', fontSize: '10px' }}>
                Clear Screen
              </button>
            )}
          </div>

          {/* TELEPHONY TRANSCRIPT SCREEN */}
          <div style={{
            background: 'rgba(5, 13, 10, 0.7)',
            border: '0.5px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '16px',
            minHeight: '140px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            {dialStep === 1 && (
              <div style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={12} className="animate-spin" />
                <span>Dialing lead #887 via AetherDesk Outbound SIP... [Ringing...]</span>
              </div>
            )}
            
            {displayedTranscript.map((line, idx) => {
              const isAgent = line.startsWith('Agent:');
              return (
                <div key={idx} style={{ 
                  color: isAgent ? 'var(--gold-light)' : 'var(--smoke-white)',
                  paddingLeft: isAgent ? '0' : '20px',
                  borderLeft: isAgent ? '2px solid var(--gold)' : '2px solid var(--mint-green)',
                  padding: '4px 8px'
                }}>
                  {line}
                </div>
              );
            })}

            {dialStep === 2 && displayedTranscript.length < activeCallLog.transcript.split('\n').length && (
              <div style={{ color: 'var(--smoke-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="ns-pulse-ring" style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)' }} />
                <span>AI Agent transcription sync in progress...</span>
              </div>
            )}

            {dialStep === 3 && (
              <div style={{ 
                color: 'var(--mint-green)', 
                marginTop: '10px', 
                borderTop: '0.5px solid rgba(143,201,154,0.2)', 
                paddingTop: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Check size={14} />
                <span>Call successfully archived. Attributed commission registered to Keisha R.!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEAD QUEUE & AGENTS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {/* OUTBOUND DIALER QUEUE */}
        <div className="ns-glass-panel" style={{ padding: '24px' }}>
          <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Outbound Lead Queue
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {leads.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--smoke-muted)', fontSize: '12px' }}>
                No active leads left in the queue. Excellent job!
              </div>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'rgba(5, 13, 10, 0.4)',
                  border: '0.5px solid var(--border-subtle)',
                  borderRadius: '8px'
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--smoke-white)' }}>
                      {lead.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--smoke-muted)', display: 'flex', gap: '10px', marginTop: '2px' }}>
                      <span>Source: {lead.source}</span>
                      <span>•</span>
                      <span>Wait: {lead.wait}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontSize: '9px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: lead.priority === 'Hot' ? 'var(--ruby-glow)' : lead.priority === 'Medium' ? 'var(--amber-glow)' : 'var(--cobalt-glow)',
                      color: lead.priority === 'Hot' ? 'var(--ruby-red)' : lead.priority === 'Medium' ? 'var(--amber-gold)' : 'var(--cobalt-blue)',
                      border: '0.5px solid',
                      borderColor: lead.priority === 'Hot' ? 'var(--ruby-red)' : lead.priority === 'Medium' ? 'var(--amber-gold)' : 'var(--cobalt-blue)'
                    }}>
                      {lead.priority}
                    </span>

                    <button
                      onClick={() => onDialLead(lead.id)}
                      disabled={dialingLeadId !== null}
                      className="ns-button-luxury"
                      style={{
                        padding: '6px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '9px'
                      }}
                    >
                      <PhoneCall size={10} />
                      Dial
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ACTIVE CALL AGENTS ROSTER */}
        <div className="ns-glass-panel" style={{ padding: '24px' }}>
          <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            AetherDesk Agent Status
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '0.5px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ paddingBottom: '10px', color: 'var(--gold-dark)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Agent</th>
                <th style={{ paddingBottom: '10px', color: 'var(--gold-dark)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Calls</th>
                <th style={{ paddingBottom: '10px', color: 'var(--gold-dark)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Conv.</th>
                <th style={{ paddingBottom: '10px', color: 'var(--gold-dark)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Revenue</th>
                <th style={{ paddingBottom: '10px', color: 'var(--gold-dark)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} style={{ borderBottom: '0.5px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '10px 0', fontWeight: 600, color: 'var(--smoke-white)' }}>{agent.name}</td>
                  <td style={{ padding: '10px 0', color: 'var(--smoke-muted)' }}>{agent.calls}</td>
                  <td style={{ padding: '10px 0', color: 'var(--mint-green)', fontWeight: 500 }}>{agent.conv}</td>
                  <td style={{ padding: '10px 0', color: 'var(--gold)' }}>${agent.revenue}</td>
                  <td style={{ padding: '10px 0' }}>
                    <span style={{
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: agent.status === 'On Call' ? 'var(--ruby-glow)' : agent.status === 'Available' ? 'var(--mint-glow)' : 'var(--amber-glow)',
                      color: agent.status === 'On Call' ? 'var(--ruby-red)' : agent.status === 'Available' ? 'var(--mint-green)' : 'var(--amber-gold)',
                      border: '0.5px solid',
                      borderColor: agent.status === 'On Call' ? 'var(--ruby-red)' : agent.status === 'Available' ? 'var(--mint-green)' : 'var(--amber-gold)'
                    }}>
                      {agent.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ATTRIBUTION LEDGER SUMMARY */}
      <div className="ns-glass-panel" style={{ padding: '24px' }}>
        <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
          Affiliate Attributed Campaigns
        </h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid var(--border-subtle)', textAlign: 'left' }}>
              <th style={{ paddingBottom: '10px', color: 'var(--gold-dark)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Affiliate Code</th>
              <th style={{ paddingBottom: '10px', color: 'var(--gold-dark)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Calls Driven</th>
              <th style={{ paddingBottom: '10px', color: 'var(--gold-dark)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Conversions</th>
              <th style={{ paddingBottom: '10px', color: 'var(--gold-dark)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Revenue</th>
              <th style={{ paddingBottom: '10px', color: 'var(--gold-dark)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Commission (10%)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { code: 'SMOKE20', calls: 8, conv: 4, rev: 380, comm: 38 },
              { code: 'NORTH15', calls: 6, conv: 2, rev: 210, comm: 21 },
              { code: 'SATIVA10', calls: 5, conv: 2, rev: 180, comm: 18 },
              { code: 'HAZE25', calls: 4, conv: 0, rev: 0, comm: 0 }
            ].map((c, i) => (
              <tr key={i} style={{ borderBottom: '0.5px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '10px 0', fontWeight: 600, color: 'var(--gold)' }}>{c.code}</td>
                <td style={{ padding: '10px 0', color: 'var(--smoke-white)' }}>{c.calls}</td>
                <td style={{ padding: '10px 0', color: 'var(--smoke-muted)' }}>{c.conv}</td>
                <td style={{ padding: '10px 0', color: 'var(--smoke-white)' }}>${c.rev || '—'}</td>
                <td style={{ padding: '10px 0', color: 'var(--mint-green)', fontWeight: 500 }}>{c.comm ? `$${c.comm}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
