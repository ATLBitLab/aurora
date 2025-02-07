import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = new Set([
  '/', // Home page
  '/api/auth', // Auth endpoint needs to be public for login
  '/api/auth/validate', // Auth validation endpoint
  '/_next', // Next.js internals
  '/favicon.ico',
  '/public',
]);

// Add protected API paths that should always check auth
const protectedApiPaths = new Set([
  '/api/phoenix',
  '/api/contacts',
  '/api/node',
]);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow public paths
  if (publicPaths.has(path) || publicPaths.has(path.split('/')[1])) {
    return NextResponse.next();
  }

  // Check for authentication
  const authCookie = request.cookies.get('nostr_auth');
  if (!authCookie) {
    // For API routes, return 401
    if (path.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // For pages, redirect to home
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('returnUrl', path);
    return NextResponse.redirect(url);
  }

  // Validate super admin
  const superAdminNpub = process.env.AURORA_SUPER_ADMIN;
  if (!superAdminNpub || authCookie.value !== superAdminNpub) {
    // For API routes, return 403
    if (path.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // For pages, redirect to home
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure the paths that middleware will run on
export const config = {
  matcher: [
    // Match all paths except static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 