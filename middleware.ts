import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = new Set([
  '/',
  '/api/phoenix', // Keep API endpoints accessible
]);

export function middleware(request: NextRequest) {
  // Check if the path requires authentication
  const path = request.nextUrl.pathname;
  if (publicPaths.has(path)) {
    return NextResponse.next();
  }

  // Check for authentication
  const authCookie = request.cookies.get('nostr_auth');
  if (!authCookie) {
    // Redirect to home page with original URL as return path
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('returnUrl', path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure the paths that middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 