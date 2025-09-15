import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/server/auth/config'
import { prisma } from '@/lib/prisma'
import { membershipRequestSchema } from '@/lib/validations'
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

    // Rate limiting: 3 membership requests per day
    await enforceRateLimit('MEMBERSHIP_REQUEST', user.id)

    const body = await request.json()
    const input = membershipRequestSchema.parse(body)

    // Check if membership already exists
    const existingMembership = await prisma.membership.findUnique({
      where: {
        userId_hoaId: {
          userId: user.id,
          hoaId: input.hoaId
        }
      }
    })

    if (existingMembership) {
      return NextResponse.json(
        { error: 'Membership request already exists' },
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

    // Create membership request
    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        hoaId: input.hoaId,
        note: input.note,
        status: 'PENDING',
        role: 'MEMBER'
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
        action: 'REQUEST_MEMBERSHIP',
        targetType: 'MEMBERSHIP',
        targetId: membership.id,
        metadata: {
          hoaId: input.hoaId,
          note: input.note
        }
      }
    })

    return NextResponse.json({
      id: membership.id,
      status: membership.status,
      role: membership.role,
      note: membership.note,
      createdAt: membership.createdAt,
      hoa: membership.hoa,
      user: membership.user
    }, { status: 201 })

  } catch (error) {
    console.error('Create membership error:', error)
    
    if (error instanceof Error && error.name === 'RateLimitError') {
      return NextResponse.json(
        { error: 'Rate limit exceeded. You can only submit 3 membership requests per day.' },
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
