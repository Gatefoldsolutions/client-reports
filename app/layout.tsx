import type { Metadata } from 'next';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'Client Reports',
  description: 'Secure client access',
};

// Allow custom CSS var
type BrandStyle = React.CSSProperties & { ['--brand-color']?: string };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const bodyStyle: BrandStyle = {
    ['--brand-color']: process.env.NEXT_PUBLIC_BRAND_COLOR || '#0f6abf',
  };

  return (
    <html lang="en">
      <body style={bodyStyle}>{children}</body>
    </html>
  );
}
