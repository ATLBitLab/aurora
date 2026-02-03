import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

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
    console.error('Failed to fetch payment destinations:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
