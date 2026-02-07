import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = new Set([
  '/', // Home page
  '/api/auth', // Auth endpoints need to be public for login
  '/_next', // Next.js internals
  '/favicon.ico',
  '/public',
]);

// Check if a path is public
function isPublicPath(path: string): boolean {
  // Exact match
  if (publicPaths.has(path)) return true;
  
  // Path prefix match
  const firstSegment = path.split('/')[1];
  if (publicPaths.has(firstSegment) || publicPaths.has('/' + firstSegment)) return true;
  
  // Better Auth API routes
  if (path.startsWith('/api/auth')) return true;
  
  return false;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow public paths
  if (isPublicPath(path)) {
    return NextResponse.next();
  }

  // Check for Better Auth session token
  const sessionToken = request.cookies.get('better-auth.session_token');
  
  if (!sessionToken) {
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

  return NextResponse.next();
}

// Configure the paths that middleware will run on
export const config = {
  matcher: [
    // Match all paths except static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
