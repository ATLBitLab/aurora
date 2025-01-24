import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  // Check for authentication
  const authCookie = request.cookies.get('nostr_auth');
  if (!authCookie) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const contacts = await prisma.contact.findMany({
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' },
        { screenName: 'asc' }
      ]
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Check for authentication
  const authCookie = request.cookies.get('nostr_auth');
  if (!authCookie) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
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
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
} 