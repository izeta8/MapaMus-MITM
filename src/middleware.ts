import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization');
  const url = request.nextUrl;

  const authUser = process.env.AUTH_USER;
  const authPass = process.env.AUTH_PASS;

  if (authUser && authPass) {
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, password] = atob(authValue).split(':');

      if (user === authUser && password === authPass) {
        return NextResponse.next();
      }
    }

    return new NextResponse('Auth Required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
