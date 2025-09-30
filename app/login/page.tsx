import { Suspense } from 'react';
import LoginClient from './LoginClient';

// Avoid static prerendering issues for /login
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}
