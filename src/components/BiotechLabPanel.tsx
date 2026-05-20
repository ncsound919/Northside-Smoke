import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Dribbble, 
  Cpu, 
  Binary, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Database,
  Sliders
} from 'lucide-react';
import { Study } from '../shared/mockData';

interface BiotechLabPanelProps {
  studies: Study[];
  onGenerateBrief: (strain: string, thc: string, cbd: string, terp: string) => Promise<void>;
}

export const BiotechLabPanel: React.FC<BiotechLabPanelProps> = ({ studies, onGenerateBrief }) => {
  const [strainName, setStrainName] = useState('Apex Indica V2');
  const [thca, setThca] = useState('24');
  const [cbd, setCbd] = useState('1.2');
  const [terpene, setTerpene] = useState('Myrcene, Caryophyllene');
  
  const [potencyRating, setPotencyRating] = useState('37.0');
  const [absorption, setAbsorption] = useState('10.10');
  const [receptor, setReceptor] = useState('7.00');
  const [immune, setImmune] = useState('9.24');
  const [isCompiling, setIsCompiling] = useState(false);

  // Re-simulate metrics in real-time as sliders drag!
  useEffect(() => {
    const thcNum = parseFloat(thca) || 20;
    const cbdNum = parseFloat(cbd) || 1;

    // Simulate formula calculation (matches Express server logic!)
    const pot = ((thcNum * 1.5) + (cbdNum * 0.8)).toFixed(1);
    const abs = (thcNum / 3.0 + 2.1).toFixed(2);
    const rec = (cbdNum * 2.5 + thcNum * 0.2 + 1.8).toFixed(2);
    const imm = (cbdNum * 5.2 + 3.0).toFixed(2);

    setPotencyRating(pot);
    setAbsorption(abs);
    setReceptor(rec);
    setImmune(imm);
  }, [thca, cbd]);

  const handleGenerateBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompiling(true);
    setTimeout(async () => {
      await onGenerateBrief(strainName, thca, cbd, terpene);
      setIsCompiling(false);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER */}
      <div>
        <h2 className="ns-serif-title" style={{ fontSize: '26px' }}>Biotech Lab & THC-A Studies</h2>
        <p style={{ fontSize: '12px', color: 'var(--smoke-muted)' }}>
          Powered by BB-Tech · Systems Biology translation engine & Polygon Ledger ledger tracking
        </p>
      </div>

      {/* METRIC CARD MAPPINGS (BASKETBALL BIOLOGY MODEL) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {[
          { label: 'potency Codex TER', val: potencyRating, desc: 'Basketball PER equivalent for cannabinoid potency score.', color: 'var(--gold)' },
          { label: 'Steph Curry Virality', val: absorption, desc: 'Absorption virality rate (spacing gravity model).', color: 'var(--mint-green)' },
          { label: 'Jokic CNS Binding Flow', val: receptor, desc: 'Network hub receptor flow and binding efficiency.', color: 'var(--cobalt-blue)' },
          { label: 'Draymond Immunotherapy', val: immune, desc: 'Inflammatory cytokine regulation score (D-Rating).', color: 'var(--amber-gold)' }
        ].map((item, idx) => (
          <div key={idx} className="ns-glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--smoke-muted)' }}>{item.label}</span>
            <div className="ns-serif-title" style={{ fontSize: '32px', color: item.color, lineHeight: 1 }}>{item.val}</div>
            <p style={{ fontSize: '11px', color: 'var(--smoke-muted)', lineHeight: 1.3 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* DUAL COLUMN: SLIDERS COMPILER & LEDGER ARCHIVE */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {/* INTERACTIVE COMPILER SLIDERS */}
        <div className="ns-glass-panel" style={{ padding: '24px' }}>
          <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Strain Chromatograph Compiler
          </h3>

          <form onSubmit={handleGenerateBrief} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--smoke-muted)' }}>Strain Identification Label</label>
              <input 
                type="text" 
                value={strainName}
                onChange={(e) => setStrainName(e.target.value)}
                className="ns-input-luxury"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color: 'var(--smoke-muted)' }}>THC-A Concentration Range</span>
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{thca}%</span>
              </div>
              <input 
                type="range" 
                min="15" 
                max="35" 
                step="0.5"
                value={thca}
                onChange={(e) => setThca(e.target.value)}
                className="ns-luxury-slider"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color: 'var(--smoke-muted)' }}>CBD Potency Balance</span>
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{cbd}%</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="5.0" 
                step="0.1"
                value={cbd}
                onChange={(e) => setCbd(e.target.value)}
                className="ns-luxury-slider"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--smoke-muted)' }}>Terpene Profiles</label>
              <select 
                value={terpene}
                onChange={(e) => setTerpene(e.target.value)}
                className="ns-input-luxury"
              >
                <option value="Myrcene, Caryophyllene">Myrcene, Caryophyllene (Relaxation / Muscular)</option>
                <option value="Limonene, Pinene">Limonene, Pinene (CNS Focus / Anti-inflammatory)</option>
                <option value="Linalool, Humulene">Linalool, Humulene (Immune regulation / Calm)</option>
                <option value="Terpinolene, Myrcene">Terpinolene, Myrcene (Uptake speed / Energizing)</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={isCompiling}
              className="ns-button-luxury"
              style={{
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <FileText size={14} />
              {isCompiling ? 'Compiling Hashed Brief...' : 'Publish BioBrief Study to Ledger'}
            </button>
          </form>
        </div>

        {/* LEDGER COMPLIANCE STUDS ARCHIVE */}
        <div className="ns-glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="ns-serif-title" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Ledger-Logged BioBriefs
            </h3>
            <span style={{ fontSize: '9px', color: 'var(--mint-green)', background: 'var(--mint-glow)', padding: '2px 8px', borderRadius: '4px' }}>
              Immutable Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {studies.map((study) => (
              <div key={study.id} style={{
                padding: '12px 16px',
                background: 'rgba(5, 13, 10, 0.4)',
                border: '0.5px solid var(--border-subtle)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={12} color="var(--mint-green)" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--smoke-white)' }}>{study.strain}</span>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--gold)' }}>THC: {study.thc}</span>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--smoke-muted)' }}>
                  Terpenes: {study.terp} | CBD: {study.cbd || '0.8%'}
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  borderTop: '0.5px solid rgba(201,169,110,0.06)', 
                  paddingTop: '6px',
                  marginTop: '4px',
                  fontFamily: 'monospace',
                  fontSize: '9px',
                  color: 'var(--gold-dark)'
                }}>
                  <Database size={10} />
                  <span>Polygon TX: {study.ledgerTx}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
