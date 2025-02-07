import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateSuperAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('nostr_auth');
    console.log('Validation - Auth cookie:', authCookie?.value);
    console.log('Validation - Super admin npub:', process.env.AURORA_SUPER_ADMIN);

    const isAuthorized = await validateSuperAdmin(authCookie?.value);
    console.log('Validation - Is authorized:', isAuthorized);

    if (!isAuthorized) {
      console.log('Validation - Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Validation failed' },
      { status: 500 }
    );
  }
} 