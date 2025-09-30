// app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // send anyone hitting "/" to the login page
  redirect('/login');
}

// (optional) ensure this page is always resolved at request time
export const dynamic = 'force-dynamic';
