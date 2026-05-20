import React, { useState, useEffect } from 'react';
import { Sparkles, Leaf } from 'lucide-react';

interface AgeGateProps {
  onVerified: () => void;
}

export const AgeGate: React.FC<AgeGateProps> = ({ onVerified }) => {
  const [birthDate, setBirthDate] = useState({ month: '', day: '', year: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    setError('');
    setIsLoading(true);

    const month = parseInt(birthDate.month);
    const day = parseInt(birthDate.day);
    const year = parseInt(birthDate.year);

    if (!month || !day || !year) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const birth = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age >= 21) {
      localStorage.setItem('northside-age-verified', 'true');
      localStorage.setItem('northside-verified-date', new Date().toISOString());
      onVerified();
    } else {
      setError('You must be 21 or older to enter');
    }
    setIsLoading(false);
  };

  const handleSkip = () => {
    localStorage.setItem('northside-age-verified', 'true');
    onVerified();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #0a1f15 0%, #1a2f25 50%, #0d1a12 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: 'rgba(20, 35, 28, 0.95)',
        border: '1px solid #2a4a3a',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '440px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 80px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          background: 'linear-gradient(135deg, #4a7c59, #2d5a3d)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          border: '2px solid #5a9c6f',
          boxShadow: '0 0 30px rgba(90, 156, 111, 0.3)'
        }}>
          <Leaf size={32} color="#8fc99a" />
        </div>

        <h1 style={{
          color: '#e8f5e9',
          fontSize: '28px',
          fontWeight: 600,
          marginBottom: '12px',
          letterSpacing: '0.02em'
        }}>
          NORTHSIDE SMOKE
        </h1>

        <p style={{
          color: '#8fc99a',
          fontSize: '15px',
          marginBottom: '32px',
          lineHeight: 1.6
        }}>
          You must be 21 years or older to enter.<br />
          Please verify your age to continue.
        </p>

        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          justifyContent: 'center'
        }}>
          <input
            type="text"
            placeholder="MM"
            value={birthDate.month}
            onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value })}
            style={{
              width: '60px',
              padding: '14px',
              background: '#1a2f25',
              border: '1px solid #3a5a4a',
              borderRadius: '8px',
              color: '#e8f5e9',
              fontSize: '16px',
              textAlign: 'center'
            }}
          />
          <input
            type="text"
            placeholder="DD"
            value={birthDate.day}
            onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value })}
            style={{
              width: '60px',
              padding: '14px',
              background: '#1a2f25',
              border: '1px solid #3a5a4a',
              borderRadius: '8px',
              color: '#e8f5e9',
              fontSize: '16px',
              textAlign: 'center'
            }}
          />
          <input
            type="text"
            placeholder="YYYY"
            value={birthDate.year}
            onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value })}
            style={{
              width: '90px',
              padding: '14px',
              background: '#1a2f25',
              border: '1px solid #3a5a4a',
              borderRadius: '8px',
              color: '#e8f5e9',
              fontSize: '16px',
              textAlign: 'center'
            }}
          />
        </div>

        {error && (
          <p style={{ color: '#ff6b6b', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleVerify}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #4a7c59, #3d6b4f)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'all 0.2s'
          }}
        >
          {isLoading ? 'Verifying...' : 'Enter Site'}
        </button>

        <button
          onClick={handleSkip}
          style={{
            background: 'none',
            border: 'none',
            color: '#5a7a6a',
            fontSize: '13px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}>
          I'm already 21+ (skip)
        </button>

        <p style={{
          color: '#4a5a4a',
          fontSize: '11px',
          marginTop: '32px'
        }}>
          By entering, you agree to our Terms of Service and Privacy Policy.
          Northside Smoke complies with all state and federal laws regarding cannabis.
        </p>
      </div>
    </div>
  );
};