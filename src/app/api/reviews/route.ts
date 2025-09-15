import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/server/auth/config'
import { prisma } from '@/lib/prisma'
import { createReviewSchema } from '@/lib/validations'
import { enforceRateLimit } from '@/server/ratelimit'
import { getSessionUser } from '@/server/permissions'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = await getSessionUser(session)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Rate limiting: 5 reviews per day per user
    await enforceRateLimit('REVIEW_SUBMISSION', user.id)

    const body = await request.json()
    const input = createReviewSchema.parse(body)

    // Check if user already reviewed this HOA
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        hoaId: input.hoaId
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this HOA' },
        { status: 400 }
      )
    }

    // Verify HOA exists
    const hoa = await prisma.hOA.findUnique({
      where: { id: input.hoaId }
    })

    if (!hoa) {
      return NextResponse.json(
        { error: 'HOA not found' },
        { status: 404 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        hoaId: input.hoaId,
        stars: input.stars,
        text: input.text,
        isAnonymous: input.isAnonymous,
        status: 'PENDING' // All reviews start as pending
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        hoa: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    // Log audit trail
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'CREATE_REVIEW',
        targetType: 'REVIEW',
        targetId: review.id,
        metadata: {
          hoaId: input.hoaId,
          stars: input.stars,
          isAnonymous: input.isAnonymous
        }
      }
    })

    return NextResponse.json({
      id: review.id,
      stars: review.stars,
      text: review.text,
      isAnonymous: review.isAnonymous,
      status: review.status,
      createdAt: review.createdAt,
      hoa: review.hoa,
      user: review.isAnonymous ? null : {
        id: review.user.id,
        name: review.user.name
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create review error:', error)
    
    if (error instanceof Error && error.name === 'RateLimitError') {
      return NextResponse.json(
        { error: 'Rate limit exceeded. You can only submit 5 reviews per day.' },
        { status: 429 }
      )
    }

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hoaId = searchParams.get('hoaId')
    const page = Number(searchParams.get('page')) || 1
    const limit = Math.min(Number(searchParams.get('limit')) || 10, 50)
    const skip = (page - 1) * limit

    if (!hoaId) {
      return NextResponse.json(
        { error: 'HOA ID is required' },
        { status: 400 }
      )
    }

    // Only return approved reviews for public viewing
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          hoaId,
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
        skip,
        take: limit
      }),
      prisma.review.count({
        where: {
          hoaId,
          status: 'APPROVED'
        }
      })
    ])

    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    return NextResponse.json({
      reviews: reviews.map(review => ({
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
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore
      }
    })

  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
