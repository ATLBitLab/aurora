import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const prisms = await prisma.prism.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(prisms);
  } catch (error) {
    console.error('Failed to fetch prisms:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, splits } = body;

    // Validate required fields
    if (!name || !slug || !splits?.length) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Validate total percentage equals 100%
    const totalPercentage = splits.reduce(
      (sum: number, split: { percentage: number }) => sum + split.percentage,
      0
    );
    if (Math.abs(totalPercentage - 1) > 0.0001) {
      return new NextResponse('Total percentage must equal 100%', { status: 400 });
    }

    // Create prism and splits in a transaction
    const prism = await prisma.$transaction(async (tx) => {
      // Create the prism
      const newPrism = await tx.prism.create({
        data: {
          name,
          slug,
          description,
        },
      });

      // Create all splits
      await tx.split.createMany({
        data: splits.map((split: {
          destinationId: string;
          percentage: number;
          description?: string;
        }) => ({
          prismId: newPrism.id,
          destinationId: split.destinationId,
          percentage: split.percentage,
          description: split.description,
        })),
      });

      // Return the created prism with its splits
      return tx.prism.findUnique({
        where: { id: newPrism.id },
        include: {
          splits: {
            include: {
              paymentDestination: {
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
              },
            },
          },
        },
      });
    });

    return NextResponse.json(prism);
  } catch (error) {
    console.error('Failed to create prism:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
