import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateSuperAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get the auth cookie and validate super admin
    const authCookie = request.cookies.get('nostr_auth');
    const isAuthorized = await validateSuperAdmin(authCookie?.value);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const phoenixHost = process.env.PHOENIXD_HOST;
    const phoenixPass = process.env.PHOENIXD_HTTP_PASS_LIMITED;

    if (!phoenixHost || !phoenixPass) {
      return NextResponse.json(
        { error: 'Phoenix configuration not found' },
        { status: 500 }
      );
    }

    const response = await fetch(`http://${phoenixHost}:9740/getinfo`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`:${phoenixPass}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Phoenix API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Phoenix API response:', JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Phoenix info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Phoenix info' },
      { status: 500 }
    );
  }
} 