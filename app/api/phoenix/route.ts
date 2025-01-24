import { NextResponse } from 'next/server';

export async function GET() {
  try {
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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Phoenix info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Phoenix info' },
      { status: 500 }
    );
  }
} 