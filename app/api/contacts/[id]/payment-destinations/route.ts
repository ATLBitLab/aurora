import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const destinations = await prisma.paymentDestination.findMany({
      where: {
        contactId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(destinations);
  } catch (error) {
    console.error('Failed to fetch payment destinations:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { value, type } = body;

    if (!value || !type) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Check if contact exists
    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return new NextResponse('Contact not found', { status: 404 });
    }

    // Create new payment destination
    const destination = await prisma.paymentDestination.create({
      data: {
        value,
        type,
        contactId: id,
      },
    });

    return NextResponse.json(destination);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return new NextResponse('This payment destination already exists for this contact', {
        status: 409,
      });
    }
    console.error('Failed to create payment destination:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const destinationId = url.searchParams.get('destinationId');

    if (!destinationId) {
      return new NextResponse('Missing destinationId', { status: 400 });
    }

    // Delete the payment destination
    await prisma.paymentDestination.delete({
      where: {
        id: destinationId,
        contactId: id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete payment destination:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
