import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

// Middleware configuration: specify which paths to run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// List of paths that do not require authentication.
const PUBLIC_PATHS = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if the current path is a public path.
  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  if (isPublicPath) {
    // Allow access to public paths without authentication.
    return NextResponse.next();
  }

  // 2. Get the authentication token from the cookies.
  const token = request.cookies.get('token')?.value;

  // 3. If there is no token, redirect to the login page.
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Verify the token.
  try {
    await verifyAuth(token);
    // If the token is valid, allow the request to proceed.
    return NextResponse.next();
  } catch (err) {
    // If token verification fails, redirect to the login page.
    console.error('Middleware Auth Error:', err);
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Clear the invalid token from the user's browser.
    response.cookies.delete('token');
    return response;
  }
}