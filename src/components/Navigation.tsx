import React from 'react';
import { 
  LayoutDashboard, 
  Phone, 
  ShieldCheck, 
  FlaskConical, 
  Users, 
  GitBranch, 
  Settings,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard, section: 'Operations' },
    { id: 'callcenter', label: 'Call Center', icon: Phone, section: 'Operations' },
    { id: 'governor', label: 'Central Governor', icon: ShieldCheck, section: 'Compliance' },
    { id: 'biotech', label: 'Biotech & Studies', icon: FlaskConical, section: 'Research' },
    { id: 'workforce', label: 'Workforce Hub', icon: Users, section: 'Fulfillment' },
    { id: 'developer', label: 'OpenHub Pipeline', icon: GitBranch, section: 'Development' }
  ];

  return (
    <>
      {/* HEADER */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        borderBottom: '0.5px solid var(--border-subtle)',
        background: 'rgba(11, 28, 21, 0.85)',
        backdropFilter: 'var(--glass-backdrop)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--forest-bright), var(--gold-dark))',
            border: '1px solid var(--gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px var(--gold-glow)'
          }}>
            <Sparkles size={18} color="var(--gold)" />
          </div>
          <div>
            <h1 className="ns-serif-title" style={{ fontSize: '20px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Northside Smoke
            </h1>
            <div style={{
              fontSize: '9px',
              letterSpacing: '0.22em',
              color: 'var(--smoke-muted)',
              textTransform: 'uppercase',
              fontWeight: 300,
              marginTop: '1px'
            }}>
              Integrated Operations SaaS Platform
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(143, 201, 154, 0.08)',
            border: '0.5px solid var(--mint-green)',
            color: 'var(--mint-green)',
            fontSize: '10px',
            padding: '4px 12px',
            borderRadius: '20px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 500
          }}>
            <span className="ns-pulse-ring" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--mint-green)' }} />
            Live Ecosystem
          </div>
          <div 
            title="Terrence (COO)"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--forest-light), var(--gold-dark))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--smoke-white)',
              border: '1.5px solid var(--gold)',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
            }}
          >
            T
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        borderRight: '0.5px solid var(--border-subtle)',
        background: 'rgba(5, 13, 10, 0.75)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Sections grouped by categories */}
        {['Operations', 'Compliance', 'Research', 'Fulfillment', 'Development'].map(section => {
          const sectionItems = menuItems.filter(item => item.section === section);
          if (sectionItems.length === 0) return null;

          return (
            <div key={section} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{
                fontSize: '9px',
                letterSpacing: '0.2em',
                color: 'var(--gold-dark)',
                textTransform: 'uppercase',
                fontWeight: 600,
                paddingLeft: '10px',
                marginBottom: '6px'
              }}>
                {section}
              </div>

              {sectionItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontFamily: 'var(--font-sans)',
                      color: isActive ? 'var(--gold-light)' : 'var(--smoke-muted)',
                      background: isActive ? 'var(--gold-glow)' : 'transparent',
                      border: '0.5px solid',
                      borderColor: isActive ? 'var(--border-strong)' : 'transparent',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <Icon size={16} color={isActive ? 'var(--gold)' : 'var(--smoke-muted)'} />
                    <span style={{ fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                    {isActive && (
                      <div style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: 'var(--gold)',
                        marginLeft: 'auto',
                        boxShadow: '0 0 6px var(--gold)'
                      }} />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}

        {/* Brand footer settings placeholder */}
        <div style={{ marginTop: 'auto', borderTop: '0.5px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--smoke-muted)',
            fontSize: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'var(--font-sans)',
            width: '100%'
          }}>
            <Settings size={14} />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};
