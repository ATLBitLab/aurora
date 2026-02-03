import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

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

    // Count unique prisms for this contact through payment destinations -> splits -> prisms
    const prismCount = await prisma.prism.count({
      where: {
        splits: {
          some: {
            paymentDestination: {
              contactId: id,
            },
          },
        },
      },
    });

    return NextResponse.json({ count: prismCount });
  } catch (error) {
    console.error('Error fetching prism count:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
