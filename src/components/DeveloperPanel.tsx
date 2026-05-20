import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  RefreshCw, 
  CheckCircle, 
  Terminal, 
  AlertTriangle,
  Play
} from 'lucide-react';
import { Pipeline } from '../shared/mockData';

interface DeveloperPanelProps {
  pipelines: Pipeline[];
  onTriggerRedeploy: () => Promise<void>;
}

export const DeveloperPanel: React.FC<DeveloperPanelProps> = ({
  pipelines,
  onTriggerRedeploy
}) => {
  const [isDeploying, setIsDeploying] = useState(false);

  const handleRedeploy = async () => {
    setIsDeploying(true);
    setTimeout(async () => {
      await onTriggerRedeploy();
      setIsDeploying(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER */}
      <div>
        <h2 className="ns-serif-title" style={{ fontSize: '26px' }}>OpenHub Pipeline & Repos</h2>
        <p style={{ fontSize: '12px', color: 'var(--smoke-muted)' }}>
          Powered by OpenHub · Developer OS code repository pipelines & deployment oversight
        </p>
      </div>

      {/* PIPELINE OVERVIEW HEADER */}
      <div className="ns-glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-dark)', fontWeight: 600 }}>
            Active Repository Branch
          </span>
          <div className="ns-serif-title" style={{ fontSize: '20px', color: 'var(--smoke-white)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <GitBranch size={18} color="var(--gold)" />
            <span>main (production)</span>
          </div>
        </div>

        <button 
          onClick={handleRedeploy} 
          disabled={isDeploying}
          className="ns-button-luxury"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RefreshCw size={14} className={isDeploying ? 'animate-spin' : ''} />
          {isDeploying ? 'Deploying Pipeline...' : 'Trigger Repo Redeployment'}
        </button>
      </div>

      {/* TWO COLUMNS: DOCKER PIPELINE STATUS & TERMINAL CONSOLE LOGS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {/* REPO PIPELINES LOGS */}
        <div className="ns-glass-panel" style={{ padding: '24px' }}>
          <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            OpenHub Pipeline Commits History
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pipelines.map((pipe) => (
              <div key={pipe.id} style={{
                padding: '12px 16px',
                background: 'rgba(5, 13, 10, 0.4)',
                border: '0.5px solid var(--border-subtle)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '2px' }}>
                    <GitCommit size={14} color="var(--gold)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--smoke-white)' }}>
                      {pipe.message}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--smoke-muted)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <span>Author: {pipe.author}</span>
                      <span>•</span>
                      <span>Commit: <code style={{ color: 'var(--gold)' }}>[{pipe.commit}]</code></span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{
                    fontSize: '8px',
                    background: 'rgba(143, 201, 154, 0.08)',
                    color: 'var(--mint-green)',
                    border: '0.5px solid var(--mint-green)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {pipe.status}
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--smoke-muted)' }}>{pipe.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTAINER SHELL LOGS (MOCK TERMINAL TERMINOLOGY) */}
        <div className="ns-glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Terminal size={14} color="var(--gold)" />
            <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Docker Build Oversight Output
            </h3>
          </div>

          <div style={{
            background: '#020705',
            fontFamily: 'monospace',
            fontSize: '11px',
            color: 'var(--mint-green)',
            padding: '16px',
            borderRadius: '8px',
            minHeight: '260px',
            overflowY: 'auto',
            border: '0.5px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            lineHeight: 1.4
          }}>
            <div>$ npm run build --workspace=northside-smoke</div>
            <div style={{ color: 'var(--smoke-muted)' }}>&gt; tsc --noEmit</div>
            <div style={{ color: 'var(--smoke-muted)' }}>&gt; vite build</div>
            <div style={{ color: 'var(--smoke-white)' }}>vite v6.2.0 building for production...</div>
            <div>✓ 256 modules transformed.</div>
            <div style={{ color: 'var(--gold)' }}>dist/index.html                  0.80 kB │ gzip:  0.42 kB</div>
            <div style={{ color: 'var(--gold)' }}>dist/assets/vendor-react-b8a.js  240.2 kB │ gzip: 84.10 kB</div>
            <div style={{ color: 'var(--gold)' }}>dist/assets/vendor-ui-9f2.js     128.4 kB │ gzip: 42.12 kB</div>
            <div style={{ color: 'var(--gold)' }}>dist/assets/index-3e2.css        12.18 kB │ gzip:  3.40 kB</div>
            <div style={{ color: 'var(--smoke-white)' }}>✓ built in 1.24s</div>
            <div style={{ color: 'var(--smoke-white)', marginTop: '8px' }}>$ docker build -t billion-business/northside-smoke .</div>
            <div>[1/3] FROM node:20-alpine AS builder</div>
            <div>[2/3] COPY packages/ packages/</div>
            <div>[3/3] RUN npm prune --production</div>
            <div style={{ color: 'var(--smoke-white)' }}>Successfully built container: sha256:d8f24a1b02d8f921</div>
            <div style={{ color: 'var(--smoke-white)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="ns-pulse-ring" style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--mint-green)' }} />
              <span>Oversight pipeline: Status healthy (shadow mode listening)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
