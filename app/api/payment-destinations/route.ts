import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    await requireSuperAdmin();

    const destinations = await prisma.paymentDestination.findMany({
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            screenName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(destinations);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    console.error('Failed to fetch payment destinations:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 