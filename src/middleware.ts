import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { devLog } from './lib/logger';

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
const PUBLIC_PATHS = ['/', '/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('token')?.value;

  devLog(pathname, token ? 'TOKEN' : 'NO TOKEN ')

  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  if (!token && isPublicPath) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await verifyAuth(token);
    if(isPublicPath) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } 
    return NextResponse.next();
    
  } catch (err) {
    console.error('Middleware Auth Error:', err);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}