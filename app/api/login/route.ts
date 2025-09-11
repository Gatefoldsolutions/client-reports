import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const USERS = [{ email: process.env.ADMIN_EMAIL!, password: process.env.ADMIN_PASSWORD!, role: 'admin' }];

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = USERS.find(u => u.email === email && u.password === password);
  if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const token = await new SignJWT({ sub: email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret);

  const res = NextResponse.json({ ok: true, redirectTo: req.nextUrl.searchParams.get('next') || '/dashboard' });
  res.cookies.set('auth', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return res;
}
