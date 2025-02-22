import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { validateSuperAdmin } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get the auth cookie
    const authCookie = request.cookies.get('nostr_auth');
    console.log('Auth cookie:', authCookie?.value);
    console.log('Super admin npub:', process.env.AURORA_SUPER_ADMIN);

    // Validate super admin
    const isAuthorized = await validateSuperAdmin(authCookie?.value);
    console.log('Is authorized:', isAuthorized);

    if (!isAuthorized) {
      console.log('Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const contacts = await prisma.contact.findMany({
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' },
        { screenName: 'asc' }
      ]
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error in GET /api/contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the auth cookie
    const authCookie = request.cookies.get('nostr_auth');
    console.log('Auth cookie:', authCookie?.value);
    
    // Validate super admin
    const isAuthorized = await validateSuperAdmin(authCookie?.value);
    console.log('Is authorized:', isAuthorized);

    if (!isAuthorized) {
      console.log('Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Create the contact
    const contact = await prisma.contact.create({
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        screenName: data.screenName || null,
        email: data.email || null,
        nostrPubkey: data.nostrPubkey || null,
        metadata: data.metadata || {},
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error in POST /api/contacts:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
} 