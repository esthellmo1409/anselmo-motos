import { NextResponse, type NextRequest } from 'next/server';

/** Proteção básica do painel. Troque por login real (NextAuth, Clerk…) antes de escalar a equipe. */
export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass) return new NextResponse('Painel desativado: defina ADMIN_USER e ADMIN_PASSWORD.', { status: 503 });

  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    const [u, p] = atob(auth.slice(6)).split(':');
    if (u === user && p === pass) return NextResponse.next();
  }
  return new NextResponse('Acesso restrito', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Painel Anselmo Motos"' },
  });
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
