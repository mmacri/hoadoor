import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { searchSchema } from '@/lib/validations'
import { enforceRateLimit } from '@/server/ratelimit'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientIP = request.headers.get('x-forwarded-for') || 'anonymous'
    
    // Rate limiting
    await enforceRateLimit('SEARCH', clientIP)
    
    // Validate input
    const input = searchSchema.parse({
      q: searchParams.get('q') || undefined,
      location: searchParams.get('location') || undefined,
      state: searchParams.get('state') || undefined,
      city: searchParams.get('city') || undefined,
      ratingMin: searchParams.get('ratingMin') ? Number(searchParams.get('ratingMin')) : undefined,
      amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    })

    const skip = (input.page - 1) * input.limit

    // Build where clause
    const where: any = {}
    
    // Text search using PostgreSQL full-text search
    if (input.q) {
      const searchQuery = input.q.trim().replace(/\s+/g, ' & ')
      where.OR = [
        {
          name: {
            contains: input.q,
            mode: 'insensitive'
          }
        },
        {
          location: {
            contains: input.q,
            mode: 'insensitive'
          }
        },
        {
          city: {
            contains: input.q,
            mode: 'insensitive'
          }
        },
        {
          state: {
            contains: input.q,
            mode: 'insensitive'
          }
        },
        {
          amenities: {
            hasSome: input.q.split(' ')
          }
        }
      ]
    }

    // Location filters
    if (input.state) {
      where.state = {
        contains: input.state,
        mode: 'insensitive'
      }
    }

    if (input.city) {
      where.city = {
        contains: input.city,
        mode: 'insensitive'
      }
    }

    if (input.location) {
      where.location = {
        contains: input.location,
        mode: 'insensitive'
      }
    }

    // Amenities filter
    if (input.amenities && input.amenities.length > 0) {
      where.amenities = {
        hasEvery: input.amenities
      }
    }

    // Rating filter
    if (input.ratingMin) {
      where.ratingAggregate = {
        average: {
          gte: input.ratingMin
        }
      }
    }

    // Execute search
    const [hoas, total] = await Promise.all([
      prisma.hOA.findMany({
        where,
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
        },
        orderBy: [
          { ratingAggregate: { average: 'desc' } },
          { createdAt: 'desc' }
        ],
        skip,
        take: input.limit
      }),
      prisma.hOA.count({ where })
    ])

    const totalPages = Math.ceil(total / input.limit)
    const hasMore = input.page < totalPages

    return NextResponse.json({
      hoas: hoas.map(hoa => ({
        id: hoa.id,
        name: hoa.name,
        slug: hoa.slug,
        location: hoa.location,
        city: hoa.city,
        state: hoa.state,
        amenities: hoa.amenities,
        unitCount: hoa.unitCount,
        descriptionPublic: hoa.descriptionPublic,
        rating: hoa.ratingAggregate ? {
          average: hoa.ratingAggregate.average,
          count: hoa.ratingAggregate.count,
          breakdown: hoa.ratingAggregate.breakdown
        } : null,
        reviewCount: hoa._count.reviews,
        memberCount: hoa._count.memberships,
        createdAt: hoa.createdAt
      })),
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
        totalPages,
        hasMore
      }
    })

  } catch (error) {
    console.error('Search error:', error)
    
    if (error instanceof Error && error.name === 'RateLimitError') {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
