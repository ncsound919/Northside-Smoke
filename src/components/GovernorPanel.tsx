import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  GitCommit, 
  PlusCircle, 
  ToggleLeft,
  CheckCircle,
  FileText,
  Activity
} from 'lucide-react';
import { Policy, AuditLog } from '../shared/mockData';

interface GovernorPanelProps {
  mode: string;
  policies: Policy[];
  auditLogs: AuditLog[];
  onToggleMode: (mode: string) => Promise<void>;
  onAddPolicy: (name: string, description: string) => Promise<void>;
}

export const GovernorPanel: React.FC<GovernorPanelProps> = ({
  mode,
  policies,
  auditLogs,
  onToggleMode,
  onAddPolicy
}) => {
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyDesc, setNewPolicyDesc] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  const handleSubmitPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicyName || !newPolicyDesc) return;
    
    setIsDeploying(true);
    // Simulate compilation latency
    setTimeout(async () => {
      await onAddPolicy(newPolicyName, newPolicyDesc);
      setNewPolicyName('');
      setNewPolicyDesc('');
      setIsDeploying(false);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER SECTION */}
      <div>
        <h2 className="ns-serif-title" style={{ fontSize: '26px' }}>Deterministic Brain Governor</h2>
        <p style={{ fontSize: '12px', color: 'var(--smoke-muted)' }}>
          System telemetry, policy engines, and central orchestration ledger
        </p>
      </div>

      {/* THREE MODE TOGGLER */}
      <div className="ns-glass-panel" style={{ padding: '24px', position: 'relative' }}>
        <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
          Governor Operational Mode
        </h3>

        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { id: 'shadow', name: 'Shadow Mode', desc: 'Observe & evaluate logs, no enforcement actions taken.' },
            { id: 'governed', name: 'Governed Mode', desc: 'Evaluate ecosystem policies, request human approvals on breach.' },
            { id: 'autonomous', name: 'Autonomous Mode', desc: '100% policy-governed execution, auto-heals and commits.' }
          ].map((m) => {
            const isSelected = mode === m.id;
            return (
              <div 
                key={m.id} 
                onClick={() => onToggleMode(m.id)}
                style={{
                  flex: 1,
                  padding: '20px',
                  background: isSelected ? 'var(--gold-glow)' : 'rgba(5, 13, 10, 0.4)',
                  border: isSelected ? '1px solid var(--gold)' : '0.5px solid var(--border-subtle)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: isSelected ? 'var(--gold-light)' : 'var(--smoke-white)' }}>
                    {m.name}
                  </span>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: isSelected ? 'var(--gold)' : 'transparent',
                    border: '1.5px solid var(--border-strong)',
                    boxShadow: isSelected ? '0 0 6px var(--gold)' : 'none'
                  }} />
                </div>
                <p style={{ fontSize: '11px', color: 'var(--smoke-muted)', lineHeight: 1.4 }}>
                  {m.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC PIPELINE ROUTER VISUALIZATION */}
      <div className="ns-glass-panel" style={{ padding: '24px' }}>
        <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
          Deterministic Routing Sequence
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 16px',
          background: 'rgba(5, 13, 10, 0.5)',
          border: '0.5px solid var(--border-subtle)',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {[
            { step: '1', title: 'Task Ingest', desc: 'Shopify Checkout / lead' },
            { step: '2', title: 'Policy Gate', desc: 'THC-A threshold match' },
            { step: '3', title: 'Ledger Audit', desc: 'BB-Tech COA verify' },
            { step: '4', title: 'Approved', desc: 'Fulfillment dispatched' }
          ].map((item, index) => (
            <React.Fragment key={index}>
              {/* Connector line between steps */}
              {index > 0 && (
                <div style={{
                  flex: 1,
                  height: '1px',
                  background: 'var(--gold-glow-strong)',
                  margin: '0 12px',
                  position: 'relative'
                }}>
                  <div className="ns-pulse-ring" style={{
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--gold)',
                    top: '-2.5px',
                    left: '50%'
                  }} />
                </div>
              )}

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                maxWidth: '130px',
                zIndex: 1
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--forest-light), var(--forest-bright))',
                  border: '1px solid var(--gold)',
                  color: 'var(--gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '8px',
                  boxShadow: '0 0 8px var(--gold-glow)'
                }}>
                  {item.step}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--smoke-white)' }}>{item.title}</div>
                <div style={{ fontSize: '10px', color: 'var(--smoke-muted)', marginTop: '2px', lineHeight: 1.2 }}>{item.desc}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* POLICY COMPILER & RULES TABLE */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {/* COMPLIANCE GATE POLICY REGISTER */}
        <div className="ns-glass-panel" style={{ padding: '24px' }}>
          <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Ecosystem Compliance Rules
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {policies.map((p) => (
              <div key={p.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(5, 13, 10, 0.4)',
                border: '0.5px solid var(--border-subtle)',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={14} color="var(--gold)" />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--smoke-white)' }}>{p.name}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--smoke-muted)', marginTop: '4px', lineHeight: 1.3 }}>
                    {p.description}
                  </p>
                </div>
                <span style={{
                  fontSize: '8px',
                  background: 'rgba(143, 201, 154, 0.08)',
                  color: 'var(--mint-green)',
                  border: '0.5px solid var(--mint-green)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* POLICY DEPLOYMENT TERMINAL */}
        <div className="ns-glass-panel" style={{ padding: '24px' }}>
          <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Deploy New Compliance Gate
          </h3>

          <form onSubmit={handleSubmitPolicy} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--smoke-muted)' }}>Rule Name</label>
              <input 
                type="text" 
                placeholder="e.g. NC THCA Regulatory Restriction" 
                value={newPolicyName}
                onChange={(e) => setNewPolicyName(e.target.value)}
                className="ns-input-luxury"
                required
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--smoke-muted)' }}>Description / Logic Spec</label>
              <textarea 
                placeholder="e.g. Reject shipping if shipping address matches NC county regulatory ban list." 
                value={newPolicyDesc}
                onChange={(e) => setNewPolicyDesc(e.target.value)}
                className="ns-input-luxury"
                style={{ minHeight: '60px', resize: 'vertical' }}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isDeploying}
              className="ns-button-luxury"
              style={{
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <PlusCircle size={14} />
              {isDeploying ? 'Deploying...' : 'Deploy Policy Rule'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
