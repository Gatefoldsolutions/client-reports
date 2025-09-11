'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const BRAND_NAME =
  process.env.NEXT_PUBLIC_BRAND_NAME || 'Client Portal';
const BRAND_PRIMARY =
  process.env.NEXT_PUBLIC_BRAND_COLOR || '#2271b1'; // WP blue
const BRAND_SUBTITLE =
  process.env.NEXT_PUBLIC_BRAND_SUBTITLE || 'Sign in to view your reports';

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const letters = parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '');
  return letters.join('') || 'CP';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [caps, setCaps] = useState(false);
  const [remember, setRemember] = useState(true);

  const pwdRef = useRef<HTMLInputElement | null>(null);
  const initials = useMemo(() => getInitials(BRAND_NAME), []);

  // Load remembered email
  useEffect(() => {
    const saved = localStorage.getItem('cp-email');
    if (saved) setEmail(saved);
  }, []);
  // Save remembered email
  useEffect(() => {
    if (remember) localStorage.setItem('cp-email', email);
    else localStorage.removeItem('cp-email');
  }, [email, remember]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setErr(null);
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next') || '/dashboard';

      const res = await fetch(`/api/login?next=${encodeURIComponent(next)}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.ok) {
        const { redirectTo } = await res.json();
        window.location.href = redirectTo || '/dashboard';
      } else {
        const { error } = await res.json().catch(() => ({}));
        setErr(error || 'Invalid email or password');
      }
    } catch {
      setErr('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function onKeyEvent(e: React.KeyboardEvent<HTMLInputElement>) {
    // simple caps detection
    const isLetter = e.key.length === 1 && /[a-z]/i.test(e.key);
    if (!isLetter) return;
    const capsOn = e.getModifierState && e.getModifierState('CapsLock');
    setCaps(!!capsOn);
  }

  // Styles
  const wrap: React.CSSProperties = {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: '#f0f0f1',
    padding: 16,
  };
  const cardWrap: React.CSSProperties = { width: 420, maxWidth: '92vw' };
  const logo: React.CSSProperties = {
    width: 88, height: 88, borderRadius: '50%',
    display: 'grid', placeItems: 'center',
    color: '#fff', fontWeight: 800, fontSize: 28,
    margin: '0 auto 14px',
    background: BRAND_PRIMARY,
    userSelect: 'none',
  };
  const title: React.CSSProperties = {
    textAlign: 'center',
    margin: '6px 0 20px',
    color: '#1d2327',
    lineHeight: 1.1,
  };
  const box: React.CSSProperties = {
    background: '#fff',
    padding: 24,
    borderRadius: 10,
    border: '1px solid #c3c4c7',
    boxShadow: '0 1px 3px rgba(0,0,0,.08)',
    overflow: 'hidden',
  };
  const label: React.CSSProperties = { display: 'block', margin: '12px 0 6px', color: '#1d2327', fontSize: 14 };
  const input: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    border: '1px solid #8c8f94',
    borderRadius: 6, fontSize: 14, outline: 'none',
    background: '#fff',  boxSizing: 'border-box', 
  };
  const row: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' };
  const pwdBox: React.CSSProperties = { position: 'relative' };
  const toggleBtn: React.CSSProperties = {
    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
    background: 'transparent', border: 0, cursor: 'pointer', color: '#3c434a',
    fontSize: 12, padding: '4px 6px',boxSizing: 'border-box', 
  };
  const help: React.CSSProperties = { fontSize: 12, color: '#3c434a' };
  const capsMsg: React.CSSProperties = { fontSize: 12, color: '#b32d2e', marginTop: 6 };
  const error: React.CSSProperties = {
    background: '#f7e0e1', border: '1px solid #b32d2e', color: '#872626',
    padding: '10px 12px', borderRadius: 6, fontSize: 13, marginTop: 10,
  };
  const btn: React.CSSProperties = {
    width: '100%', marginTop: 16, background: BRAND_PRIMARY,
    color: '#fff', border: 0, padding: '12px 14px', borderRadius: 6,
    cursor: 'pointer', fontWeight: 700, letterSpacing: 0.2,
    opacity: loading ? 0.8 : 1,
  };
  const footer: React.CSSProperties = {
    textAlign: 'center', marginTop: 10, fontSize: 12, color: '#616971',
  };

  return (
    <div style={wrap}>
      <div style={cardWrap}>
        <div style={logo} aria-hidden="true">{initials}</div>
        <div style={title}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{BRAND_NAME}</div>
          <div style={{ fontSize: 13, color: '#50575e', marginTop: 4 }}>{BRAND_SUBTITLE}</div>
        </div>

        <form onSubmit={onSubmit} style={box} aria-describedby={err ? 'error' : undefined}>
          <label style={label} htmlFor="email">Email</label>
          <input
            id="email"
            style={input}
            type="email"
            autoComplete="username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label style={label} htmlFor="password">Password</label>
          <div style={pwdBox}>
            <input
              id="password"
              ref={pwdRef}
              style={input}
              type={showPwd ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyUp={onKeyEvent}
              onKeyDown={onKeyEvent}
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
              aria-label={showPwd ? 'Hide password' : 'Show password'}
              style={toggleBtn}
            >
              {showPwd ? 'Hide' : 'Show'}
            </button>
          </div>

          {caps && <div style={capsMsg}>Caps Lock is on</div>}

          <div style={{ ...row, marginTop: 12 }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1d2327' }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                aria-label="Remember my email"
              />
              Remember me
            </label>

            <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12, color: BRAND_PRIMARY }}>
              Forgot password?
            </a>
          </div>

          {err && <div id="error" role="alert" style={error}>{err}</div>}

          <button type="submit" style={btn} disabled={loading}>
            {loading ? 'Signing in…' : 'Log In'}
          </button>
        </form>

        <div style={footer}>
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </div>
      </div>
    </div>
  );
}
