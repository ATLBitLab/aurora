import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireSuperAdmin();

    const prism = await prisma.prism.findUnique({
      where: { id: params.id },
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

    if (!prism) {
      return NextResponse.json({ error: 'Prism not found' }, { status: 404 });
    }

    return NextResponse.json(prism);
  } catch (error) {
    console.error('GET Error:', error instanceof Error ? error.message : 'Unknown error');
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireSuperAdmin();

    const body = await request.json();
    const { name, slug, description, active, splits } = body;

    // Validate required fields
    if (!name || !slug || !splits?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert percentage strings to numbers and validate total equals 100%
    const totalPercentage = splits.reduce(
      (sum: number, split: { percentage: string | number }) => 
        sum + Number(split.percentage),
      0
    );

    if (Math.abs(totalPercentage - 1) > 0.0001) {
      return NextResponse.json(
        { error: 'Total percentage must equal 100%' },
        { status: 400 }
      );
    }

    // First, check if the prism exists
    const existingPrism = await prisma.prism.findUnique({
      where: { id: params.id },
    });

    if (!existingPrism) {
      return NextResponse.json({ error: 'Prism not found' }, { status: 404 });
    }

    // Update prism and splits in a transaction
    await prisma.$transaction([
      // Update the prism
      prisma.prism.update({
        where: { id: params.id },
        data: {
          name,
          slug,
          description,
          active,
        },
      }),
      // Delete existing splits
      prisma.split.deleteMany({
        where: { prismId: params.id },
      }),
      // Create new splits
      prisma.split.createMany({
        data: splits.map((split: {
          destinationId: string;
          percentage: string | number;
          description?: string;
        }) => ({
          prismId: params.id,
          destinationId: split.destinationId,
          percentage: Number(split.percentage),
          description: split.description,
        })),
      }),
    ]);

    // Fetch the updated prism with all its relations
    const updatedPrism = await prisma.prism.findUnique({
      where: { id: params.id },
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

    if (!updatedPrism) {
      return NextResponse.json(
        { error: 'Failed to fetch updated prism' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedPrism);
  } catch (error) {
    console.error('PUT Error:', error instanceof Error ? error.message : 'Unknown error');

    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return NextResponse.json(
            { error: 'A prism with this slug already exists' },
            { status: 409 }
          );
        }
      }
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireSuperAdmin();

    const prism = await prisma.prism.delete({
      where: { id: params.id },
    });

    return NextResponse.json(prism);
  } catch (error) {
    console.error('DELETE Error:', error instanceof Error ? error.message : 'Unknown error');

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 