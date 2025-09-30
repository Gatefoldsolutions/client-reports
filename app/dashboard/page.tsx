
export default function Dashboard() {
  const src = process.env.NEXT_PUBLIC_LOOKER_EMBED_URL;
  return (
    <main style={{ padding: 24 }}>
      <h1>{process.env.NEXT_PUBLIC_BRAND_NAME || 'Dashboard'}</h1>
      <p style={{ opacity: 0.7 }}>{process.env.NEXT_PUBLIC_BRAND_SUBTITLE || ''}</p>
      <form method="post" action="/api/logout">
        <button style={{ margin: '8px 0' }}>Log out</button>
      </form>
      {!src ? (
        <p style={{ color: 'crimson' }}>NEXT_PUBLIC_LOOKER_EMBED_URL is not set.</p>
      ) : (
        <iframe src={src} style={{ width: '100%', height: '80vh', border: 0 }} />
      )}
    </main>
  );
}
