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
    console.error('Error fetching shared prisms:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
