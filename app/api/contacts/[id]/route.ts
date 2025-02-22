import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireSuperAdmin } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await Promise.resolve(context.params);

  try {
    await requireSuperAdmin();

    const contact = await prisma.contact.findUnique({
      where: { id }
    });

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error in GET /api/contacts/[id]:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await Promise.resolve(context.params);

  try {
    await requireSuperAdmin();

    const data = await request.json();
    
    const contact = await prisma.contact.update({
      where: { id },
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
    console.error('Error in PUT /api/contacts/[id]:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
} 