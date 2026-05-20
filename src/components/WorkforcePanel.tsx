import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  Cpu, 
  Activity, 
  Clock, 
  PlusCircle 
} from 'lucide-react';
import { Shift, OpenShift } from '../shared/mockData';

interface WorkforcePanelProps {
  shifts: Shift[];
  openshifts: OpenShift[];
  onRequestShift: (role: string, rate: string) => Promise<void>;
}

export const WorkforcePanel: React.FC<WorkforcePanelProps> = ({
  shifts,
  openshifts,
  onRequestShift
}) => {
  const [role, setRole] = useState('Fulfillment Packager');
  const [rate, setRate] = useState('$18/hr');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(async () => {
      await onRequestShift(role, rate);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER */}
      <div>
        <h2 className="ns-serif-title" style={{ fontSize: '26px' }}>Workforce Hub</h2>
        <p style={{ fontSize: '12px', color: 'var(--smoke-muted)' }}>
          Powered by Uplift Venture · Dynamic temp labor dispatch & autonomous agent statuses
        </p>
      </div>

      {/* AGENTIC WORKFORCE STATUS (AI CREW) */}
      <div className="ns-glass-panel" style={{ padding: '24px' }}>
        <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
          Autonomous AI Workers
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px'
        }}>
          {[
            { name: 'Shopify Agent', task: 'Processing orders, syncing inventory', time: '4h 12m', state: 'active' },
            { name: 'SEO Agent', task: 'Rewriting 12 product descriptions', time: '1h 44m', state: 'active' },
            { name: 'Email Agent', task: 'Post-purchase sequences, 5 queued', time: '0h 32m', state: 'active' },
            { name: 'COA Validator', task: 'Checking new supplier lab certs', time: '0h 08m', state: 'active' },
            { name: 'Pricing Agent', task: 'Monitoring competitor pricing lists', time: '18h ago', state: 'idle' },
            { name: 'Inventory Buyer', task: 'Awaiting balance allocation', time: 'Offline', state: 'off' }
          ].map((a, idx) => (
            <div key={idx} style={{
              padding: '12px 16px',
              background: 'rgba(5, 13, 10, 0.4)',
              border: '0.5px solid var(--border-subtle)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={14} color="var(--gold)" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--smoke-white)' }}>{a.name}</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--smoke-muted)', marginTop: '2px' }}>{a.task}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: a.state === 'active' ? 'var(--mint-green)' : a.state === 'idle' ? 'var(--amber-gold)' : 'var(--smoke-muted)',
                  boxShadow: a.state === 'active' ? '0 0 6px var(--mint-green)' : 'none'
                }} />
                <span style={{ fontSize: '9px', color: 'var(--gold-dark)' }}>{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DUAL COLUMN: STAFF ROSTER & DISPATCHER */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {/* ACTIVE TEMP STAFFING */}
        <div className="ns-glass-panel" style={{ padding: '24px' }}>
          <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Temp Staff Hours — This Week
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '0.5px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ paddingBottom: '10px', color: 'var(--gold-dark)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.10em' }}>Name</th>
                <th style={{ paddingBottom: '10px', color: 'var(--gold-dark)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.10em' }}>Role</th>
                <th style={{ paddingBottom: '10px', color: 'var(--gold-dark)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.10em' }}>Hours logged</th>
                <th style={{ paddingBottom: '10px', color: 'var(--gold-dark)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.10em' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift.id} style={{ borderBottom: '0.5px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--smoke-white)' }}>{shift.name}</td>
                  <td style={{ padding: '12px 0', color: 'var(--smoke-muted)' }}>{shift.role}</td>
                  <td style={{ padding: '12px 0', color: 'var(--gold)' }}>{shift.hours}</td>
                  <td style={{ padding: '12px 0' }}>
                    <span style={{
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'var(--mint-glow)',
                      color: 'var(--mint-green)',
                      border: '0.5px solid var(--mint-green)'
                    }}>
                      {shift.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* UPLIFT VENTURE DISPATCHER */}
        <div className="ns-glass-panel" style={{ padding: '24px' }}>
          <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Temp Staff Dispatcher
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--smoke-muted)' }}>Requested Shift Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="ns-input-luxury"
              >
                <option value="Fulfillment Packager">Fulfillment Packager</option>
                <option value="Local Delivery Driver">Local Delivery Driver</option>
                <option value="QC & Regulatory Assistant">QC & Regulatory Assistant</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--smoke-muted)' }}>Offered Hourly Rate</label>
              <select 
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="ns-input-luxury"
              >
                <option value="$18/hr">$18/hr (Standard)</option>
                <option value="$22/hr">$22/hr (Premium / Driver)</option>
                <option value="$26/hr">$26/hr (Specialist / QC)</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="ns-button-luxury"
              style={{
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <UserPlus size={14} />
              {isSubmitting ? 'Requesting Allocation...' : 'Request Temp Shift Allocation'}
            </button>
          </form>

          {/* Active open requests list */}
          <div style={{ marginTop: '20px', borderTop: '0.5px solid var(--border-subtle)', paddingTop: '16px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', marginBottom: '8px', fontWeight: 600 }}>
              Pending Uplift Requests
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {openshifts.map((req, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'rgba(5, 13, 10, 0.3)',
                  border: '0.5px solid var(--border-subtle)',
                  borderRadius: '6px',
                  fontSize: '11px'
                }}>
                  <div>
                    <span style={{ color: 'var(--smoke-white)', fontWeight: 600 }}>{req.role}</span>
                    <span style={{ color: 'var(--smoke-muted)', marginLeft: '8px' }}>({req.rate})</span>
                  </div>
                  <span style={{
                    fontSize: '8px',
                    color: 'var(--amber-gold)',
                    background: 'var(--amber-glow)',
                    border: '0.5px solid var(--amber-gold)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
