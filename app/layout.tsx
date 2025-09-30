// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Client Reports',
  description: 'Secure client access',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          // makes the color available everywhere in CSS-in-JS:
          ['--brand-color' as any]: process.env.NEXT_PUBLIC_BRAND_COLOR || '#0f6abf',
        }}
      >
        {children}
      </body>
    </html>
  );
}
