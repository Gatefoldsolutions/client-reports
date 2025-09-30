// app/api/logout/route.ts
import { NextResponse } from 'next/server';

function clearCookie(res: NextResponse) {
  res.cookies.set('auth', '', { httpOnly: true, path: '/', maxAge: 0 });
}

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/login', req.url));
  clearCookie(res);
  return res;
}

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL('/login', req.url));
  clearCookie(res);
  return res;
}
