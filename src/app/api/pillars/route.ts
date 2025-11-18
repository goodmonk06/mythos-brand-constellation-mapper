import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createBrandPillarSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const communityId = searchParams.get('communityId')

    const where: any = {}
    if (communityId) where.communityId = communityId

    const pillars = await prisma.brandPillar.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { constellationLinks: true },
        },
      },
    })

    return NextResponse.json({ pillars })
  } catch (error) {
    console.error('Error fetching pillars:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pillars' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createBrandPillarSchema.parse(body)

    const pillar = await prisma.brandPillar.create({
      data: validatedData,
    })

    return NextResponse.json({ pillar }, { status: 201 })
  } catch (error) {
    console.error('Error creating pillar:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create pillar' },
      { status: 500 }
    )
  }
}
