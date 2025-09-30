import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Client Reports',
  description: 'Secure client access',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inject brand color without touching TS types (no `any`)
  const brand = process.env.NEXT_PUBLIC_BRAND_COLOR || '#0f6abf';
  const styleTag = `:root { --brand-color: ${brand}; }`;

  return (
    <html lang="en">
      <head>
        <style>{styleTag}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
