import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Zap, 
  ShieldAlert, 
  DollarSign, 
  CheckCircle2, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { Metric, AuditLog, Policy } from '../shared/mockData';

interface CommandCenterProps {
  metrics: Metric[];
  auditLogs: AuditLog[];
  policies: Policy[];
  onTriggerAudit: () => void;
  isLoading: boolean;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  metrics,
  auditLogs,
  policies,
  onTriggerAudit,
  isLoading
}) => {
  const weeklyData = [
    { day: 'Mon', value: 45, label: '$2.1k' },
    { day: 'Tue', value: 62, label: '$2.9k' },
    { day: 'Wed', value: 38, label: '$1.8k' },
    { day: 'Thu', value: 80, label: '$3.8k' },
    { day: 'Fri', value: 91, label: '$4.3k', highlight: true },
    { day: 'Sat', value: 55, label: '$2.6k' },
    { day: 'Sun', value: 30, label: '$1.4k' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 className="ns-serif-title" style={{ fontSize: '26px' }}>Command Center</h2>
          <p style={{ fontSize: '12px', color: 'var(--smoke-muted)' }}>
            Ecosystem overview · Live integration gateway telemetry
          </p>
        </div>
        <button 
          onClick={onTriggerAudit} 
          disabled={isLoading}
          className="ns-button-subtle" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'Running Audit...' : 'Re-Run System Audit'}
        </button>
      </div>

      {/* METRIC GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {metrics.map((metric, i) => {
          let accentColor = 'var(--gold)';
          if (metric.status === 'green') accentColor = 'var(--mint-green)';
          if (metric.status === 'amber') accentColor = 'var(--amber-gold)';
          if (metric.status === 'red') accentColor = 'var(--ruby-red)';

          return (
            <div key={i} className="ns-glass-panel" style={{
              padding: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Highlight Top Border Sweep */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: accentColor,
                opacity: 0.7
              }} />

              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--smoke-muted)', marginBottom: '8px' }}>
                {metric.label}
              </div>
              <div className="ns-serif-title" style={{ fontSize: '32px', color: 'var(--smoke-white)', lineHeight: 1, marginBottom: '6px' }}>
                {metric.value}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: metric.status === 'red' ? 'var(--ruby-red)' : 'var(--mint-green)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {metric.status === 'green' ? <TrendingUp size={12} /> : <Clock size={12} />}
                {metric.delta}
              </div>
            </div>
          );
        })}
      </div>

      {/* MID SECTION GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {/* REVENUE GRAPH */}
        <div className="ns-glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Weekly Revenue Velocity
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--smoke-muted)' }}>MTD: $68.4k</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '110px', paddingBottom: '10px' }}>
            {weeklyData.map((data, idx) => (
              <div key={idx} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                height: '100%'
              }}>
                <div style={{
                  width: '100%',
                  height: `${data.value}%`,
                  background: data.highlight 
                    ? 'linear-gradient(to top, var(--gold-dark), var(--gold))' 
                    : 'linear-gradient(to top, var(--forest-light), var(--forest-bright))',
                  border: '0.5px solid',
                  borderColor: data.highlight ? 'var(--gold)' : 'var(--border-subtle)',
                  borderRadius: '4px 4px 0 0',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }} title={`${data.day}: ${data.label}`}>
                  {data.highlight && (
                    <div style={{
                      position: 'absolute',
                      top: '-16px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '9px',
                      color: 'var(--gold)',
                      fontWeight: 600
                    }}>
                      ★
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '10px', color: 'var(--smoke-muted)' }}>{data.day}</span>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '0.5px solid var(--border-subtle)',
            fontSize: '11px',
            color: 'var(--smoke-muted)'
          }}>
            <span>Attributed Sales: <strong style={{ color: 'var(--gold)' }}>$26,840</strong></span>
            <span>Target: <strong style={{ color: 'var(--smoke-white)' }}>$30k</strong></span>
          </div>
        </div>

        {/* ECOSYSTEM ROSTER */}
        <div className="ns-glass-panel" style={{ padding: '24px' }}>
          <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Sister Venture Integrations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'Deterministic Brain', desc: 'Central Governor FastAPI API', port: ':8000', status: 'Online', policyCount: `${policies.length} Active` },
              { name: 'AetherDesk Telephony', desc: 'Affiliate Outbound Dialer API', port: ':5000', status: 'Online', policyCount: '4 Active Agents' },
              { name: 'BB-Tech Research Core', desc: 'Cannabinoid translation analytics', port: ':5001', status: 'Online', policyCount: 'Ledger active' },
              { name: 'Uplift Workforce OS', desc: 'Temp allocation sync service', port: ':3000', status: 'Online', policyCount: '3 active packers' },
              { name: 'OpenHub Pipelines', desc: 'Developer deployment server', port: ':3002', status: 'Online', policyCount: 'Oversight shadow' }
            ].map((v, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'rgba(5, 13, 10, 0.4)',
                border: '0.5px solid var(--border-subtle)',
                borderRadius: '6px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--smoke-white)' }}>{v.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--smoke-muted)' }}>{v.desc} <code style={{ color: 'var(--gold)', fontSize: '9px' }}>{v.port}</code></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--smoke-muted)' }}>{v.policyCount}</span>
                  <span style={{
                    fontSize: '9px',
                    color: 'var(--mint-green)',
                    background: 'rgba(143, 201, 154, 0.1)',
                    border: '0.5px solid var(--mint-green)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    ● {v.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SYSTEM AUDIT TELEMETRY */}
      <div className="ns-glass-panel" style={{ padding: '24px', background: 'rgba(201,169,110,0.02)', border: '0.5px solid var(--border-strong)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} color="var(--gold)" />
            <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              System Compliance Ledger
            </h3>
          </div>
          <span style={{
            fontSize: '9px',
            background: 'var(--gold-glow)',
            border: '0.5px solid var(--border-strong)',
            color: 'var(--gold)',
            padding: '2px 8px',
            borderRadius: '10px',
            textTransform: 'uppercase'
          }}>
            Validated by Deterministic Brain
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Overall Security Score', val: '98/100', state: 'green', desc: 'Age-gate & COA active' },
            { label: 'Active Compliance Rules', val: `${policies.length}`, state: 'neutral', desc: 'Syncing ecosystem' },
            { label: 'Reciprocal States', val: '38 Approved', state: 'green', desc: 'Delivery routing ready' }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(5, 13, 10, 0.5)',
              border: '0.5px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '12px 16px'
            }}>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--smoke-muted)' }}>{item.label}</span>
              <div className="ns-serif-title" style={{ fontSize: '20px', margin: '4px 0 2px', color: item.state === 'green' ? 'var(--mint-green)' : 'var(--smoke-white)' }}>{item.val}</div>
              <span style={{ fontSize: '10px', color: 'var(--smoke-muted)' }}>{item.desc}</span>
            </div>
          ))}
        </div>

        {/* Dynamic Audit Logs Ticker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', marginBottom: '4px', fontWeight: 600 }}>
            Recent Audit Ticker Logs
          </div>
          {auditLogs.slice(0, 4).map((log, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '8px 10px',
              background: 'rgba(5,13,10,0.3)',
              borderBottom: '0.5px solid rgba(201,169,110,0.06)',
              fontSize: '12px'
            }}>
              <span style={{
                fontSize: '8px',
                textTransform: 'uppercase',
                padding: '2px 6px',
                borderRadius: '4px',
                background: log.status === 'Approved' ? 'rgba(143, 201, 154, 0.1)' : 'rgba(224, 149, 80, 0.1)',
                border: '0.5px solid',
                borderColor: log.status === 'Approved' ? 'var(--mint-green)' : 'var(--amber-gold)',
                color: log.status === 'Approved' ? 'var(--mint-green)' : 'var(--amber-gold)',
                marginTop: '2px'
              }}>
                {log.status}
              </span>
              <div style={{ flex: 1 }}>
                <span style={{ color: 'var(--smoke-white)', fontWeight: 600 }}>{log.action}: </span>
                <span style={{ color: 'var(--smoke-muted)' }}>{log.details}</span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--gold-dark)' }}>
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
