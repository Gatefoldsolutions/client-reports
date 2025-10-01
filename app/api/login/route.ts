// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { getUserTable, type Role } from '../../../lib/users';

function envOrThrow(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} missing`);
  return v;
}

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: 'Email and password required' }, { status: 400 });
  }

  const users = getUserTable();
  const rec = users[email.toLowerCase()];

  if (!rec || rec.password !== password) {
    return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
  }

  const jwtSecret = new TextEncoder().encode(envOrThrow('JWT_SECRET'));
  const role: Role = rec.role;

  const token = await new SignJWT({ sub: email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(jwtSecret);

  const res = NextResponse.json({ ok: true, role });
  res.cookies.set('auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
