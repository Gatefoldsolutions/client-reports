export const metadata = { title: 'Client Reports' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body style={{ background: '#f0f0f1', margin: 0 }}>{children}</body></html>);
}
