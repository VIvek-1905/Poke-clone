import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Check if the user has a session cookie
  const session = request.cookies.get('trainer-session');

  // If they are trying to access the Portal ('/') WITHOUT a session, bounce them to Login
  if (!session && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If they are already logged in and try to visit the Login page, push them back to the Portal
  if (session && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Tell the security guard which routes to watch
export const config = {
  matcher: ['/', '/login'],
};