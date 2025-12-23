import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await requireSuperAdmin();

    // Get unique prisms for this contact through payment destinations -> splits -> prisms
    const prisms = await prisma.prism.findMany({
      where: {
        splits: {
          some: {
            paymentDestination: {
              contactId: id,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      distinct: ['id'],
    });

    // For now, prisms don't have thumbnails in the schema
    // When thumbnail support is added, it can be included here
    const prismsWithThumbnails = prisms.map(prism => ({
      id: prism.id,
      name: prism.name,
      slug: prism.slug,
      thumbnail: null, // Will show blank thumbnail if no profile is set
    }));

    return NextResponse.json({ prisms: prismsWithThumbnails, count: prisms.length });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    console.error('Error fetching shared prisms:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

