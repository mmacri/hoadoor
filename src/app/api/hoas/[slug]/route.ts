import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const hoa = await prisma.hOA.findUnique({
      where: { slug },
      include: {
        ratingAggregate: true,
        _count: {
          select: {
            reviews: {
              where: { status: 'APPROVED' }
            },
            memberships: {
              where: { status: 'APPROVED' }
            }
          }
        }
      }
    })

    if (!hoa) {
      return NextResponse.json(
        { error: 'HOA not found' },
        { status: 404 }
      )
    }

    // Get recent approved reviews with admin responses
    const recentReviews = await prisma.review.findMany({
      where: {
        hoaId: hoa.id,
        status: 'APPROVED'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        adminResponses: {
          include: {
            responder: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    return NextResponse.json({
      id: hoa.id,
      name: hoa.name,
      slug: hoa.slug,
      descriptionPublic: hoa.descriptionPublic,
      location: hoa.location,
      city: hoa.city,
      state: hoa.state,
      zipCode: hoa.zipCode,
      amenities: hoa.amenities,
      unitCount: hoa.unitCount,
      createdAt: hoa.createdAt,
      rating: hoa.ratingAggregate ? {
        average: hoa.ratingAggregate.average,
        count: hoa.ratingAggregate.count,
        breakdown: hoa.ratingAggregate.breakdown
      } : null,
      reviewCount: hoa._count.reviews,
      memberCount: hoa._count.memberships,
      recentReviews: recentReviews.map(review => ({
        id: review.id,
        stars: review.stars,
        text: review.text,
        createdAt: review.createdAt,
        user: review.isAnonymous ? { name: 'Anonymous' } : review.user,
        adminResponses: review.adminResponses.map(response => ({
          id: response.id,
          text: response.text,
          createdAt: response.createdAt,
          responder: response.responder
        }))
      }))
    })

  } catch (error) {
    console.error('Get HOA error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
