'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const valid = useMemo(() => {
    return isEmail(email) && password.trim().length >= 4;
  }, [email, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Invalid credentials');
      }
      router.push(next);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    document.getElementById('login-email')?.focus();
  }, []);

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'Client Reports';
  const subtitle = process.env.NEXT_PUBLIC_BRAND_SUBTITLE || 'Secure client access';

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        background: '#f9fafb', // light gray background
      }}
    >
      <div
        style={{
          width: 'min(92vw, 400px)',
          padding: '32px',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          background: '#fff', // white card
          boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
          fontFamily: 'ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica, Arial',
        }}
      >
        <h1
          style={{
            margin: '0 0 4px',
            fontSize: 22,
            color: 'var(--brand-color, #0f6abf)',
          }}
        >
          {brandName}
        </h1>
        <p style={{ margin: '0 0 20px', color: '#6b7280' }}>{subtitle}</p>

        <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: 14 }}>
 <input
  id="login-email"
  type="email"
  placeholder="Email"
  autoComplete="username"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  style={{
    padding: '12px 14px',
    borderRadius: 8,
    border: `1px solid ${email && !isEmail(email) ? '#ef4444' : '#d1d5db'}`,
    outline: 'none',
    fontSize: 14,
    background: '#fff',       // ✅ clean white
    color: '#111827',         // dark gray text for readability
  }}
/>

<input
  type="password"
  placeholder="Password"
  autoComplete="current-password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  minLength={4}
  style={{
    padding: '12px 14px',
    borderRadius: 8,
    border: `1px solid ${password && password.length < 4 ? '#ef4444' : '#d1d5db'}`,
    outline: 'none',
    fontSize: 14,
    background: '#fff',       // ✅ clean white
    color: '#111827',
  }}
/>

          <small style={{ color: '#9ca3af', fontSize: 12 }}>Minimum 4 characters</small>

          {err && (
            <div
              role="alert"
              style={{
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                padding: '10px 12px',
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              {err}
            </div>
          )}

          <button
            disabled={!valid || loading}
            style={{
              marginTop: 6,
              padding: '12px 14px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--brand-color, #0f6abf)',
              color: 'white',
              fontWeight: 600,
              fontSize: 15,
              cursor: (!valid || loading) ? 'not-allowed' : 'pointer',
              opacity: (!valid || loading) ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
