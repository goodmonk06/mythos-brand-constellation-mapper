import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createMythicSymbolSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const communityId = searchParams.get('communityId')
    const category = searchParams.get('category')

    const where: any = {}
    if (communityId) where.communityId = communityId
    if (category) where.category = category

    const symbols = await prisma.mythicSymbol.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { constellationLinks: true },
        },
      },
    })

    return NextResponse.json({ symbols })
  } catch (error) {
    console.error('Error fetching symbols:', error)
    return NextResponse.json(
      { error: 'Failed to fetch symbols' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createMythicSymbolSchema.parse(body)

    const symbol = await prisma.mythicSymbol.create({
      data: validatedData,
    })

    return NextResponse.json({ symbol }, { status: 201 })
  } catch (error) {
    console.error('Error creating symbol:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create symbol' },
      { status: 500 }
    )
  }
}
