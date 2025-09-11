'use client';

export default function Dashboard() {
  const lookerUrl =
    process.env.NEXT_PUBLIC_LOOKER_EMBED_URL ||
    'https://lookerstudio.google.com/embed/reporting/a3943e8a-b1dc-44f1-82a2-28e2c38c65a0/page/T4YOB';

  const wrap: React.CSSProperties = { minHeight: '100vh', background: '#f0f0f1', padding: 16 };
  const topbar: React.CSSProperties = {
    background: '#1d2327', color: '#fff', padding: '12px 16px', borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,
  };
  const btn: React.CSSProperties = { background: '#dc3232', border: 0, color: '#fff', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' };

  async function logout() { await fetch('/api/logout', { method: 'POST' }); window.location.href = '/login'; }

  return (
    <div style={wrap}>
      <div style={topbar}>
        <div style={{ fontWeight: 600 }}>📊 Client Reports</div>
        <button style={btn} onClick={logout}>Log out</button>
      </div>
      <div style={{ background: '#fff', border: '1px solid #c3c4c7', borderRadius: 8, overflow: 'hidden' }}>
        <iframe
          title="Looker Studio Report"
          src={lookerUrl}
          style={{ width: '100%', height: 'calc(100vh - 100px)', border: 0 }}
          frameBorder={0}
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
