import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { npub } = await request.json();
    
    if (!npub || typeof npub !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: npub is required' },
        { status: 400 }
      );
    }

    const superAdminNpub = process.env.AURORA_SUPER_ADMIN;
    console.log('Auth - Comparing npubs:', {
      provided: npub,
      superAdmin: superAdminNpub
    });

    if (!superAdminNpub) {
      console.error('AURORA_SUPER_ADMIN environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (npub !== superAdminNpub) {
      console.log('Auth - Unauthorized: npub does not match AURORA_SUPER_ADMIN');
      return NextResponse.json(
        { error: 'Unauthorized: Super Admin access required' },
        { status: 401 }
      );
    }

    console.log('Auth - Creating response with cookies');

    // Create response with auth cookies
    const response = NextResponse.json({ success: true });
    
    // Set httpOnly cookie for security
    response.cookies.set('nostr_auth', npub, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed back to lax to allow redirects
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
    });

    // Set readable cookie for UI state
    response.cookies.set('nostr_auth_state', 'true', { 
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed back to lax to allow redirects
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
    });

    console.log('Auth - Cookies set:', {
      nostr_auth: response.cookies.get('nostr_auth'),
      nostr_auth_state: response.cookies.get('nostr_auth_state')
    });

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  console.log('Auth - Logging out, clearing cookies');
  const response = NextResponse.json({ success: true });
  
  // Clear both cookies with same settings
  response.cookies.set('nostr_auth', '', { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
  
  response.cookies.set('nostr_auth_state', '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });

  console.log('Auth - Cookies cleared');
  
  return response;
} 